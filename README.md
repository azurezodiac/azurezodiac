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

Static cPanel zip does **not** run admin APIs. For live CMS + leads, host with Node (Vercel / Railway / VPS) or keep editing code for topics and rebuild the zip.
