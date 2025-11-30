# GitHub Pages Deployment (Shukuma App)

This document shows how to deploy your Vite + React app to GitHub Pages using GitHub Actions.

Overview:
- Build your app with `npm run build` on GitHub Actions
- Upload the `dist` directory to GitHub Pages via the official `actions/deploy-pages` action
- Set the `VITE_FIREBASE_*` variables in GitHub Actions secrets so the build can inline them without committing secrets
- Use a 404 fallback (`404.html`) for SPA routing

Quick checklist
- Remove `dist` from the repo and add it to `.gitignore` (if currently committed). See commands below.
- Set environment variables as GitHub Secrets (see below)
- Verify `vite.config.js#base` settings to match your publishing path (project pages or user/organization pages)
- Use the built-in workflow `.github/workflows/gh-pages-deploy.yml` (already added)

1) Installing and Testing Locally (PowerShell)

```powershell
# Install deps
npm ci
# Dev server
npm run dev
# Build and preview locally
npm run build
npm run preview
# Or install an http server to serve dist as GitHub pages does
npm i -g serve
serve -s dist -l 5000  # serve statically on port 5000
``` 

2) Vite base configuration (choose one)
- If you deploy to a project site (https://<username>.github.io/<repo>), set base in `vite.config.js` to:

```js
export default defineConfig({
  base: '/Shukuma-App/',
  plugins: [react()],
});
```

- If you're deploying to a user site (https://<username>.github.io) or you prefer relative paths, you can keep `base: './'`.
- If you want the build to select base automatically for local dev vs production, you can do:

```js
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/Shukuma-App/' : './',
  plugins: [react()],
});
```

3) Protect your Firebase values: Add GitHub Secrets
- Visit: Settings → Secrets and variables → Actions → New repository secret
- Add the following secrets (names must match the workflow env names):
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID
  - VITE_FIREBASE_MEASUREMENT_ID

4) GitHub Actions Workflow (already added):
- `.github/workflows/gh-pages-deploy.yml` builds with secrets injected and deploys to Pages.
- It also copies `index.html` to `404.html` to allow SPA fallback.

5) If `dist/` or `.env` were committed before, clean up the repo index (PowerShell):

```powershell
# Stop tracking committing dist and .env
git rm --cached -r dist
git rm --cached .env
# Commit the removal
git commit -am "Remove dist and .env from repository to protect secrets"
git push origin main
# Add to .gitignore if not already
Add-Content -Path .gitignore -Value "dist`n.env`n.env.local"
```

If you need to purge them from Git history (if they were public), follow an approach with `BFG` or `git filter-repo`. If you're unsure, ask for detailed help — I can walk you through it.

6) Verify the deployed URL
- If deploying to `main` with this workflow, GitHub Pages will publish to either:
  - `https://<username>.github.io/<repo>/` (project site `repo`)
  - or `https://<username>.github.io/` (if it’s a user site and you configure `main` branch root)

Additional step: Configure GitHub Pages to use the `gh-pages` branch
- Go to the repo Settings → Pages, and set the Source to `gh-pages` branch and `/ (root)` as the folder.
  The `peaceiris/actions-gh-pages` action pushes the built `dist/` files to `gh-pages`.

7) Important Notes for SPA & Routing
- React Router uses `BrowserRouter` in the app. BrowserRouter requires server fallback to index.html for any client route.
- We create a `404.html` (a copy of `index.html`) at build time so that GitHub Pages returns the SPA index for unknown routes.
- If you need route base path changes, set `BrowserRouter` <Router basename="/Shukuma-App"> if you deploy to a project site and want to avoid setting `base` in Vite.

8) Local Testing Commands

```powershell
# Build locally
npm run build
# Serve statically
npx serve -s dist -l 5000
# Test at http://localhost:5000/<subpath>
```

9) Troubleshooting common issues
- Blank page on the GitHub Pages site: check browser DevTools console, verify asset paths (do the script references match `assets/*.js`?), check if Vite base is correct.
- If components expect absolute paths, use `base: '/Shukuma-App/'` in `vite.config.js`.
- If things still 404 on refresh, ensure `cp dist/index.html dist/404.html` ran during the workflow.

If you'd like, I can:
- Update `vite.config.js` to set the base value for project pages and add an environment variable option.
- Commit the new GitHub Actions workflow (I added it to ` .github/workflows/gh-pages-deploy.yml`).
- Optionally set a small script in `package.json` for a manual deploy using `gh-pages` package as another option.

---

Examples:
- GitHub Actions workflow file is already added at `.github/workflows/gh-pages-deploy.yml` and builds `dist` and pushes it to Pages. Make sure you added the VITE firebase secrets in the repository.

If you want me to make additional changes (e.g., change `vite.config.js` base or add a `manifest` file or a `deploy` script in package.json), say the word and I’ll implement them now.