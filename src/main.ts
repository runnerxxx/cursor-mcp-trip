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

// 引入Arco Design Vue
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

// 创建Vue应用
const app = createApp(App)
app.use(router)

// 注册Arco Design组件
app.use(ArcoVue)

app.mount('#app')
