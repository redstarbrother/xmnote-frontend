import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:9527', // 后端服务器地址
        target: 'http://xmnote.frp.jhxblog.cn/api', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '')
          console.log(`Rewriting ${path} to ${newPath}`); // 查看终端输出
          return newPath;
        }
      },
    }
  }
})
