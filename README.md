# ApnaRoom Owner Dashboard

Production-ready hostel owner workspace for managing listings, rooms, pricing, bookings, tenants, earnings, reviews, notifications, and profile settings.

## Stack

- Frontend: Next.js 15 App Router, TypeScript, Tailwind CSS, ShadCN-style reusable UI components, React Hook Form, Zod, Axios, Zustand, Recharts, Sonner.
- Backend: Node.js, Express, MongoDB/Mongoose, JWT auth, bcrypt password hashing, REST APIs, Helmet, rate limiting, Mongo sanitization, upload validation middleware.

## Local Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`.

Seed owner:

- Email: `owner@apnaroom.com`
- Password: `OwnerPass123`

## API Overview

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

Owner resources:

- `GET|POST /api/hostels`
- `GET|PUT|DELETE /api/hostels/:id`
- `GET /api/hostels/analytics/summary`
- `GET|POST /api/rooms`
- `PUT|DELETE /api/rooms/:id`
- `GET|POST /api/bookings`
- `PUT /api/bookings/:id/status`
- `GET|POST /api/tenants`
- `PUT|DELETE /api/tenants/:id`
- `GET /api/reviews`
- `POST /api/reviews/reply`
- `PUT /api/reviews/:id/moderate`
- `GET /api/notifications`
- `PUT /api/notifications/read`

## Deployment

Backend:

1. Provision MongoDB Atlas.
2. Set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, and optional Cloudinary variables.
3. Deploy `backend/server.js` to a Node host or use `backend/api/index.js` on Vercel.

Frontend:

1. Set `NEXT_PUBLIC_API_URL` to the backend `/api` base URL.
2. Run `npm run build`.
3. Deploy the `frontend` app to Vercel or any Next.js-compatible host.

## Notes

- Legacy Vite pages were moved to `frontend/src/legacy-pages` so Next.js does not treat them as Pages Router routes.
- Image upload validation middleware is included; wire Cloudinary persistence into controllers when real asset storage credentials are available.
