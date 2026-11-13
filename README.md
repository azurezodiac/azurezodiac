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

Static files land in `out/` — upload that folder to cPanel `public_html` for redeemysoul.com.

For a Node host (Vercel / Cursor):

```bash
pnpm start
```
