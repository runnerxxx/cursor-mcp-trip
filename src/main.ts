/*
 * @Author: xulijing xulijing@zhangyue.com
 * @Date: 2025-04-29 11:49:23
 * @LastEditors: xulijing xulijing@zhangyue.com
 * @LastEditTime: 2025-06-11 18:28:07
 * @Description: file content
 * @FilePath: /my-vue-app/src/main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 创建Vue应用
const app = createApp(App)
app.use(router)
app.mount('#app')
