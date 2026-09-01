# Unbounded Spac3s website

A single-page React site. Every buy button opens the matching live Payhip product,
so Payhip handles the checkout and delivery while this site is your branded front door.

## Run it locally (optional)
1. Install Node.js (nodejs.org) if you don't have it.
2. In this folder, run:
   npm install
   npm run dev
3. Open the link it prints (usually http://localhost:5173).

## Put it live on Vercel (the easy way)
1. Go to vercel.com and log in (you have Pro).
2. Click "Add New… → Project".
3. Either drag this whole folder in, or push it to a GitHub repo and import that.
4. Vercel auto-detects Vite. Leave the build settings as they are and click Deploy.
5. In about a minute you get a live link. Add your custom domain under
   Project → Settings → Domains.

## What to update later
- Buy links live in src/App.jsx in the PAYHIP object at the top. If a Payhip
  link ever changes, update it there.
- The Calendly box on the Services page is a placeholder. When you have a
  Calendly account, paste its embed where that box is.
- Prices shown on the site are labels only; the real price is whatever Payhip
  charges. If you raise prices later, update the labels here to match.
