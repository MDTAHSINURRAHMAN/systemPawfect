### Client-Side README

# Pawfect — Client

A full-featured React client for a pet services marketplace (adoption, trainers, vets, forum, payments).

✨ This README is generated from the repository files and dependencies — it reflects the app code, routes, and integrations present in the project.

**Repository notes:** the project folder is named `pawfect-client` while `package.json` lists the package name as `fitness-tracker-client` (both names are used in the source tree).

**Overview**

Pawfect is a client-side React application that powers a multi-faceted pet services platform: adoption listings, trainer booking, vet appointments, community forums, product sales, and payment flows. It uses Firebase for authentication, Stripe for payments, React Router for navigation, and React Query for remote data fetching and caching. The app emphasizes modular pages (member, trainer, vet, admin) and real-time features (chat/video calls) visible in the source tree.

🎯 Key Features

- **Multi-role UI**: Separate pages and routes for general users, trainers, vets, and administrators (see `src/pages/*` and `src/pages/admin/*`).
- **Authentication**: Firebase authentication wiring present in `src/firebase/firebaseConfig.js` and `src/context/AuthContext.jsx`.
- **Payments**: Stripe client libraries are included (`@stripe/react-stripe-js`, `@stripe/stripe-js`) with dedicated payment pages under `src/pages/payment/` and `src/payment/`.
- **Bookings & Scheduling**: Trainer booking and slot management pages (`TrainerBooking.jsx`, `ManageSlot.jsx`, `TrainerBookingPage.jsx`, `AddNewSlot.jsx`).
- **Adoption & Sales**: Adoption flow and product checkout components (`AdoptPet.jsx`, `AdoptPetDetails.jsx`, `ProductPayment.jsx`, `PetSalesReport.jsx`).
- **Community & Chat**: Forum, forum details, and chat pages suggesting Socket.IO and realtime interactions (`Forum.jsx`, `ForumDetails.jsx`, `socket.io-client` dependency and `ChatWithMember.jsx`).
- **Media & Animations**: Lottie animations and Framer Motion for polished UI (`@lottiefiles/react-lottie-player`, `lottie-react`, `framer-motion`).

🛠️ Tech Stack & Tools

- **Languages:** JavaScript (ES Module), JSX
- **Frameworks & Libraries:**
  - React ^18.3.1
  - React Router DOM ^7.1.1
  - @tanstack/react-query ^5.64.2 (data fetching + caching)
  - Firebase ^11.1.0 (auth)
  - Stripe client libs: `@stripe/react-stripe-js` ^3.1.1, `@stripe/stripe-js` ^5.5.0
  - Charting & UI libs: `recharts`, `react-chartjs-2`, `react-slick`, `daisyui`
  - Animations: `framer-motion`, `lottie-react`
  - Real-time comms: `socket.io-client`
- **Infrastructure / Build:**
  - Vite ^6.0.5 (dev server + bundling)
  - Tailwind CSS ^3.4.17 + DaisyUI for component utilities
- **Dev Tools:**
  - ESLint (`eslint`, `@eslint/js`, plugins), PostCSS, Autoprefixer
  - `react-query` devtools available as dependency

Versions taken from `package.json` dependencies and devDependencies in the repository.

