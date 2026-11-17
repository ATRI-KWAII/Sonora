import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // 只监听 IPv4 回环：本机 ::1(IPv6 回环)被防火墙/WFP 拦截(EACCES)，
    // vite 默认把 localhost 解析到 ::1 会导致浏览器打不开页面。
    host: '127.0.0.1',
    // 本地联调：把 /api 开头的请求转发给 Spring Boot(8080)，浏览器看到的是同源请求，不涉及 CORS。
    // target 写 127.0.0.1 而不是 localhost：避开 Windows 上 Node 把 localhost 解析到 ::1 的顺序问题。
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
