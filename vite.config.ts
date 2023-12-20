/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

const env = loadEnv('', process.cwd(), '');

export default defineConfig({
  esbuild: {
    // remove console.log and debugger from production builds
    pure: env.NODE_ENV === 'production' ? ['console.log', 'debugger'] : [],
  },
  plugins: [
    // React plugin for HMR, JSX, etc.
    react(),

    // Enables path aliases like '@/...' to work
    // as configured in tsconfig.json
    viteTsconfigPaths(),
  ],
  server: {
    port: 5173,
  },
});
