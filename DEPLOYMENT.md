# Deployment

This project can be deployed quickly on Vercel (recommended for Next.js) or containerized with Docker.

Environment variables

- `STRIPE_SECRET_KEY` — Stripe secret key for checkout.
- `NEXT_PUBLIC_SITE_URL` — Public site URL used in sitemaps and SEO (e.g., https://example.com).
- `DATABASE_URL` — Optional PostgreSQL connection URL. Set this to use a persistent database; without it, local development uses `data/products.json`.
- `UPLOADS_DIR` — Optional path for uploaded product images. Set this to a directory on persistent storage in production; without it, local development uses `public/images`.
- `FORMSPREE` — (if you want to store Formspree id as env) — not currently required.

Vercel (recommended)

1. Sign in to Vercel and create a new project.
2. Import this repository from GitHub/GitLab/Bitbucket.
3. In project settings, set Environment Variables (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy — Vercel will run `npm install` and `npm run build`, then serve the app.

Render with PostgreSQL

1. Create a Render PostgreSQL database and a Render Web Service for this repository.
2. Set `DATABASE_URL` on the Web Service to the database's Internal Database URL. Keep the service and database in the same region.
3. Add a persistent disk to the Web Service, using a mount path such as `/var/data`, if your Render plan supports it.
4. Set `UPLOADS_DIR` to a directory on that disk, such as `/var/data/uploads`.
5. Deploy the service. On its first product API request, the app creates its tables and imports the current `data/products.json` catalog once. Later product changes are stored in PostgreSQL and survive redeploys. New uploaded images are served through `/api/uploads/...` from `UPLOADS_DIR`.

Do not commit the database URL. For local development, leave `DATABASE_URL` unset to use the JSON file, or set it to a development database to test PostgreSQL locally. Leave `UPLOADS_DIR` unset locally to save uploads in `public/images`.

Docker (alternative)

1. Build locally:
```bash
docker build -t machinery-shop:latest .
```
2. Run locally:
```bash
docker run -p 3000:3000 -e STRIPE_SECRET_KEY=sk_test_xxx -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 machinery-shop:latest
```

CI / GitHub Container Registry

- A sample GitHub Actions workflow is included at `.github/workflows/docker-publish.yml` that will build and push an image to `ghcr.io/<owner>/<repo>:latest` when you push to `main`.

Notes

- Uploaded images require persistent storage in production. Without a Render disk or another persistent image store, uploads can disappear when the service restarts or redeploys.
- The admin login is currently client-side only, and the product API does not enforce authentication. Add server-side authentication before using the admin tools on a public production site.
- For production payments, configure Stripe webhooks and verify payments server-side before fulfilling orders.
