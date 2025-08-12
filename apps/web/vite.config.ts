import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Cambia '/latin2/' por el nombre de tu repositorio
  // Si tu repo es https://github.com/username/my-app, usa '/my-app/'
  base: '/latin-learning-app/',
  server: {
    host: true, // Listen on all network interfaces to allow phone access
    port: 5173
  }
})
