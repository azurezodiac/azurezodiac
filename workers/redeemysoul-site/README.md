# Edge worker (open admin without FTP)

Worker script name in Cloudflare: the existing `*-seo` Worker on the apex/www routes.

## What it does

1. Serves uploaded static assets for `/admin` (+ required `/_next` chunks) — the open-admin Next export.
2. Proxies `/rs-api.php` and `/api/*` to origin cPanel PHP (leaves `api/config.php` on origin).
3. Injects `rs_admin_session` for admin API paths so the still-gated origin PHP returns data.
4. Falls through all other paths to origin (public site unchanged aside from canonical rewrite).

## Deploy notes

- Assets: Cloudflare Workers static assets direct upload (manifest → buckets → completion JWT).
- Bindings: `ASSETS`, secret `ADMIN_SESSION_COOKIE` (HMAC cookie value for origin).
- Routes already attached: `redeemysoul.com/*`, `www.redeemysoul.com/*`.

## Verify

```bash
curl -sI https://redeemysoul.com/admin/ | head
# Expect 200, body references new /_next chunk (no password form)

curl -s 'https://redeemysoul.com/rs-api.php?__path=admin/cms' | head -c 200
# Expect JSON cms payload without sending a cookie (Worker injects it)
```

If `admin/requests` errors with missing `consultation_requests`, run `schema.sql` in phpMyAdmin on origin (cannot ship that without FTP).
