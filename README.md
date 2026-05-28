# Amiranas Gamofena

A minimal, full-stack clothing **showcase** built with Next.js 16 (App Router) and TypeScript. No cart, no checkout, no public accounts — a single admin curates the archive. Images live on Cloudflare R2, content lives in SQLite.

- Black-and-white editorial aesthetic
- Bilingual (English / Georgian) with a single switch in the header
- Display: `Anton` (Latin) + `Noto Sans Georgian` (Georgian) / Body: `Inter`
- Admin login, image upload to R2, product CRUD, draft/featured/published states

## Stack

- **Next.js 16** (App Router, RSC, Server Actions)
- **TypeScript** + **Tailwind CSS v4**
- **SQLite** via `better-sqlite3` (file at `./data/app.db`)
- **Cloudflare R2** via `@aws-sdk/client-s3`
- **jose** for session JWT, **zod** for input validation

## Quick start

```bash
bun install
cp .env.example .env.local
# edit .env.local — at minimum set ADMIN_PASSWORD and ADMIN_SESSION_SECRET
bun dev
```

Open http://localhost:3000 for the public site and http://localhost:3000/admin to sign in.

## Environment variables

See [`.env.example`](./.env.example). Required:

| Var | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Plain password used to sign in at `/admin/login`. |
| `ADMIN_SESSION_SECRET` | Random string (32+ chars) used to sign admin session JWTs. |
| `R2_ACCOUNT_ID` | Cloudflare account id. |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 API token with Object Read & Write on the bucket. |
| `R2_BUCKET` | Bucket name. |
| `R2_PUBLIC_BASE_URL` | Public base URL for objects (R2.dev URL or a custom domain). |

The admin form will refuse to upload if R2 is not configured, and the page will surface the missing variable name.

## Cloudflare R2 setup

1. In the Cloudflare dashboard go to **R2 → Create bucket** and pick a name. Put the name in `R2_BUCKET`.
2. **R2 → Manage R2 API Tokens → Create API token**. Permission: *Object Read & Write*, scoped to your bucket. Copy the **Access Key ID** and **Secret Access Key**.
3. Either enable the bucket's **Public Development URL** (R2 → bucket → Settings → Public access) and use it as `R2_PUBLIC_BASE_URL`, or attach a **custom domain** to the bucket and use that.
4. `R2_ACCOUNT_ID` is in the right sidebar of the R2 page (or part of the dashboard URL).

R2 hostnames are already allowed in `next.config.ts` for `next/image` (`**.r2.dev`, `**.r2.cloudflarestorage.com`, and whatever host you put into `R2_PUBLIC_BASE_URL`).

## Project structure

```
app/
  (site)/            Public site (header / footer / language switcher)
    page.tsx              Home (hero + featured + manifesto)
    collection/page.tsx   All published products
    product/[slug]/       Product detail (gallery + details)
    about/page.tsx        Studio page
    _components/          Shared site components
    actions.ts            Server action for locale switching
  admin/             Admin section (protected by middleware)
    login/                Login page + client form
    page.tsx              Dashboard
    products/new/         New product form
    products/[id]/edit/   Edit product form
    _components/          Admin shell, logout, delete, product form
  api/
    admin/login/          POST sign in
    admin/logout/         POST sign out
    admin/products/       POST create
    admin/products/[id]/  PUT update / DELETE remove
    admin/upload/         POST multipart image upload to R2
  layout.tsx          Root layout, fonts, locale -> <html lang>
  globals.css         Design tokens + utility classes

lib/
  db.ts               SQLite schema + product CRUD
  auth.ts             Session JWT + cookie helpers
  r2.ts               Cloudflare R2 client + upload helper
  format.ts           Price + localized field helpers
  i18n/
    locales.ts        Locale list + cookie name
    dictionaries.ts   English + Georgian copy
    server.ts         getLocale() / getT() helpers for RSC

middleware.ts          Protects /admin and /api/admin
data/                  SQLite DB lives here (gitignored)
```

## How content is modelled

A product has bilingual `name`, `description`, and `category` fields, a numeric `price` + `currency`, an ordered `images` array of public URLs, plus `featured` and `published` flags. Slugs are derived from the English name by default but can be edited.

The home page shows featured products first; if none are flagged as featured it falls back to the latest published items. The collection page lists everything published.

## Notes & limitations

- SQLite lives on the local filesystem, so this is meant for single-instance deployments (a small VPS, Fly machine, Railway, etc.). For multi-instance / serverless, swap `lib/db.ts` for a hosted database (Postgres, D1, Turso, etc.) — the rest of the app does not depend on SQLite specifics.
- There is exactly one admin (the password in `ADMIN_PASSWORD`). Sessions last 7 days.
- Image uploads cap at 10 MB and accept jpeg/png/webp/avif/gif.

## Scripts

- `bun dev` — start the dev server
- `bun run build` — production build
- `bun start` — run the production build
- `bun check` — lint the project
