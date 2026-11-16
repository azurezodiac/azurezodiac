# Redeemysoul

Modern Islamic healing website for [redeemysoul.com](https://redeemysoul.com).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Turbopack

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

### Static cPanel (public site only)

```bash
bash scripts/build-cpanel-zip.sh
```

Upload **`redeemysoul-public_html.zip`** (not the `.sh` script) to `public_html` and extract.

### Admin portal (Node required)

`/admin` manages **leads, track, posts, features, promotions, pricing**.

```bash
cp .env.example .env.local   # set ADMIN_PASSWORD
pnpm build && pnpm start
```

Open `http://localhost:3000/admin` — password from `ADMIN_PASSWORD`.

Set **`DATABASE_URL`** to your Postgres (same DB for leads + CMS). Apply:

```bash
psql "$DATABASE_URL" -f migrations/001_requests.sql
psql "$DATABASE_URL" -f migrations/002_cms.sql
```

Without `DATABASE_URL`, a local JSON fallback is used. Static cPanel zip does **not** run admin APIs — Node host required for `/admin`.
