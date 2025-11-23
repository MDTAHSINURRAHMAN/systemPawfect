**Pawfect — Client**

A full-featured React client for a pet services marketplace (adoption, trainers, vets, forum, payments).

✨ This README reflects the app code, routes, and integrations present in the `pawfect-client` folder.

**Overview**

Pawfect is a client-side React application that powers adoption listings, trainer booking, vet appointments, community forums, product sales, and payment flows. It uses Firebase for authentication, Stripe for payments, React Router for navigation, and React Query for remote data fetching and caching.

**Key Features**

- **Multi-role UI:** Separate pages and routes for users, trainers, vets, and administrators (`src/pages/*`, `src/pages/admin/*`).
- **Authentication:** Firebase auth wiring in `src/firebase/firebaseConfig.js` and `src/context/AuthContext.jsx`.
- **Payments:** Stripe client libraries included; payment pages under `src/pages/payment/`.
- **Bookings & Scheduling:** Trainer booking + slot management pages (e.g., `TrainerBooking.jsx`, `ManageSlot.jsx`).
- **Adoption & Sales:** Adoption flow and product checkout components (`AdoptPet.jsx`, `AdoptPetDetails.jsx`, `ProductPayment.jsx`).
- **Community & Chat:** Forum, forum details, and chat pages; `socket.io-client` is present for real-time features.
- **Animations & UI:** Lottie and Framer Motion for polished UI.

**Tech Stack & Tools**

- Languages: JavaScript/JSX
- Frameworks: React (Vite)
- Data & Auth: Firebase (auth), React Query for remote server state
- Payments: Stripe client libs (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- Styling: Tailwind CSS + DaisyUI
- Real-time: `socket.io-client`
- Dev tooling: Vite, ESLint, PostCSS, Autoprefixer

**Project Structure (simplified)**

`./`

- `package.json` — npm scripts & dependencies
- `vite.config.js` — Vite config
- `tailwind.config.js` — Tailwind + DaisyUI config
- `src/`
  - `main.jsx` — app entry (React Query, AuthProvider, Router)
  - `firebase/firebaseConfig.js` — Firebase initialization (reads VITE\_ env vars)
  - `context/AuthContext.jsx` — auth provider
  - `router/routes.jsx` — application routes and private/admin wrappers
  - `pages/` — route-level pages (adopt, trainers, vets, admin, payment, forum)
  - `components/` — reusable UI components
- `public/` — static assets

**Prerequisites**

- Node.js and npm (or Yarn / pnpm)

**Install**

Open PowerShell and run:

```powershell
cd d:/systemProject/pawfect-client
npm install
```

**Environment variables**

Create a `.env` file at the project root or set system env vars. The app expects the following Vite vars (example names used in code):

- `VITE_apiKey`
- `VITE_authDomain`
- `VITE_projectId`
- `VITE_storageBucket`
- `VITE_messagingSenderId`
- `VITE_appId`
- (Optional) `VITE_STRIPE_PUBLISHABLE_KEY` — if your Stripe client initialization uses an env var

Ensure these map to values for your Firebase project and client-side Stripe key.

**Run (development)**

```powershell
npm run dev
```

**Build (production)**

```powershell
npm run build
npm run preview
```

**Design & Architecture Notes**

- Routes are defined in `src/router/routes.jsx` and map one-to-one with pages.
- React Query is used to centralize server-state (bookings, forum threads, etc.).
- Real-time features (chat/video) require the server-side Socket.IO and signaling servers to be functional.
- Stripe client libs are present, but server-side secret-key handling and webhooks must be implemented in the backend (see `pawfect-server`).

**Next Steps**

- Start the server (`pawfect-server`) and provide the API base URL used by the client.
- I can run `npm install` here or commit these README files if you want.
