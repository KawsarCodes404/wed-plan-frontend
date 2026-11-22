# WedPlan — Wedding Services Marketplace

WedPlan is a responsive wedding-services marketplace where couples discover verified vendors, compare service packages, and send booking requests. Vendors manage their listings and inquiries, while admins review marketplace activity.

## Features

- Browse approved wedding services and search by keyword, category, or location; sort by newest or price.
- Customer, vendor, and admin experiences with email and Google sign-in.
- Customer booking requests, status tracking, and booking management.
- Vendor service creation and management, booking responses, and dashboard summaries.
- Free vendor plan with up to three active services; Premium provides unlimited active services and a Premium vendor badge.
- Stripe Checkout subscription flow with payment status confirmed by backend webhooks.
- Admin tools for managing users and services, and viewing transaction records.
- Responsive layouts, loading skeletons, accessible form feedback, and reduced-motion-aware animation.

## Technology Stack

- Next.js 16, React, and TypeScript
- Tailwind CSS and ShadCN UI components
- Better Auth with MongoDB and Google OAuth
- Express API (see the [server repository](https://github.com/KawsarCodes404/wedplan-api))
- Stripe Checkout, ImgBB uploads through the backend, and Framer Motion
- Vercel deployment

## Live Websites

| App | Live URL |
| --- | --- |
| Client website | [wedplan-marketplace.vercel.app](https://wedplan-marketplace.vercel.app) |
| Server API | [wedplan-api-cyan.vercel.app](https://wedplan-api-cyan.vercel.app) |

## Repositories

- **Client repository:** [wedplan-marketplace](https://github.com/KawsarCodes404/wedplan-marketplace)
- **Server repository:** [wedplan-api](https://github.com/KawsarCodes404/wedplan-api)

## Installation

1. Install Node.js (LTS).
2. Clone this repository and install dependencies:

   ```bash
   git clone https://github.com/KawsarCodes404/wedplan-marketplace.git
   cd wedplan-marketplace
   npm install
   ```

3. Copy `.env.example` to `.env.local` and configure the values. See the example file for the full list. The site uses Better Auth and MongoDB settings, Google OAuth credentials, and `NEXT_PUBLIC_API_BASE_URL` for the API address.
4. Set up and run the [WedPlan API](https://github.com/KawsarCodes404/wedplan-api) as described in its README. Both apps must use the same Better Auth URL and database configuration.

Keep real credentials in local or deployment environment settings. Never commit `.env`, `.env.local`, OAuth secrets, or Stripe secrets.

## Run Locally

Start the frontend development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Start the backend separately; by default the API runs at `http://localhost:5000`.

Useful scripts:

- `npm run dev` — start the development server.
- `npm run build` — create a production build.
- `npm run start` — serve the production build.
- `npm run lint` — run ESLint.
- `npm run typecheck` — check TypeScript types.

## Related Project

The API contains the server-side role and ownership checks, booking rules, service approval, image upload handling, and Stripe webhook processing. Premium access is granted only after the verified webhook updates the vendor subscription.
