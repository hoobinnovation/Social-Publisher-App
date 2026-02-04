# AuraSocial Frontend

This repository contains the **frontend-only** build of AuraSocial using Vue 3, Ionic Vue, Vuetify 3, TypeScript, Pinia, and Vue Router. The UI calls existing Firebase Functions via `httpsCallable` and uses Firestore/Storage where allowed.

## Prerequisites
- Node.js 18+
- Firebase project credentials

## Environment variables
Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FUNCTIONS_REGION=us-central1
VITE_USE_FUNCTIONS=true

# Emulator settings (optional)
VITE_EMULATOR_AUTH_HOST=localhost
VITE_EMULATOR_AUTH_PORT=9099
VITE_EMULATOR_FIRESTORE_HOST=localhost
VITE_EMULATOR_FIRESTORE_PORT=8080
VITE_EMULATOR_FUNCTIONS_HOST=localhost
VITE_EMULATOR_FUNCTIONS_PORT=5001
VITE_EMULATOR_STORAGE_HOST=localhost
VITE_EMULATOR_STORAGE_PORT=9199
```

## Install & Run
```
npm install
npm run dev
```

## Production build
```
npm run build
```

> Note: This project is frontend-only and does not include backend code. Configure Firebase Functions/Firestore/Storage in your existing Firebase project.
