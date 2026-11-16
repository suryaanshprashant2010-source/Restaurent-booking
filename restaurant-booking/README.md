# Maison Verte — Restaurant Private Room Booking Website

Customer-facing private dining room reservation platform built with Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase/PostgreSQL, Stripe (optional deposits), Resend (confirmation emails), and Google Maps.

## Features implemented

- **Pages:** Home, Our Rooms (with filters), Room Details, Online Booking, Booking Confirmation, My Reservations, About, Gallery, Contact, FAQ (includes cancellation, privacy, terms, cookies).
- **Booking:** room selection, live availability checks, date/time slot selection, guest capacity validation, opening-hours validation, price calculation, special requests, unique booking references, confirmation page/email, modification requests and cancellations (secure token from confirmation link).
- **Data integrity:** server-side validation (Zod), availability re-check on submit, PostgreSQL trigger to prevent overlapping active reservations, preparation/cleaning intervals considered in availability.
- **Security basics:** parameterized Supabase queries, server-side validation, basic API rate limiting utility, secure reservation management via hashed token, env-based secrets, HTTPS-ready deployment.

> No admin/staff/restaurant management dashboard is included.

## Prerequisites

- Node.js 18+ and npm
- A Supabase project (PostgreSQL)
- (Optional) Stripe account for deposit payments
- (Optional) Resend account for transactional emails
- (Optional) Google Maps Embed URL

## 1) Install

```bash
npm install
```

## 2) Configure environment

Copy `.env.example` to `.env.local` and fill in values:

```powershell
Copy-Item .env.example .env.local
```

Required for real database/bookings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

Optional: Stripe (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`), Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`), `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`, site/restaurant details.

## 3) Create database schema & seed rooms

In Supabase SQL Editor, run `supabase/schema.sql`.

This creates tables (`rooms`, `reservations`, `contact_messages`), overlap-prevention trigger, indexes, and seeds example rooms.

## 4) Run locally

```bash
npm run dev
```
Open http://localhost:3000

## 5) Production build

```bash
npm run build
npm start
```

Deploy to a platform with HTTPS (e.g. Vercel) and configure the same environment variables in production.

## Booking flow & security notes

- **Availability:** `/api/availability` returns slots that fit a default duration and exclude existing reservations plus preparation/cleaning buffers.
- **Double-booking prevention:** checked in application logic and enforced by DB trigger `prevent_overlapping_reservations`.
- **Secure retrieval:** confirmation email includes a manage link with a random token; token is stored hashed in DB and required for lookup/cancel/modification APIs.
- **Payments:** deposit selection is supported in the booking model/status; integrate Stripe Payment Intents/Checkout and webhooks in production to mark deposits paid.
- **Emails:** confirmation emails sent via Resend when keys are configured (best-effort).
- **Rate limiting:** a basic in-memory limiter utility is provided in `src/lib/rate-limit.ts` (recommended to use a distributed store like Upstash Redis in production/multi-instance deployments).

## Scripts

- `npm run dev` — development server
- `npm run build` / `npm start` — production
- `npm run lint` — lint
- `npm run typecheck` — TypeScript check
"# Restaurent-booking" 
