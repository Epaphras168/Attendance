import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// replace with your actual ngrok host (it changes every time unless you reserve one)
export default defineConfig({
  plugins: [react()],
  base: '/Attendance',
  server: {
    allowedHosts: [
      '87e4a702d500.ngrok-free.app', // ngrok domain
    ],
  },
})
