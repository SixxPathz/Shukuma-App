# Hosting Your Shukuma Vite React App (Free & Forever Options)

This guide shows several free, easy-to-use hosting options for your Vite-based React site: Cloudflare Pages (recommended), GitHub Pages, Netlify, Vercel, Firebase Hosting, and Surge. All these have free **forever** tiers for static sites (Cloudflare Pages, GitHub Pages, Firebase Spark, Netlify/Vercel free tiers). Use the option that suits your familiarity.

Prerequisites

- Git initialized and a GitHub repo (recommended) — you can still use other hosts without GitHub.
- Node.js + npm installed for building locally.
- Project uses `vite build` to output static site contents to `dist/`. (Your `package.json` already has `build: vite build`.)

Quick local check

1. Install dependencies:

```powershell
npm install
```

2. Build the site (production build):

```powershell
npm run build
```

3. Preview the build locally (optional):

```powershell
npm run preview
```

Important: Single-page app (SPA) routing

- Your app is an SPA (React Router). When hosting on static hosts, configure the host to redirect all non-file requests to `index.html`, so client-side routing works.

- For Netlify add a `_redirects` file at `public/_redirects` or root of `dist` with:

```text
/*    /index.html   200
```

- For GitHub Pages use a GitHub Actions deploy + `index.html` fallback ([recommended solution](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site-with-the-apex-domain)).

- Cloudflare Pages has built-in routing for SPAs — set the `Routes` or use a simple config in the Pages settings.

Option 1 — Cloudflare Pages (Recommended free forever option)
- Free, fast, easy. Good for Vite apps and provides custom domains and automatic builds.

Setup steps:

1. Push your code to GitHub (or GitLab, Bitbucket):

```powershell
git add .
git commit -m "Prepare site for hosting"
git push origin main
```

