**Pawfect Server**

A production-oriented backend API for Pawfect — a pet care and adoption platform that provides user management, volunteer booking, payments, real-time chat, lost-pet geolocation, and more.

**Overview**

Pawfect Server is an Express.js backend that provides REST APIs, real-time messaging with Socket.io, payment integrations (Stripe and SSLCommerz), and data persistence in MongoDB. The codebase exposes endpoints for users, volunteers, products, appointments, vets, forums, reports, and admin/analytics operations.

**Key Features**

- REST APIs for users, volunteers, products, pets, vets, appointments, forums, and more.
- Real-time chat with Socket.io (rooms and broadcast messaging).
- Payment integrations: Stripe (PaymentIntent) and SSLCommerz for region-specific flows.
- Bookings & scheduling: volunteer/trainer slot creation and booking lifecycle.
- Lost-pet reporting with GeoJSON and geospatial queries (2dsphere).
- Video call / prescription endpoints and support for storing prescription artifacts.

**Tech Stack & Tools**

- Node.js + Express
- MongoDB (Atlas recommended)
- Socket.io (real-time features)
- Stripe SDK + SSLCommerz integration
- Additional libs: `axios`, `cors`, `dotenv`

Note: A `models/Location.js` file with a Mongoose schema exists in the codebase, but the main server uses the native `mongodb` driver in `index.js`. Consider adding `mongoose` to dependencies or removing the unused model for consistency.

**Project Structure (high level)**

`./`

- `index.js` — main Express server, MongoDB client init, routes, Socket.io
- `package.json` — dependencies + scripts
- `.env` — environment secrets (not checked in)
- `models/Location.js` — Mongoose schema (optional)

**Prerequisites**

- Node.js (v16+ or v18+ recommended)
- npm (or yarn)
- MongoDB Atlas cluster or local MongoDB
- Stripe account (test keys) for testing payment flows

**Install**

Open PowerShell in the server folder and run:

```powershell
cd d:/systemProject/pawfect-server
npm install
```

If you want `nodemon` behavior for `npm start` and it's not installed as a devDependency, install it:

```powershell
npm install --save-dev nodemon
```

If you plan to use `models/Location.js` and prefer Mongoose, add it:

```powershell
npm install mongoose
```

**Environment variables**

Create a `.env` file in `pawfect-server/` (do NOT commit). Keys referenced in the code include:

- `DB_USERNAME`
- `DB_PASSWORD`
- `STRIPE_SECRET_KEY` (e.g., `sk_test_...`)
- `SSL_STORE_ID`
- `SSL_STORE_PASSWORD`
- `PORT` (default `5000`)

The server constructs a MongoDB Atlas URI using `DB_USERNAME` and `DB_PASSWORD` and connects to a database named `pawfect`.

**Run**

Start the server (development):

```powershell
npm start
```

Or run directly with Node:

```powershell
node index.js
```

**Smoke test (curl)**

```powershell
curl http://localhost:5000/
```

**Manual testing**

- Use Postman or curl to exercise REST endpoints in `index.js`.
- For Socket.io, use a Socket.io client (frontend or Node client) to `join_room`, `send_message` and listen for `receive_message` events.

**Notes & Recommendations**

- The server mixes direct `mongodb` driver use and a Mongoose model file. For maintainability, choose one approach (native driver or Mongoose) and standardize.
- Break `index.js` into modular routers (`routes/users.js`, `routes/payments.js`, etc.) and add a service/data-access layer for clearer separation of concerns.
- Implement secure webhook handling for Stripe and SSLCommerz and persist payment status updates robustly.
