import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// ─────────────────────────────────────────────────────────────────────────────
// User store backed by Neon (serverless Postgres).
//
// Scan sources, spent in this priority order:
//   1. Free scans        — SCAN_LIMIT (3) lifetime per account
//   2. Plan scans        — monthly allowance from an active subscription;
//                          resets every billing period, unused scans expire
//   3. Legacy credits    — kept for users who bought one-time packs before we
//                          switched to subscriptions; still honored
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
  passwordHash: string | null;
  provider: "credentials" | "google";
  scansUsed: number;
  /** Legacy one-time-purchase credits (still honored). */
  scanCredits: number;
  /** Active plan tier (basic/plus/pro/ultra) or null. */
  plan: string | null;
  planScansUsed: number;
  planScansLimit: number;
  /** End of the current paid billing period. Plan scans expire after this. */
  planPeriodEnd: string | null;
  subscriptionId: string | null;
  createdAt: string;
}

export type SafeUser = Omit<StoredUser, "passwordHash">;

export function toSafeUser(u: StoredUser): SafeUser {
  const { passwordHash: _omit, ...safe } = u;
  void _omit;
  return safe;
}

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

// ── Scan-availability helpers ────────────────────────────────────────────────

/** Free scans still available (of the SCAN_LIMIT lifetime allowance). */
export function remainingFreeScans(u: Pick<StoredUser, "scansUsed">): number {
  return Math.max(0, SCAN_LIMIT - u.scansUsed);
}

/**
 * Is the user's plan currently within its paid billing period?
 * A canceled subscription still counts here until the period actually ends.
 */
export function isPlanActive(u: Pick<StoredUser, "plan" | "planPeriodEnd">): boolean {
  if (!u.plan || !u.planPeriodEnd) return false;
  return new Date(u.planPeriodEnd).getTime() > Date.now();
}

/** Plan scans left in this billing period (0 if no active plan). */
export function remainingPlanScans(
  u: Pick<StoredUser, "plan" | "planPeriodEnd" | "planScansUsed" | "planScansLimit">
): number {
  if (!isPlanActive(u)) return 0;
  return Math.max(0, u.planScansLimit - u.planScansUsed);
}

/** Total scans available to spend: free + plan (if active) + legacy credits. */
export function availableScans(
  u: Pick<StoredUser, "scansUsed" | "scanCredits" | "plan" | "planPeriodEnd" | "planScansUsed" | "planScansLimit">
): number {
  return remainingFreeScans(u) + remainingPlanScans(u) + (u.scanCredits ?? 0);
}

// Kept as an alias so old imports don't break — points at the free-only helper.
export const remainingScans = remainingFreeScans;

// ── Row mapping ──────────────────────────────────────────────────────────────

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  provider: string;
  scans_used: number | string;
  scan_credits: number | string | null;
  plan: string | null;
  plan_scans_used: number | string | null;
  plan_scans_limit: number | string | null;
  plan_period_end: string | Date | null;
  subscription_id: string | null;
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
    plan: r.plan,
    planScansUsed: Number(r.plan_scans_used ?? 0),
    planScansLimit: Number(r.plan_scans_limit ?? 0),
    planPeriodEnd: r.plan_period_end ? new Date(r.plan_period_end as string).toISOString() : null,
    subscriptionId: r.subscription_id,
    createdAt: r.created_at ? new Date(r.created_at as string).toISOString() : new Date().toISOString(),
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const q = sql();
  const rows = (await q`SELECT * FROM users WHERE email = ${normalizeEmail(email)} LIMIT 1`) as UserRow[];
  return rows[0] ? rowToUser(rows[0]) : null;
}

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

export async function verifyCredentials(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? toSafeUser(user) : null;
}

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
 * Atomically consume one scan.
 *
 * Spend order (all evaluated on the pre-update row for race-safety):
 *   1. free scan       — if scans_used < SCAN_LIMIT
 *   2. plan scan       — if plan is active and plan_scans_used < plan_scans_limit
 *   3. legacy credit   — if scan_credits > 0
 *
 * Returns total scans remaining AFTER the spend, or -1 if the user has nothing
 * left (caller should reject).
 */
export async function consumeScan(email: string): Promise<number> {
  const q = sql();
  const nowIso = new Date().toISOString();
  const rows = (await q`
    UPDATE users
    SET
      scans_used = scans_used
        + (CASE WHEN scans_used < ${SCAN_LIMIT} THEN 1 ELSE 0 END),
      plan_scans_used = plan_scans_used
        + (CASE
             WHEN scans_used >= ${SCAN_LIMIT}
              AND plan IS NOT NULL
              AND plan_period_end IS NOT NULL
              AND plan_period_end > ${nowIso}
              AND plan_scans_used < plan_scans_limit
             THEN 1 ELSE 0
           END),
      scan_credits = scan_credits
        - (CASE
             WHEN scans_used >= ${SCAN_LIMIT}
              AND NOT (plan IS NOT NULL AND plan_period_end IS NOT NULL AND plan_period_end > ${nowIso} AND plan_scans_used < plan_scans_limit)
              AND scan_credits > 0
             THEN 1 ELSE 0
           END)
    WHERE email = ${normalizeEmail(email)}
      AND (
        scans_used < ${SCAN_LIMIT}
        OR (plan IS NOT NULL AND plan_period_end IS NOT NULL AND plan_period_end > ${nowIso} AND plan_scans_used < plan_scans_limit)
        OR scan_credits > 0
      )
    RETURNING scans_used, scan_credits, plan, plan_scans_used, plan_scans_limit, plan_period_end`) as UserRow[];
  if (!rows[0]) return -1;
  return availableScans(rowToUser(rows[0]));
}

// ── Subscription lifecycle (called from the Paddle webhook) ──────────────────

/**
 * Activate or renew a subscription. Sets plan/limit/period from the event and
 * resets the monthly scan counter to 0 (fresh cycle starts). Idempotent: if the
 * same period end is already recorded, we DO NOT reset the counter again — so a
 * duplicate webhook won't restore scans a user just spent.
 */
export async function activateSubscription(input: {
  email: string;
  subscriptionId: string;
  plan: string;
  scansLimit: number;
  periodEnd: Date;
}): Promise<void> {
  const q = sql();
  const email = normalizeEmail(input.email);
  const periodEndIso = input.periodEnd.toISOString();
  await q`
    UPDATE users SET
      subscription_id  = ${input.subscriptionId},
      plan             = ${input.plan},
      plan_scans_limit = ${input.scansLimit},
      plan_period_end  = ${periodEndIso},
      -- Reset used-count only when the billing period is genuinely new.
      plan_scans_used  = CASE
        WHEN plan_period_end IS NULL OR plan_period_end <> ${periodEndIso}
          THEN 0
        ELSE plan_scans_used
      END
    WHERE email = ${email}`;
}

/**
 * Handle subscription.canceled — user cancelled but Paddle keeps them on their
 * plan until the current period ends. So we DO NOT clear anything now; the plan
 * naturally expires when `plan_period_end` passes (isPlanActive returns false).
 * We just record the subscription id so we can spot the same sub if it comes
 * back. Kept as a hook so we can also send a "sorry to see you go" email later.
 */
export async function noteSubscriptionCanceled(_email: string, _subscriptionId: string): Promise<void> {
  // Intentionally no DB change: end-of-period is handled by lazy checks.
  void _email;
  void _subscriptionId;
}
