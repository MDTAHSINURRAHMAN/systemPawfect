### Server-Side README

```markdown
# Pawfect Server

A production-oriented backend API for Pawfect — a pet care and adoption platform that provides user management, volunteer booking, payments, real-time chat, lost-pet reporting with geolocation, and more.

## ✨ Overview

Pawfect Server is an Express.js backend that powers a full-featured pet care web application. It provides REST APIs for users, volunteers, products, appointments, vets, forums, and lost-pet reports; integrates payment flows (Stripe and SSLCommerz); and supports real-time chat via Socket.io. The server stores data in MongoDB Atlas and includes features for booking, payments, messaging, geospatial lost-pet reports (GeoJSON), and admin endpoints for management and reporting.

## 🎯 Key Features

- **REST API**: Extensive Express endpoints for users, volunteers, products, pets, vets, appointments, forums, reviews, FAQs, and more.
- **Real-time Chat**: Socket.io setup that supports rooms and message broadcasting between users and volunteers.
- **Payment Integrations**: Stripe PaymentIntent support plus SSLCommerz integration for region-specific payment flows and order lifecycle tracking.
- **Bookings & Scheduling**: Volunteer slot creation, booking flow, and slot state management with booking updates.
- **Lost-Pet Geolocation**: Lost-pet reporting using GeoJSON points and a 2dsphere index to support geospatial queries.
- **Video Call & Prescriptions**: Endpoints for initiating video calls and creating/storing prescriptions (including PDF storage field support).
- **Admin & Analytics**: Dashboard-style endpoints for booking and subscriber stats; admin routes for approvals and moderation.
- **Robust Error Handling & Logging**: Defensive checks (ObjectId validation, input validation) and detailed console logging throughout.

## 🛠️ Tech Stack & Tools

- **Languages**: JavaScript (Node.js)
- **Frameworks & Libraries**:
  - `express` (web framework)
  - `socket.io` (real-time communication)
  - `mongodb` (official MongoDB Node driver)
  - `axios` (HTTP client)
  - `cors`, `dotenv` (middleware / env)
  - `stripe` (Stripe SDK)
  - Note: project contains a Mongoose model file (`models/Location.js`) but `mongoose` is not listed in `package.json`.
- **Infrastructure & Services**:
  - MongoDB Atlas (connection string uses `mongodb+srv`, database: `pawfect`)
  - Stripe (test secret key referenced via `STRIPE_SECRET_KEY`)
  - SSLCommerz (sandbox / store credentials used for region-specific card gateway)
- **Dev Tools**:
  - `nodemon` used in `package.json` `start` script (may need to be installed globally or as dev-dependency)
  - Node/npm for package management

Versions (from `package.json`): `axios@^1.7.9`, `cors@^2.8.5`, `dotenv@^16.4.7`, `express@^4.21.2`, `mongodb@^6.12.0`, `socket.io@^4.8.1`, `stripe@^17.5.0`.

## 📂 Project Structure
```

./
├─ index.js # Main Express server + Socket.io + routes
├─ package.json # Project metadata + dependency versions
├─ .env # Environment secrets (not checked into VCS)
├─ README.md # (this file)
└─ models/
└─ Location.js # Mongoose schema for location (sender/receiver + coords)

````

- `index.js`: Core server, MongoDB client initialization, and all REST routes.
- `models/Location.js`: Contains a Mongoose `Location` model (schema for storing chat location points). Note: `mongoose` is not present in `package.json`.

## 🚀 Getting Started

Follow these steps to run Pawfect Server locally.

### Prerequisites

- Node.js (recommended v16+ or v18+)
- npm (or yarn)
- A MongoDB Atlas cluster (or local MongoDB) and connection credentials
- Stripe account (test keys) if you want to test Stripe payment flows

### Installation

Open PowerShell in the project root and run:

```powershell
npm install
````

If `nodemon` is not installed globally and you want the `npm start` script to work as-is, install it:

```powershell
npm install --save-dev nodemon
```

If you plan to use the `models/Location.js` Mongoose model, install `mongoose` as well:

```powershell
npm install mongoose
```

### Environment Variables

Create a `.env` file in the project root (do NOT commit secrets). The code references these keys; include them with appropriate values:

```text
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
STRIPE_SECRET_KEY=sk_test_...
SSL_STORE_ID=your_ssl_store_id
SSL_STORE_PASSWORD=your_ssl_store_password
PORT=5000
```

> Note: `index.js` constructs a MongoDB Atlas URI using `DB_USERNAME` and `DB_PASSWORD` and connects to a database named `pawfect`.

### Run

Start the server (development):

```powershell
npm start
```

If you don't use `nodemon`, run with Node directly:

```powershell
node index.js
```

The server listens on `process.env.PORT` or `5000` by default. Visit `http://localhost:5000/` to confirm `Pawfect Server` responds.

### Quick API Smoke Test (curl)

```powershell
curl http://localhost:5000/
```

Create a user (example):

```powershell
curl -X POST http://localhost:5000/users -H "Content-Type: application/json" -d '{"email":"you@example.com","name":"Test User"}'
```

## 🧪 Testing

- This repository does not include automated tests (`package.json` has a placeholder test script). No `tests/` directory is present.
- Manual testing recommendations:
  - Use Postman or curl to exercise the endpoints listed in `index.js`.
  - For Socket.io, use a Socket.io client (frontend or a simple Node client) to connect and emit `join_room`, `send_message`, and observe `receive_message` events.

## 💡 Design Decisions & Architecture Notes

Pawfect Server uses Express for a lightweight, well-known HTTP API surface and the official MongoDB driver (`mongodb`) for direct control over database operations. This direct-driver approach enables explicit control over database connections and queries (e.g., creation of a `2dsphere` index for geospatial lost-pet reports). Socket.io was chosen to handle real-time features such as chat and room-based messaging, with the server broadcasting messages between paired rooms to ensure two-way chat compatibility.

The code also demonstrates multi-provider payment handling: Stripe for international/test card processing (`create-payment-intent`) and SSLCommerz for region-specific gateway flows (adoption and product payments). Payment flows persist records in MongoDB with status history arrays to support reconciliation and IPN/callback processing.

One notable implementation detail: while a `models/Location.js` file defines a Mongoose schema, the main server uses the native `mongodb` driver. This is likely intentional for direct control or could be an artifact of incremental development — adding `mongoose` support (or removing the unused model) would improve consistency.

The server exposes many REST routes in a single file (`index.js`). For maintainability and scaling, consider refactoring routes into modular routers (e.g., `routes/users.js`, `routes/payments.js`) and adding a service/data-access layer to separate concerns.