---
name: testing-kbcoffee
description: Run and test the KBCoffee app locally, including auth (Google sign-in) flows. Use when verifying UI or API changes in KBCoffee.
---

# Testing KBCoffee

## Running the app
- `npm install` then `npm run dev` (runs `tsx server.ts`, Express + Vite middleware on http://localhost:3000).
- The dev server might fail on Node 20 with `ERR_INVALID_URL_SCHEME` from tsx; using Node 22 (`nvm install 22 && nvm use 22`) fixed it. package.json engines want Node >= 20.19.
- Backend data is in-memory (see `INITIAL_USERS`/`INITIAL_LOTS` in `server.ts`) — restarts reset all data.
- The app auto-logs-in `kerobgebru32@gmail.com` on load (see `initBackend` in `src/store/index.ts`), so you may land already authenticated with a sidebar visible.

## Auth flows
- `/login` has clickable demo accounts that auto-fill the email; password is mostly decorative.
- Google sign-in (`src/lib/firebase.ts`) uses Firebase Auth `signInWithPopup`. Firebase web config comes from `firebase-applet-config.json` (project `omega-cairn-r2t1j`).
- Google popup might fail with `auth/unauthorized-domain` if the test host (e.g. `localhost`) isn't in Firebase console → Authentication → Settings → Authorized domains, or `auth/operation-not-allowed` if the Google provider isn't enabled under Sign-in method. These are console config issues, not code bugs — ask the user to update the Firebase console.
- Errors surface in a red banner above the form on both `/login` and `/register`.

## Lint
- `npm run lint` runs `tsc --noEmit` (no eslint).

## Gemini API
- `server.ts` uses `GEMINI_API_KEY` for `@google/genai`; AI endpoints will throw without it.

## Devin Secrets Needed
- `GEMINI_API_KEY` (only for AI features in `server.ts`).
- A Google test account would be needed to complete Google OAuth end-to-end; none is currently provisioned.
