import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

const repositoryName = 'taxfiler-global';

// Read package.json without using import assertions (avoids older Node issues)
let pkg = {};
try {
  const pkgRaw = readFileSync(new URL('./package.json', import.meta.url));
  pkg = JSON.parse(pkgRaw.toString('utf-8'));
} catch (err) {
  // If package.json can't be read, continue with defaults and warn
  console.warn('[vite.config] Could not read package.json:', err.message || err);
}

const homepage = pkg.homepage?.trim() || '';
const homepagePath = homepage ? new URL(homepage, 'https://example.com').pathname.replace(/\/$/, '/') : '';
const isExplicitGitHubPages = process.env.GITHUB_PAGES === 'true';
const isGitHubPages = isExplicitGitHubPages || Boolean(homepagePath);

// Validation: require correct homepage only when explicitly deploying to GH Pages
if (isExplicitGitHubPages) {
  if (!homepage) {
    throw new Error(
      'GitHub Pages deployment requires package.json homepage to be set to https://<username>.github.io/taxfiler-global/.'
    );
  }
  if (homepage.includes('USERNAME.github.io')) {
    throw new Error(
      'Please replace USERNAME in package.json homepage with your GitHub username before deploying to GitHub Pages.'
    );
  }
  if (!homepagePath.endsWith(`/${repositoryName}/`)) {
    throw new Error(
      `The homepage path must end with /${repositoryName}/ when deploying to GitHub Pages. Found: ${homepage}`
    );
  }
} else {
  // Non-fatal: warn if homepage still has placeholder; fallback to repo base
  if (homepage && homepage.includes('USERNAME.github.io')) {
    console.warn(
      '[vite.config] package.json homepage still contains USERNAME.github.io placeholder — using fallback base path.'
    );
  }
}

const base = isGitHubPages ? (homepagePath || `/${repositoryName}/`) : '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
  },
  server: {
    host: true,
    port: 5173,
  },
});
