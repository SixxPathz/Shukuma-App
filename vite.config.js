import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: Use a VITE_BASE_URL environment variable to set the base path at build time
// Example (Netlify): set VITE_BASE_URL = '/Shukuma-App/' for project page builds or leave as './' for root.
const basePath = process.env.VITE_BASE_URL || './';

export default defineConfig({
  base: basePath,
  plugins: [react()],
});
