# Machinery Shop — Starter

Quick scaffold of a Next.js + Tailwind site with a Formspree inquiry form.

Getting started

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Configure Formspree

- Create a form at https://formspree.io and copy the form ID.
- Replace `YOUR_FORM_ID` in `pages/contact.js` with your Formspree form id.

After submitting the form for the first time, Formspree will prompt you to confirm the receiving email.

Stripe checkout

- Install the Stripe SDK:

```bash
npm install stripe
```

- Create a `.env.local` file and set your secret key (see `.env.local.example`).
- Run the dev server and use the cart at `/cart` to test checkout. The server will create a Stripe Checkout Session and redirect to Stripe.

Notes:
- Prices are treated as USD and converted to cents for Stripe (`price * 100`).
- For production, use Stripe webhooks to verify payments and fulfill orders.

Playwright E2E tests

- Install Playwright browsers:

```bash
npm run playwright:install
```

- Run the tests:

```bash
npm run test:e2e
```

The tests cover admin CSV import, add-to-cart, and a mocked checkout flow.

Deployment

See `DEPLOYMENT.md` for recommended deployment options (Vercel or Docker) and required environment variables.