📂 Project Structure (simplified, depth 2)
```

./
├─ package.json # npm scripts & dependencies
├─ vite.config.js # Vite configuration
├─ tailwind.config.js # TailwindCSS + DaisyUI
├─ src/
│ ├─ main.jsx # App entry: React Query, AuthProvider, RouterProvider
│ ├─ index.css # Tailwind entry styles
│ ├─ firebase/
│ │ └─ firebaseConfig.js # Firebase initialization (uses VITE\_ env vars)
│ ├─ context/
│ │ └─ AuthContext.jsx # Authentication context/provider
│ ├─ router/
│ │ └─ routes.jsx # App routes and private/admin routes
│ ├─ pages/ # Feature pages (adopt, trainers, vets, admin, payment, forum)
│ └─ components/ # Reusable UI components (Banner, Team, Testimonials...)
└─ public/ # Static assets and icons

````

Brief folder notes:
- `src/pages/` — Contains all route-level pages: user-facing flows, admin area, trainer and vet sections.
- `src/context/` — App-wide providers (authentication, etc.).
- `src/firebase/` — Firebase app + `auth` export; the app reads credentials from `import.meta.env` variables.
- `src/router/` — Central router and private route wrappers used by `main.jsx`.

🚀 Getting Started (local)

Prerequisites

- Node.js and npm (or Yarn / pnpm) installed on your machine.
# Pawfect — Client

A full-featured React client for a pet services marketplace (adoption, trainers, vets, forum, and payments).

✨ This README reflects the app code, routes, and integrations present in the repository.

**Overview**

Pawfect is a client-side React application powering a multi-faceted pet services platform: adoption listings, trainer booking, vet appointments, community forums, product sales, and payment flows. It uses Firebase for authentication, Stripe for payments, React Router for navigation, and React Query for remote data fetching and caching. The app emphasizes modular pages (member, trainer, vet, admin) and includes chat/video features that rely on real-time services.

🎯 Key Features

- **Multi-role UI**: Separate pages and routes for general users, trainers, vets, and administrators (see `src/pages/*` and `src/pages/admin/*`).
- **Authentication**: Firebase authentication wiring present in `src/firebase/firebaseConfig.js` and `src/context/AuthContext.jsx`.
- **Payments**: Stripe client libraries are included (`@stripe/react-stripe-js`, `@stripe/stripe-js`) with dedicated payment pages under `src/pages/payment/` and `src/payment/`.
- **Bookings & Scheduling**: Trainer booking and slot management pages (`TrainerBooking.jsx`, `ManageSlot.jsx`, `TrainerBookingPage.jsx`, `AddNewSlot.jsx`).
- **Adoption & Sales**: Adoption flow and product checkout components (`AdoptPet.jsx`, `AdoptPetDetails.jsx`, `ProductPayment.jsx`, `PetSalesReport.jsx`).
- **Community & Chat**: Forum, forum details, and chat pages suggesting Socket.IO and realtime interactions (`Forum.jsx`, `ForumDetails.jsx`, `socket.io-client` dependency and `ChatWithMember.jsx`).
- **Media & Animations**: Lottie animations and Framer Motion for polished UI (`@lottiefiles/react-lottie-player`, `lottie-react`, `framer-motion`).

🛠️ Tech Stack & Tools

- **Languages:** JavaScript (ES Module), JSX
- **Frameworks & Libraries:**
  - React ^18.3.1
  - React Router DOM ^7.1.1
  - @tanstack/react-query ^5.64.2 (data fetching + caching)
  - Firebase ^11.1.0 (auth)
  - Stripe client libs: `@stripe/react-stripe-js` ^3.1.1, `@stripe/stripe-js` ^5.5.0
  - Charting & UI libs: `recharts`, `react-chartjs-2`, `react-slick`, `daisyui`
  - Animations: `framer-motion`, `lottie-react`
  - Real-time comms: `socket.io-client`
- **Infrastructure / Build:**
  - Vite ^6.0.5 (dev server + bundling)
  - Tailwind CSS ^3.4.17 + DaisyUI for component utilities
- **Dev Tools:**
  - ESLint (`eslint`, `@eslint/js`, plugins), PostCSS, Autoprefixer
  - `react-query` devtools available as dependency

Versions taken from `package.json` dependencies and devDependencies in the repository.

📂 Project Structure (simplified, depth 2)

```
./
├─ package.json                # npm scripts & dependencies
├─ vite.config.js              # Vite configuration
├─ tailwind.config.js          # TailwindCSS + DaisyUI
├─ src/
│  ├─ main.jsx                 # App entry: React Query, AuthProvider, RouterProvider
│  ├─ index.css                # Tailwind entry styles
│  ├─ firebase/
│  │  └─ firebaseConfig.js     # Firebase initialization (uses VITE_ env vars)
│  ├─ context/
│  │  └─ AuthContext.jsx       # Authentication context/provider
│  ├─ router/
│  │  └─ routes.jsx            # App routes and private/admin routes
│  ├─ pages/                   # Feature pages (adopt, trainers, vets, admin, payment, forum)
│  └─ components/              # Reusable UI components (Banner, Team, Testimonials...)
└─ public/                     # Static assets and icons
```

Brief folder notes:
- `src/pages/` — Contains all route-level pages: user-facing flows, admin area, trainer and vet sections.
- `src/context/` — App-wide providers (authentication, etc.).
- `src/firebase/` — Firebase app + `auth` export; the app reads credentials from `import.meta.env` variables.
- `src/router/` — Central router and private route wrappers used by `main.jsx`.

🚀 Getting Started (local)

Prerequisites

- Node.js and npm (or Yarn / pnpm) installed on your machine.

Install

```powershell
cd d:/systemProject/pawfect-client
npm install
```

Environment variables

The app uses Vite environment variables for Firebase. Create a `.env` (or use your system environment) with the following keys:

- `VITE_apiKey`
- `VITE_authDomain`
- `VITE_projectId`
- `VITE_storageBucket`
- `VITE_messagingSenderId`
- `VITE_appId`

If your Stripe client key needs to be kept in environment variables for client-side initialization, follow the code patterns in `src/pages/payment/` and set an appropriate `VITE_STRIPE_PUBLISHABLE_KEY` if required by your integration.

Run (development)

```powershell
npm run dev
```

Build (production)

```powershell
npm run build
npm run preview
```

💡 Design Decisions & Architecture Notes

The client adopts a modular page-by-page structure that maps one-to-one with routes defined in `src/router/routes.jsx`. This layout keeps UI concerns localized: pages handle data orchestration while `src/components/` provides shared visual primitives.

React Query is used for remote data fetching and caching which simplifies server-state management across pages (booking lists, trainer availability, forum threads). This complements Firebase for authentication and lightweight real-time features.

Tailwind CSS + DaisyUI were chosen for rapid, utility-driven styling and pre-built components — enabling a consistent design system without heavy custom CSS. Vite provides a fast dev server and modern ESM bundling that shortens feedback loops during development.

Stripe client libraries are included to handle secure, PCI-compliant payment flows on the frontend; server-side payment handling (secret keys, webhooks) should be implemented in a backend service and is not present in this repo.

The presence of `socket.io-client`, chat components, and `VideoCall.jsx` indicate real-time and peer-to-peer communication features; these require corresponding server components (Socket.IO server, signaling server) to be fully functional.
