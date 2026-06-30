import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// ─────────────────────────────────────────────────────────────────────────────
// User store backed by Neon (serverless Postgres).
//
// Works the same locally and in production (it's a remote DB over HTTP), and is
// safe for serverless/multi-instance deploys. Run `npm run db:setup` once to
// create the table (and seed admin accounts).
// ─────────────────────────────────────────────────────────────────────────────

/** Lifetime free scans granted to every (non-admin) account. */
export const SCAN_LIMIT = 3;

const BCRYPT_ROUNDS = 10;

type Sql = ReturnType<typeof neon>;
let _sql: Sql | null = null;

function sql(): Sql {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Add your Neon connection string to .env.local " +
          "(see README → Database), then run `npm run db:setup`."
      );
    }
    _sql = neon(url);
  }
  return _sql;
}

export interface StoredUser {
  id: string;
  email: string;
  name: string | null;
  /** bcrypt hash; null for OAuth-only accounts (e.g. Google) that have no password. */
  passwordHash: string | null;
  provider: "credentials" | "google";
  scansUsed: number;
  /** Purchased scans remaining (on top of the free allowance). */
  scanCredits: number;
  createdAt: string;
}

/** Public view of a user — never leaks the password hash. */
export type SafeUser = Omit<StoredUser, "passwordHash">;

export function toSafeUser(u: StoredUser): SafeUser {
  const { passwordHash: _omit, ...safe } = u;
  void _omit;
  return safe;
}

/** Free scans still available (ignores purchased credits). */
export function remainingScans(u: Pick<StoredUser, "scansUsed">): number {
  return Math.max(0, SCAN_LIMIT - u.scansUsed);
}

/** Total scans available to spend: remaining free + purchased credits. */
export function availableScans(u: Pick<StoredUser, "scansUsed" | "scanCredits">): number {
  return remainingScans(u) + (u.scanCredits ?? 0);
}

/**
 * Admin accounts (listed in the ADMIN_EMAILS env var, comma-separated) bypass
 * the scan limit entirely: unlimited analyses, never decremented.
 */
export function isAdminEmail(email: string): boolean {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(normalizeEmail(email));
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ── Row mapping ──────────────────────────────────────────────────────────────

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  provider: string;
  scans_used: number | string;
  scan_credits: number | string | null;
  created_at: string | Date;
}

function rowToUser(r: UserRow): StoredUser {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    passwordHash: r.password_hash,
    provider: r.provider === "google" ? "google" : "credentials",
    scansUsed: Number(r.scans_used),
    scanCredits: Number(r.scan_credits ?? 0),
    createdAt: r.created_at ? new Date(r.created_at as string).toISOString() : new Date().toISOString(),
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const q = sql();
  const rows = (await q`SELECT * FROM users WHERE email = ${normalizeEmail(email)} LIMIT 1`) as UserRow[];
  return rows[0] ? rowToUser(rows[0]) : null;
}

/**
 * Create a password-based account. Throws "EMAIL_TAKEN" if one already exists.
 */
export async function createUser(input: {
  email: string;
  password: string;
  name?: string | null;
}): Promise<SafeUser> {
  const email = normalizeEmail(input.email);
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const name = input.name?.trim() || null;
  const q = sql();
  const rows = (await q`
    INSERT INTO users (id, email, name, password_hash, provider, scans_used, created_at)
    VALUES (${randomUUID()}, ${email}, ${name}, ${passwordHash}, 'credentials', 0, now())
    ON CONFLICT (email) DO NOTHING
    RETURNING *`) as UserRow[];
  if (!rows[0]) throw new Error("EMAIL_TAKEN");
  return toSafeUser(rowToUser(rows[0]));
}

/**
 * Verify email + password for the Credentials provider.
 * Returns the user on success, null on any failure (unknown email, OAuth-only
 * account, or wrong password) — callers must not distinguish these.
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? toSafeUser(user) : null;
}

/**
 * Upsert an OAuth (Google) user on sign-in so we can track their scan quota.
 * Creates the record the first time; returns the existing one afterwards
 * (backfilling the name if Google provides one we didn't have).
 */
export async function upsertOAuthUser(input: {
  email: string;
  name?: string | null;
}): Promise<SafeUser> {
  const email = normalizeEmail(input.email);
  const name = input.name?.trim() || null;
  const q = sql();
  const rows = (await q`
    INSERT INTO users (id, email, name, password_hash, provider, scans_used, created_at)
    VALUES (${randomUUID()}, ${email}, ${name}, NULL, 'google', 0, now())
    ON CONFLICT (email) DO UPDATE SET name = COALESCE(users.name, EXCLUDED.name)
    RETURNING *`) as UserRow[];
  return toSafeUser(rowToUser(rows[0]));
}

/**
 * Atomically consume one scan — a free scan first, then a purchased credit.
 * Returns total scans remaining AFTER the spend, or -1 if the user is missing or
 * has nothing left. A single conditional UPDATE keeps this race-free: Postgres
 * evaluates the SET expressions against the pre-update row values.
 */
export async function consumeScan(email: string): Promise<number> {
  const q = sql();
  const rows = (await q`
    UPDATE users
    SET scans_used   = scans_used   + (CASE WHEN scans_used < ${SCAN_LIMIT} THEN 1 ELSE 0 END),
        scan_credits = scan_credits - (CASE WHEN scans_used >= ${SCAN_LIMIT} AND scan_credits > 0 THEN 1 ELSE 0 END)
    WHERE email = ${normalizeEmail(email)}
      AND (scans_used < ${SCAN_LIMIT} OR scan_credits > 0)
    RETURNING scans_used, scan_credits`) as { scans_used: number | string; scan_credits: number | string }[];
  if (!rows[0]) return -1;
  return Math.max(0, SCAN_LIMIT - Number(rows[0].scans_used)) + Number(rows[0].scan_credits);
}

/**
 * Idempotently fulfill a paid Stripe Checkout session: record it (keyed on the
 * unique Stripe session id) and, only if it was newly recorded, add the
 * purchased scans to the user's balance. Safe to call from BOTH the webhook and
 * the success page — whichever runs first credits; the other is a no-op.
 */
export async function recordAndCreditPurchase(input: {
  sessionId: string;
  email: string;
  packageId: string;
  scans: number;
  amountCents: number;
}): Promise<{ credited: boolean; balance: number | null }> {
  const email = normalizeEmail(input.email);
  const q = sql();
  const inserted = (await q`
    INSERT INTO purchases (id, session_id, email, package_id, scans, amount_cents, created_at)
    VALUES (${randomUUID()}, ${input.sessionId}, ${email}, ${input.packageId}, ${input.scans}, ${input.amountCents}, now())
    ON CONFLICT (session_id) DO NOTHING
    RETURNING id`) as { id: string }[];

  // Already processed (duplicate webhook / page refresh) → don't double-credit.
  if (!inserted[0]) return { credited: false, balance: null };

  const rows = (await q`
    UPDATE users SET scan_credits = scan_credits + ${input.scans}
    WHERE email = ${email}
    RETURNING scans_used, scan_credits`) as { scans_used: number | string; scan_credits: number | string }[];
  if (!rows[0]) return { credited: true, balance: null };

  const balance =
    Math.max(0, SCAN_LIMIT - Number(rows[0].scans_used)) + Number(rows[0].scan_credits);
  return { credited: true, balance };
}
