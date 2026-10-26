# Rohit Samaj Website

Local business directory for India and the United Kingdom.

## Design

- Live site: [Home UK](https://rohitsamaj.com/en-uk/home/) · [Home India](https://rohitsamaj.com/en-us/home-in/)
- Deployed preview: [rohitsamaj.vercel.app](https://rohitsamaj.vercel.app/india)
- Figma template: [Rohit Samaj Website Template](https://www.figma.com/design/kEu17U7emr49EcdKKItIK6)
- Homepage frame: [Homepage](https://www.figma.com/design/kEu17U7emr49EcdKKItIK6?node-id=2-30)

### Local media

| Path | Use |
| --- | --- |
| `public/images/` | Listing photos, About assets, and a few category fallbacks (`/images/...`) |
| `public/assets/services/` | **Services For You** category images and section background (`/assets/services/...`) |

## Stack

- TanStack Start (Vite) + React
- MongoDB for users, sessions, categories, and listings
- Cookie sessions + bcrypt (no third-party auth provider)
- Roles: `admin` | `user`

## Development

You need **Node.js**, **npm**, and a local **MongoDB** instance.

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
cp .env.example .env
npm run dev
```

App defaults to [http://localhost:8080](http://localhost:8080). `/` redirects to the UK home (`/uk`).

```sh
npm test
npm run build
```

### Environment

Copy `.env.example` to `.env`. Important variables:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` / `MONGODB_DB` | MongoDB connection |
| `SESSION_SECRET` | Signed session cookies |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seeded admin account |
| `APP_URL` | Base URL (reset-password links) |
| `SMTP_*` | Optional; if unset, forgot-password returns/logs the reset URL in dev |

On first run with empty collections, the app seeds the admin user plus static categories/listings.

## Testing admin access

**Use only while the project is in testing mode.** Change these before production.

| | |
| --- | --- |
| Admin panel | [http://localhost:8080/admin](http://localhost:8080/admin) |
| Login page | [http://localhost:8080/login](http://localhost:8080/login) |
| Email | `admin@rohitsamaj.com` |
| Password | `admin` |

Admins also see an **Admin** link in the header after signing in.

## Useful routes

| Route | Notes |
| --- | --- |
| `/uk`, `/india` | Country home (search, listings preview, Services For You) |
| `/uk/listings`, `/india/listings` | Search results page (home Search navigates here) |
| `/uk/category/$slug`, `/india/category/$slug` | Category pages |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth |
| `/account` | Signed-in profile + saved listings |
| `/add-listing` | Requires login; submissions go to admin as `pending` |
| `/admin` | Dashboard (admin only) |
| `/admin/users`, `/admin/listings`, `/admin/categories` | CMS CRUD |
