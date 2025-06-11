<!--
 * @Author: xulijing xulijing@zhangyue.com
 * @Date: 2025-04-29 11:49:23
 * @LastEditors: xulijing xulijing@zhangyue.com
 * @LastEditTime: 2025-06-11 18:31:29
 * @Description: file content
 * @FilePath: /my-vue-app/src/App.vue
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 这里可以添加全局逻辑
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

/* 通用工具类 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
}
</style>
