# WedPlan — Wedding Planning Platform

WedPlan is a marketplace where couples can find wedding vendors and request bookings. Vendors manage services and booking requests, and admins review marketplace activity.

## Links

- Live site: [https://wedplan-marketplace.vercel.app](https://wedplan-marketplace.vercel.app)
- API: [https://wedplan-api-cyan.vercel.app](https://wedplan-api-cyan.vercel.app)
- Frontend repository: [wed-plan-frontend](https://github.com/KawsarCodes404/wed-plan-frontend)
- Backend repository: [wed-plan-backend](https://github.com/KawsarCodes404/wed-plan-backend)

## Features

- Search and filter approved wedding services by name, category, location, and price.
- Customer, vendor, and admin sign in with email or Google.
- Customer booking requests and booking status tracking.
- Vendor service management, approval status, and booking request management.
- Free vendor plan with up to three active services; Premium adds unlimited services and a vendor badge.
- Stripe Checkout subscriptions, verified through backend webhooks.
- Admin tools for users, service review, and read-only payment transactions.
- Responsive pages, loading placeholders, form feedback, and motion that respects reduced-motion settings.

## Technology

Next.js 16, React, TypeScript, Better Auth, ShadCN components, Express, MongoDB, Stripe Checkout, ImgBB, and Framer Motion.

## Run locally

1. Copy `.env.example` to `.env.local` and fill in your Better Auth, MongoDB, Google OAuth, and API URL values.
2. In the backend repository, copy its `.env.example` to `.env` and add MongoDB and Stripe settings. Follow its README for Stripe webhook setup.
3. Install and start the API with `npm install` and `npm run dev` in `wed-plan-backend`.
4. Install and start the website with `npm install` and `npm run dev` in `wed-plan-frontend`.
5. Open [http://localhost:3000](http://localhost:3000).

Better Auth and the API should use the same MongoDB database and `BETTER_AUTH_URL`. The API verifies short-lived Better Auth JWTs against its JWKS endpoint and reads the user’s current role and blocked status from MongoDB.

Use placeholders in `.env.example`. Never commit `.env`, `.env.local`, or secret credentials.
Set `IMGBB_API_KEY` in the backend `.env`; image uploads go through the API so the key is not sent to browsers.
