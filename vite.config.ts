/*
 * @Author: xulijing xulijing@zhangyue.com
 * @Date: 2025-04-29 11:49:23
 * @LastEditors: xulijing xulijing@zhangyue.com
 * @LastEditTime: 2025-06-12 16:26:12
 * @Description: file content
 * @FilePath: /my-vue-app/vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/proxy': {
        target: 'http://dejian-welfare-welfare-gateway.test.svc.zhangyue-inc.com',
        changeOrigin: true,
        rewrite: (path) => {
          // 将 /proxy?usr=xxx&p29=xxx 转换为 /gateway/user/encrypt?usr=xxx&p29=xxx
          const url = new URL(path, 'http://localhost')
          const usr = url.searchParams.get('usr')
          const p29 = url.searchParams.get('p29')
          return `/gateway/user/encrypt?usr=${usr}&p29=${p29}`
        },
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('代理错误:', err)
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('发送请求到目标服务器:', proxyReq.getHeader('host') + proxyReq.path)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('从目标服务器收到响应:', proxyRes.statusCode, req.url)
          })
        }
      }
    }
  }
})
