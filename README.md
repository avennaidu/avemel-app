# Avemel Driver App - Deployable Build (flat layout)

All code files sit at the top level (no src/ folder) so GitHub web uploads can't
nest them wrong. Mobile fleet ops: Driver trips + checklists, Operations
instructions (Imports / Exports / Local), POD approvals, Admin leave + payroll.
46 drivers, 51 trucks, 75 trailers pre-seeded.

## Logins
- Driver - taps their name, no PIN
- Operations - PIN: Avemel26
- Admin & Payroll - PIN: Avemel27
Change PINs in App.jsx (OPS_PIN / ADMIN_PIN near the top).

## Upload to GitHub (the part that failed before)
Your repo must have these files AT THE ROOT (not inside any folder):

  index.html
  package.json
  vite.config.js
  main.jsx
  App.jsx
  storage.js
  .gitignore
  public/          <- folder with the icons + manifest.json

Easiest reliable upload: use GitHub Desktop (drag the whole folder, commit,
push). If using the website uploader, select ALL the files above and drag them
in together; after it finishes, confirm on GitHub that you can see App.jsx and
main.jsx at the top level of the repo (not inside a folder).

## Deploy on Vercel
1. vercel.com -> sign in with GitHub.
2. Add New -> Project -> import your repo.
3. Vercel auto-detects Vite. Click Deploy. You get a URL in ~1 min.

If you ever see "failed to resolve import ./main.jsx", it means main.jsx is not
at the repo root - re-upload so it is.

## Shared data across phones (Supabase) - recommended
Without this the app works but each phone keeps its own data.
1. supabase.com -> New project (free).
2. SQL Editor -> paste supabase-schema.sql -> Run.
3. Project Settings -> API: copy Project URL + anon public key.
4. Vercel -> your project -> Settings -> Environment Variables:
   VITE_SUPABASE_URL = your project URL
   VITE_SUPABASE_ANON_KEY = your anon key
5. Deployments -> Redeploy (env vars only apply on the next build).

## Install on iPhone
Open the Vercel URL in Safari -> Share -> Add to Home Screen.

## Local test
npm install
npm run dev
