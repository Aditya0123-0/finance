import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = 'taxfiler-global';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? `/${repositoryName}/` : '/',
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