1. Go to [Cloudflare Pages](https://pages.cloudflare.com) and sign up / log in.
1. Click "Create a Project", connect your GitHub repo, and pick your repo.
1. In the Build settings:
   - Framework: None (or select Vite if available)
   - Build command: `npm run build`
   - Build output directory: `dist`
1. Environment variables: Add any Firebase keys and other secrets under "Environment variables" in the Cloudflare Pages site settings (these will be available during build).
1. Deploy. Cloudflare will run your build and deploy the `dist` directory.
1. (Optional) Configure a custom domain via the Cloudflare Pages dashboard.

SPA routing note: Cloudflare Pages supports SPA rewrites automatically in the Pages settings — enable `Directory Indexing` or add a `/_routes.json` (advanced). For most projects, Cloudflare's Pages UI has a toggle "Single Page App" that enables SPA rewrites.

Option 2 — GitHub Pages (Free forever, official)
- GitHub Pages hosts static sites from GitHub. It's easy and free forever.

Easiest with GitHub Actions (build and push `dist` to `gh-pages`):

1. Add an Actions workflow to `./github/workflows/pages-deploy.yml` (example below).
1. Commit and push, GitHub Actions builds and publishes to GitHub Pages automatically.

Sample GitHub Actions workflow (paste to `./github/workflows/gh-pages.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          publish_dir: ./dist
          publish_branch: gh-pages
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

Notes:

- On GitHub Pages, if you use a custom domain, configure the domain from repo Settings → Pages.

- If you use client-side routing, add a `404.html` that redirects to `index.html`. A common hack is to copy `index.html` to `404.html` in the built `dist/` so refreshes fall back to index.

Option 3 — Netlify (Free tier available forever for hobby projects)

- Connect your GitHub repo in Netlify, configure build command `npm run build` and publish directory `dist`.

- Add a `_redirects` file at `public/_redirects` or in `dist` if you build it automatically:

```text
/*  /index.html  200
```

Setup steps:

1. Sign up at [Netlify](https://app.netlify.com) and link your repository.

2. Configure build & deploy settings:

   - Base directory: (leave blank) — this project contains `package.json` at the repo root.
   - Build command: `npm ci && npm run build` (or `npm install && npm run build` if you don't want to commit a `package-lock.json`).
   - Publish directory: `dist`.

3. Environment variables: add your Firebase keys and any other secrets under "Site settings" → "Build & deploy" → Environment:

   - FIREBASE_API_KEY
   - FIREBASE_AUTH_DOMAIN
   - FIREBASE_PROJECT_ID
   - FIREBASE_STORAGE_BUCKET
   - FIREBASE_MESSAGING_SENDER_ID
   - FIREBASE_APP_ID
   - FIREBASE_MEASUREMENT_ID

4. Add SPA redirect handling (choose one):
   - Recommended (repo-file): add `netlify.toml` to the repo root (sample provided below) that sets the redirect rules and build settings.
   - Alternatively (Netlify setting): ensure a `/_redirects` file is included in your build output (add a file at `src/public/_redirects` or `public/_redirects` before build) with:

     ```text
     /* /index.html 200
     ```

5. Trigger a deploy and, if needed, clear the Netlify build cache (Deploys → Trigger deploy → Clear cache and deploy site).

6. Confirm the deployed site works and test page refreshes on nested SPA routes.

Sample `netlify.toml` (repo-controlled, optional)
```toml
[build]
  # base is empty string for repo root (keep it empty for repo root)
  base = ""
  command = "npm ci && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
```

Notes, troubleshooting & best practices
- If you previously set a Base directory in the Netlify UI to a string like `Shukuma App`, remove it (set blank) since `package.json` is at repo root.
- Use `npm ci` for reproducible installs if you have `package-lock.json`. If your repo does not contain `package-lock.json`, run `npm install` locally and commit `package-lock.json`. Netlify will use `npm ci` if a lockfile exists.
- If your build fails with "Could not read package.json" or "ENOENT /opt/build/repo/package.json", Netlify is building from a different directory than the one with `package.json`. Verify repository and branch, and that Base directory is blank.
- Build errors complaining about node engine or missing packages: add `engines` to `package.json` or set NODE_VERSION in Netlify Site -> Environment (for older Node compatibility):
  ```json
  "engines": {
    "node": "18.x"
  }
  ```
- Check Netlify Build logs for `npm ci` or `npm install` errors — they show missing dependencies or install problems.
- If you hit `EACCES` or `ENOSPC` errors in Netlify, try clearing the build cache and redeploying.

Local test before push / deploy
```powershell
# from repo root
npm ci
npm run build
Test-Path .\dist\index.html   # should return True
```

Advanced: Use Netlify CLI to preview production build locally
```powershell
npm install -g netlify-cli
netlify build  # runs the build and simulates Netlify rules
netlify dev   # runs a local server like Netlify's platform
```

Option 4 — Vercel (Free tier / hobby)

- Very fast and easy for React. Connect your GitHub repo, Vercel autodetects frameworks in most cases.

Build command: `npm run build`, Output directory: `dist`.

Option 5 — Firebase Hosting (Spark: free forever tier)

- Good if you're already using Firebase for auth or realtime features.

Steps to deploy:

1. Install Firebase CLI:

```powershell
npm install -g firebase-tools
```

1. Login and init:

```powershell
firebase login
firebase init hosting
```

Set `dist` as the public directory and say `No` to SPA rewrite if asked (you'll need to answer `Yes` to single-page app rewrite so routing works). This will add `firebase.json` config.

1. Build and deploy:

```powershell
npm run build
firebase deploy --only hosting
```

Option 6 — Surge.sh (Quick CLI static host; free forever for basic sites)

1. Install Surge:

```powershell
npm install -g surge
```

1. Deploy the `dist` directory:

```powershell
npm run build
surge ./dist your-project.surge.sh
```

Handling environment variables (Firebase keys, etc.)

- Never commit `.env` to the repo.
- Configure your build-time environment variables in the hosting provider:
  - Cloudflare Pages: Project settings -> Environment variables (Production)
  - Netlify: Settings -> Build & deploy -> Environment
  - Vercel: Project settings -> Environment Variables
  - GitHub Actions: Add to repo Settings -> Secrets -> Actions and fetch via `secrets.*` in workflow
  - Firebase: Not required for hosting; but if your code needs runtime env, use build-time envs or Cloud Functions.

SPA routing & _redirects examples

- Netlify: `public/_redirects` (or place in `dist`) and include:

```text
/* /index.html 200
```

- For GitHub Pages add `404.html` copying index’s content. A more advanced approach uses a small redirect script.

Checklist before deploying

1. Add a proper README, commit changes, and push code.
1. Run `npm run build` locally and verify the `dist` contains `index.html` and assets.
1. Add environment variables in the hosting dashboard, not in `.env` file committed to repo.
1. Configure SPA routing in host settings or with a `_redirects`/`404.html` solution.

Need a short recommendation?

- If you want the simplest, GitHub Pages + Actions is solid and free.
- If you prefer the best performance & ease of management with a modern UI and built-in SPA support, **Cloudflare Pages** is recommended.

Advanced notes

- Custom Domain: All providers above support adding and enabling HTTPS on custom domains.
- Analytics & QoS: Cloudflare Pages + Cloudflare CDN provides additional speed benefits.
- Caching & Invalidations: Cloudflare and Netlify have cache-invalidation controls; GitHub Pages is static so a new `gh-pages` commit should refresh.

If you want, I can:

- Add a preconfigured GitHub Actions workflow to your repo that builds and deploys to `gh-pages`.
- Or prepare a `netlify.toml` file and a `_redirects` file so it’s plug-and-play for Netlify.

---
Happy to set up any of the above options for you — let me know which one you prefer and I’ll add the appropriate workflow or guide to the repo.

---
Tips 💡
- Keep your `FIREBASE_*` keys in environment variables on your host rather than committing them to the repo.
- If you’d like a custom domain, add DNS records and verify via the host dashboard.

