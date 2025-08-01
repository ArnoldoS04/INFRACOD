import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/infracod.local-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/infracod.local.pem')),
    },
    host: 'infracod.local',  // Usa el dominio que definiste en hosts
    port: 5173,              // Puerto que usas en dev
  },
})
