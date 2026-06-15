# TaxFiler Global

Production-ready React 19, Vite, JSX, Tailwind CSS, Firebase, and GitHub Pages application foundation.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Fill in Firebase and business contact environment variables.
4. Start local development with `npm run dev`.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates the production build.
- `npm run preview` previews the production build locally.
- `npm run lint` checks code quality.

## Deployment

This project deploys to GitHub Pages using Vite and a GitHub Actions workflow.

### GitHub Actions

- Workflow file: `.github/workflows/deploy.yml`
- Triggers: `push` to `main`
- Steps:
  - Checkout repository
  - Install npm dependencies
  - Build the Vite production bundle
  - Configure GitHub Pages
  - Upload the `dist` artifact
  - Deploy to GitHub Pages

### Vite configuration

- `vite.config.js` uses `base` set to `/${repositoryName}/` when `GITHUB_PAGES` is enabled.
- GitHub Actions sets `GITHUB_PAGES=true` during the build step so the project builds with the correct base path.

### SPA routing on GitHub Pages

- The app uses `HashRouter` for client-side navigation.
- `public/404.html` contains a redirect script that converts GitHub Pages fallback URLs into hash-based routes.

### Setup

1. Set your repository name in `vite.config.js` if it differs from `taxfiler-global`.
2. Set `homepage` in `package.json` to `https://<github-username>.github.io/taxfiler-global/`.
3. Add any required environment variables or secrets in GitHub repository settings.
4. Push to `main` to trigger deployment.

### Local build

Run:

```bash
npm install
GITHUB_PAGES=true npm run build
```

This ensures Vite uses the GitHub Pages base path locally if you want to test the same output path before deployment.
