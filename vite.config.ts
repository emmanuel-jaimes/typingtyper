import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gist': {
        target: 'https://gist.githubusercontent.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gist/, ''),
      },
    },
  },
  build: {
    sourcemap: false,
  }
});
