# Netlify Deployment Guide (Shukuma App)

This document contains a step-by-step guide for deploying the Shukuma Vite React app to Netlify. It's tailored to the repo layout in this project (`package.json` is at repo root, the app uses Vite and outputs to `dist/`).

✅ Quick checklist

- Ensure `package.json` and `package-lock.json` are committed to repo root (they are present here).
- Use `netlify.toml` (recommended) or set the Netlify UI build settings matched to the project: build command, base directory, publish directory.
- Add SPA redirects to support React Router using `_redirects` or `netlify.toml` rules.
- Set Firebase and other secret environment variables in Netlify site settings.

## Prerequisites (local)

- Node.js + npm installed (Node 18+ recommended).
- A Netlify account and a Git hosting provider (GitHub is recommended).
- Local repo up-to-date and a clean build:

```powershell
# install deps
npm ci

# build locally for verification
npm run build

# verify dist exists
Test-Path .\dist\index.html  # should return True
```

## Netlify build settings

- Base directory: (leave blank) — `package.json` is at the repo root.
- Build command: `npm ci && npm run build` — reproducible install using your `package-lock.json`.
  - If you do not want to commit a lockfile, use `npm install && npm run build` instead.
- Publish directory: `dist`

## Environment variables (Netlify UI)

Add your Firebase config and other secret keys in Netlify: Settings → Build & deploy → Environment variables. Since this repo uses Vite, you must add the env vars with the `VITE_` prefix so they are available at build time.

Use the following variable names in Netlify (case-sensitive):

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

Notes:
- Do not commit real secrets to the repo. Use `.env.local` for local dev and set production variables in Netlify UI.
- `VITE_` environment variables are inlined at build time into your client bundle. Rotate keys if you believe they have been exposed publicly.

## SPA routing (React Router) support

- Recommended (repo-controlled): Use `netlify.toml` (this repo already includes one).
- Alternative: Add a `public/_redirects` with the single-line rule below. Vite will copy `public` to `dist` automatically.

`public/_redirects` contents:

```text
/* /index.html 200
```

## Sample `netlify.toml` (already in repo root, included here for reference)

```toml
[build]
  base = ""
  command = "npm ci && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
```

## Netlify UI Deployment (GitHub -> Netlify)

1. Go to [Netlify](https://app.netlify.com) and create or select your site.
1. Choose your Git provider and pick the repo `SixxPathz/Shukuma-App`.
1. Under "Build settings":

- Base directory: (leave blank) — this repo has `package.json` at the repo root.
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

1. Add environment variables as described above in Netlify UI.

1. Save & Deploy. Netlify will run the build via `netlify.toml` or the UI configuration.

## Local Netlify CLI workflow (optional, recommended for testing)

```powershell
# install CLI
npm install -g netlify-cli

# run a local build like Netlify
netlify build

# serve the built site locally (useful for debugging)
netlify dev
```

## Common build errors & fixes

- "Could not read package.json" or ENOENT errors: Netlify is building from the wrong base dir; make sure Base directory is blank and `package.json` is in repo root.
- `npm ci` fails: Netlify will use `npm ci` by default. Ensure `package-lock.json` is committed. Run `npm install` locally, commit `package-lock.json`, and push.
- `npm install` fails or builder errors: Check the Node version. Add the `engines` field in `package.json` or set NODE_VERSION in Netlify Environment. Example:

```json
"engines": { "node": "18.x" }
```

- SPA routes still 404 on refresh: Ensure `netlify.toml` or `_redirects` was present in `dist` and Netlify published it correctly.
- Environment variables not loaded: Make sure to set them in the Netlify site UI (not in a committed `.env`). If a build needs them at build-time they must be added in the Build & deploy > Environment > Environment variables tab.

## Warning: previously committed secrets & `dist/` artifacts

We found that earlier build artifacts (`dist/`) or environment files were committed to this repository and contain Firebase client configuration. While Firebase client config is intentionally part of SPA builds (Firebase config is client-side and expected in the bundle), you should NOT commit local `.env` files or other secret files to your repo. If a key was exposed, rotate it immediately and consider removing the files from Git history.

Steps for a safe, minimum cleanup (PowerShell):

```powershell
# Remove the .env and dist from the index so they are not tracked anymore
git rm --cached .env
git rm -r --cached dist
git commit -m "Remove local env and dist artifacts that contain secrets"
git push origin main
```

If you want to remove these files from git history entirely, use BFG or `git filter-repo` (requires a FULL repo backup and careful use):

```powershell
# Example with BFG (read the docs before using and backup first)
# bfg --delete-files .env
# bfg --delete-files dist
# git reflog expire --expire=now --all
# git gc --prune=now --aggressive
# git push --force
```

Minimum remediation steps:
- Immediately rotate your Firebase API key and other sensitive values in the Firebase Console.
- Update Netlify environment variables with the new keys.
- Rebuild & redeploy on Netlify.

If you want me to help: I can prepare a short, safe script/sequence to untrack the files, update Netlify vars, and optionally run BFG with a backup plan.

## Post-deploy verification

- Visit your Netlify site URL (provided by Netlify) and test links, SPA routes, and features that depend on Firebase.
- Inspect Netlify build logs on failure (Deploys → select your deploy → Show deploy log). Use the logs to locate the failing step.

## Advanced debug tips

- Clear the build cache and re-deploy if you run into strange caching/old build artifact issues: Deploys → Trigger deploy → Clear cache and deploy site.
- Use `netlify build` locally to reproduce the Netlify build behavior and make fixes locally before pushing.
- If you need a custom domain, set it from the Netlify site dashboard and update DNS records accordingly; Netlify provisions HTTPS automatically.

## Quick verification commands (PowerShell)

```powershell
# build locally to confirm everything works
npm ci
npm run build
Test-Path .\dist\index.html  # should return True

# optionally use netlify CLI to build & dev
netlify build
netlify dev
```

## Troubleshooting checklist for this repo

- `package.json` at root — OK.
- `package-lock.json` present — OK (so `npm ci` is supported).
- `vite.config.js` base set to `./` — OK, ensures relative paths.
- `netlify.toml` added to repo — OK, Netlify will pick it up automatically.
- Add `public/_redirects` or rely on `netlify.toml` redirects for SPA fallback.

If you want, I can:

- Add `public/_redirects` to the repo now and commit it (Vite copies `public` to `dist`).
- Add a `deploy` script in `package.json` for convenience (e.g. `deploy: netlify deploy --prod`).
- Validate a full Netlify deploy simulation locally via `netlify build` and share the exact commands you can use to deploy locally.

---
If you want me to create the `public/_redirects` file and commit it to the repo (or add a GitHub Action to auto deploy to Netlify), say which action you prefer and I'll add it next.
