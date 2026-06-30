// One-time database setup for Neon Postgres.
//
//   npm run db:setup
//
// Creates the `users` table (idempotent) and seeds any ADMIN_EMAILS accounts
// with the password from ADMIN_SEED_PASSWORD so they can sign in immediately.
// Reads env from .env.local via Node's --env-file flag (see package.json).

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL is not set. Add your Neon connection string to .env.local first.");
  process.exit(1);
}

const sql = neon(url);

console.log("Connecting to Neon…");

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    name          TEXT,
    password_hash TEXT,
    provider      TEXT NOT NULL DEFAULT 'credentials',
    scans_used    INTEGER NOT NULL DEFAULT 0,
    scan_credits  INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
// Idempotent migration for databases created before scan_credits existed.
await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS scan_credits INTEGER NOT NULL DEFAULT 0`;
console.log("✓ users table ready");

// Purchases — one row per paid Stripe checkout. The UNIQUE session_id makes
// crediting idempotent (webhook + success page can both fire safely).
await sql`
  CREATE TABLE IF NOT EXISTS purchases (
    id           TEXT PRIMARY KEY,
    session_id   TEXT UNIQUE NOT NULL,
    email        TEXT NOT NULL,
    package_id   TEXT NOT NULL,
    scans        INTEGER NOT NULL,
    amount_cents INTEGER NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
console.log("✓ purchases table ready");

// Seed admin accounts (optional).
const admins = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const seedPassword = process.env.ADMIN_SEED_PASSWORD;

if (admins.length && seedPassword) {
  const hash = await bcrypt.hash(seedPassword, 10);
  for (const email of admins) {
    const rows = await sql`
      INSERT INTO users (id, email, name, password_hash, provider, scans_used, created_at)
      VALUES (${randomUUID()}, ${email}, 'Admin', ${hash}, 'credentials', 0, now())
      ON CONFLICT (email) DO NOTHING
      RETURNING email`;
    console.log(rows[0] ? `✓ seeded admin ${email}` : `• admin ${email} already exists (left unchanged)`);
  }
} else if (admins.length) {
  console.log("• ADMIN_EMAILS set but ADMIN_SEED_PASSWORD missing — skipped seeding admin passwords.");
}

const [{ count }] = await sql`SELECT count(*)::int AS count FROM users`;
console.log(`Done. users table has ${count} row(s).`);
