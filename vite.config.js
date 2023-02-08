import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/2022-Rocket-W19-TodoJwtReact/",
  plugins: [react()],
})
