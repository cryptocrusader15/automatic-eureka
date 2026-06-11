# Deployment

This project can be deployed quickly on Vercel (recommended for Next.js) or containerized with Docker.

Environment variables

- `STRIPE_SECRET_KEY` — Stripe secret key for checkout.
- `NEXT_PUBLIC_SITE_URL` — Public site URL used in sitemaps and SEO (e.g., https://example.com).
- `FORMSPREE` — (if you want to store Formspree id as env) — not currently required.

Vercel (recommended)

1. Sign in to Vercel and create a new project.
2. Import this repository from GitHub/GitLab/Bitbucket.
3. In project settings, set Environment Variables (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy — Vercel will run `npm install` and `npm run build`, then serve the app.

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

- The app stores uploaded images in `public/images`; when deploying to serverless platforms you should switch to S3 or another object store. The admin UI and API will need updates to use S3.
- For production payments, configure Stripe webhooks and verify payments server-side before fulfilling orders.
