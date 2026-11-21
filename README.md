# WedPlan

WedPlan is a wedding-services marketplace built with Next.js, Better Auth, and a separate Express API. The public experience lets couples find reviewed vendors and send booking requests. Vendors manage listings and inquiries; admins review accounts and services.

## Local development

1. Copy `.env.example` to `.env.local` and fill in the Better Auth, MongoDB, API, Google, and image-upload values you use locally.
2. Start the API from `wed-plan-backend` (`npm run dev`) and point `NEXT_PUBLIC_API_BASE_URL` at it.
3. Install frontend dependencies with `npm install`, then run `npm run dev`.

The frontend and API use the `wed-plan` MongoDB database. Better Auth owns the `user` and `session` collections; the API owns `services`, `bookings`, and `transactions`. Real `.env` files are ignored and should never be committed.
