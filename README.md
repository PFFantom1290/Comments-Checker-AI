# ReviewX

Paste any product URL → it reads the **real customer reviews** (scraping past bot
protection) and returns a plain **Buy / Don't Buy / Mixed** verdict with pros,
cons, and a summary — powered by GPT-4o-mini.

Accounts are required: each user gets **3 free scans** (sign in with email/password
or Google).

## Stack

- **Next.js 15** (App Router) · React 19 · TypeScript · Tailwind CSS
- **NextAuth v5 (Auth.js)** — Google OAuth + email/password credentials
- **Scraping**: [Jina AI Reader](https://jina.ai) → [ScraperAPI](https://www.scraperapi.com) fallback (required for Amazon)
- **AI**: OpenAI `gpt-4o-mini`
- **User store**: Neon serverless Postgres, bcrypt-hashed passwords

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create your env file**
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill it in:

   | Variable | Required? | Notes |
   |----------|-----------|-------|
   | `OPENAI_API_KEY` | ✅ | https://platform.openai.com/api-keys |
   | `AUTH_SECRET` | ✅ | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
   | `AUTH_TRUST_HOST` | ✅ (local) | Set to `true` |
   | `DATABASE_URL` | ✅ | Neon connection string (see Database below). |
   | `SCRAPERAPI_KEY` | ✅ for Amazon | Free 5,000 credits/mo at scraperapi.com. Without it, Amazon/CAPTCHA sites fail. |
   | `JINA_API_KEY` | optional | Works keyless (~200 req/day); a key raises limits. |
   | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | optional | Enables "Continue with Google" (see below). |
   | `ADMIN_EMAILS` | optional | Comma-separated emails granted **unlimited** scans (see below). |

3. **Set up the database** (one time — creates the `users` table and seeds admins)
   ```bash
   npm run db:setup
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 — you'll be redirected to `/login`. Register an
   account, then start analyzing.

## Database (Neon)

The app stores accounts in [Neon](https://neon.tech) (serverless Postgres — free
tier, works locally and in production).

1. Create a free Neon project → copy the **connection string**.
2. Paste it into `.env.local` as `DATABASE_URL`.
3. Run `npm run db:setup` to create the `users` table. If `ADMIN_EMAILS` and
   `ADMIN_SEED_PASSWORD` are set, the admin accounts are seeded too.

The schema lives in [`scripts/db-setup.mjs`](scripts/db-setup.mjs); the data
access layer is [`lib/users.ts`](lib/users.ts).

## Enabling Google sign-in (optional)

1. Go to the [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID**, type **Web application**.
3. Add an **Authorized redirect URI**:
   `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID and Secret into `.env.local` as `AUTH_GOOGLE_ID` and
   `AUTH_GOOGLE_SECRET`, then restart the dev server.

The Google button is hidden automatically until these are set, so email/password
login works fine without it.

## Admin accounts (unlimited scans)

Any email listed in `ADMIN_EMAILS` (comma-separated) bypasses the 3-scan limit
entirely — unlimited analyses, never decremented. The UI shows an "Unlimited
scans · admin" badge.

The account must still exist in the store (register it normally, or seed it).
**Restart the dev server after editing `ADMIN_EMAILS`** — env vars load at startup.

## How it works

```
URL → /api/analyze (auth + 3-scan quota)
    → scraper:  Jina  ─(403/CAPTCHA)→  ScraperAPI (real browser, rotating IPs)
    → textProcessor:  isolate the review section, drop page furniture
    → analyzer:  GPT-4o-mini → { verdict, confidence, pros, cons, summary }
    → cached 24h (cache hits don't cost a scan)
```

## Notes / limitations

- **Accounts live in Neon Postgres** (production-ready). The in-memory review
  cache and IP rate-limiter, however, still reset on restart and aren't shared
  across instances — move them to Redis (e.g. Upstash) before scaling out.
- AliExpress and other slider-CAPTCHA sites can't be bypassed automatically.
