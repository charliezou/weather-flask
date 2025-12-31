import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),tailwindcss(),
  ],
  server: {
    port: 3000,
    host: 'localhost', // 或者使用 '0.0.0.0' 来监听所有地址
  },
})