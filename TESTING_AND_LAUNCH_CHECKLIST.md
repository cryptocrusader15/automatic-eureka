# Testing, Review and Launch Checklist

This checklist helps prepare the site for production. Complete each item, mark done, and resolve any issues before launch.

## Local smoke tests
- [ ] Install deps: `npm install`
- [ ] Run dev server: `npm run dev` and verify main pages load (http://localhost:3000).
- [ ] Verify product list, product detail, contact form, admin UI, cart, and checkout flows work in dev.

## Automated tests (recommended)
- Unit tests: add `jest` + `@testing-library/react` for components and API handlers.
  - Command: `npm test` (configure Jest).
- Integration / E2E: add Playwright or Cypress to test critical flows (add product, cart, checkout, contact form).
  - Example commands: `npx playwright test` or `npx cypress open`.

## Security & secrets
- [ ] Verify environment variables are set in production (Stripe key, S3 creds, NEXT_PUBLIC_SITE_URL).
- [ ] Ensure `.env.local` is NOT committed and `.env` files are listed in `.gitignore`.
- [ ] Check third-party keys (Stripe, Formspree) are valid and not exposed client-side.

## Content and assets
- [ ] All product images display and links are correct.
- [ ] Contact form is configured with your Formspree ID.
- [ ] Company details (phone, email, address) are accurate on `Contact` and `About` pages.

## SEO & analytics
- [ ] `NEXT_PUBLIC_SITE_URL` set to production URL.
- [ ] `sitemap.xml` accessible at `/sitemap.xml` and `robots.txt` present.
- [ ] Open Graph meta tags present (via `components/Seo.js`).
- [ ] Add Google Analytics / tag manager snippet if desired.

## Payments and orders
- [ ] `STRIPE_SECRET_KEY` set in production; test in Stripe test mode first.
- [ ] Configure Stripe webhooks to your API endpoint and verify signature verification.
- [ ] Implement server-side order recording (DB or file) upon successful webhook receipt.

## File storage and uploads
- [ ] For serverless hosts, migrate image uploads to S3 (use presigned URLs) instead of `public/images`.
- [ ] Configure CORS and lifecycle rules for your S3 bucket.

## Performance & accessibility
- [ ] Run Lighthouse audit and fix critical performance/accessibility issues.
- [ ] Optimize large images; consider lazy-loading and responsive sizes.

## Backup & monitoring
- [ ] Ensure logs and errors are collected (Sentry, Logflare, or platform logs).
- [ ] Add uptime monitoring and an alerting channel (email/Slack).

## DNS & HTTPS
- [ ] Point domain DNS to hosting provider (Vercel or server IP).
- [ ] Ensure HTTPS is enabled (Vercel handles automatically; otherwise configure TLS).

## Final launch steps
- [ ] Run a full smoke test on staging/production URL.
- [ ] Announce launch and monitor traffic, errors, and orders closely for first 24–72 hours.
- [ ] Post-launch: enable analytics dashboards and confirm order fulfillment process.

## Helpful commands
- dev: `npm run dev`
- build: `npm run build`
- production (after build): `npm start`

## Next: Add automated tests
If you want, I can scaffold Jest unit tests for components and a Playwright E2E test suite for the critical flows.
