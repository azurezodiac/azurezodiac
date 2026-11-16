# Redeemysoul

Modern Islamic healing website for [redeemysoul.com](https://redeemysoul.com).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- **MySQL** (cPanel) via PHP API — primary for production
- Optional Postgres / JSON fallback for local Node

## Develop

```bash
pnpm install
cp .env.example .env.local   # MYSQL_* + ADMIN_PASSWORD
pnpm dev
```

## Build

```bash
pnpm build
```

### Static cPanel + MySQL (recommended)

```bash
bash scripts/build-cpanel-zip.sh
```

Upload **`redeemysoul-public_html.zip`** to `public_html` and extract.

1. cPanel → **MySQL Databases** → create DB + user, add user to DB (ALL PRIVILEGES)
2. Copy `public_html/api/config.sample.php` → `public_html/api/config.php`
3. Fill `db_host` (`localhost`), `db_name`, `db_user`, `db_pass`, `admin_password`
4. Optional: phpMyAdmin → Import `api/schema.sql` (also auto-creates on first API hit)
5. Open `/admin` and log in

This powers **Begin**, **Track**, and the full **Admin** portal (leads, posts, features, promos, pricing) on your own MySQL.

### Node host (optional)

```bash
# .env.local
MYSQL_HOST=localhost
MYSQL_DATABASE=...
MYSQL_USER=...
MYSQL_PASSWORD=...
ADMIN_PASSWORD=...

pnpm build && pnpm start
```

Schema: `migrations/mysql/001_schema.sql`
