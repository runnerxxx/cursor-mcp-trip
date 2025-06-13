<template>
  <div class="usr-encrypt-page">
    <!-- 动态背景元素 -->
    <div class="bg-animation">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>
      <div class="floating-shape shape-6"></div>
    </div>
    
    <div class="encrypt-container">
      <!-- 容器内装饰元素 -->
      <div class="container-decoration">
        <div class="deco-circle deco-1"></div>
        <div class="deco-circle deco-2"></div>
      </div>
      
      <h1 class="page-title">🐌 SnailLab</h1>
      <p class="page-subtitle">蜗牛实验室 · 稳步前进，持续学习</p>
      
      <div class="status-notice">
        • 当前功能：USR信息加密工具，支持多种AppID选择
      </div>
      
      <form @submit.prevent="handleSubmit" class="encrypt-form">
        <div class="form-group">
          <label class="form-label" for="usrInput">原始USR信息</label>
          <input 
            type="text" 
            id="usrInput" 
            class="form-input" 
            placeholder="请输入原始USR信息，例如：tj1279771586" 
            v-model="formData.usr"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">AppID</label>
          <div class="custom-select">
            <a-select
            v-model="formData.appId"
            placeholder="请选择AppID"
            :options="selectOptions"
            :filter-option="true"
            allow-search
          />
          </div>
         
        </div>
        
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading"></span>
          {{ isLoading ? '加密中...' : '获取加密USR信息' }}
        </button>
      </form>
      
      <div v-if="result.show" class="result-section">
        <h3 class="result-title">加密结果</h3>
        <div class="result-content" :class="result.type">
          <div class="result-message">{{ result.message }}</div>
          <div v-if="result.type === 'success' && result.encryptedData" class="encrypted-result">
            <div class="encrypted-label">加密结果：</div>
            <div class="encrypted-value">{{ result.encryptedData }}</div>
            <button @click="copyToClipboard" class="copy-btn" :disabled="isCopying">
              <span v-if="isCopying">已复制!</span>
              <span v-else>📋 复制</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { encryptUsr } from '../api'

// 类型定义
interface AppIdOption {
  text: string
  value: string
}

interface FormData {
  usr: string
  appId: string
}

interface Result {
  show: boolean
  message: string
  type: 'success' | 'error'
  encryptedData?: string
}

// 响应式数据
const formData = ref<FormData>({
  usr: '',
  appId: ''
})

const isLoading = ref<boolean>(false)
const isCopying = ref<boolean>(false)
const result = ref<Result>({
  show: false,
  message: '',
  type: 'success'
})

// AppID选项数据
const appIdOptions = ref<AppIdOption[]>([
  {"text": "得间小说安卓 (zy4248ba)", "value": "zy4248ba"},
  {"text": "得间小说 iOS (zy4248ba)", "value": "zy4248ba"},
  {"text": "得间小说安卓极速版 (zy8f2e24)", "value": "zy8f2e24"},
  {"text": "得间小说 iOS 极速版 (zy8f2e24)", "value": "zy8f2e24"},
  {"text": "追读 iOS (zybc0e74)", "value": "zybc0e74"},
  {"text": "七读小说 (zy819b7a)", "value": "zy819b7a"},
  {"text": "得间畅听 (zy9b17a7)", "value": "zy9b17a7"},
  {"text": "琅阅小说 (zy21c192)", "value": "zy21c192"},
  {"text": "得间大字版 (zy78e04c)", "value": "zy78e04c"},
  {"text": "阅瓣小说 (zy7595fe)", "value": "zy7595fe"},
  {"text": "贤读小说 (zyf36a0f)", "value": "zyf36a0f"},
  {"text": "追读小说 (zyd0d2ca)", "value": "zyd0d2ca"},
  {"text": "袋鼠点点小说 (zybd351b)", "value": "zybd351b"},
  {"text": "盛读小说 (zy0903f1)", "value": "zy0903f1"},
  {"text": "速读小说 (zyb03dd4)", "value": "zyb03dd4"},
  {"text": "浩看小说 (zy613a68)", "value": "zy613a68"},
  {"text": "秘读小说 (zy4cb605)", "value": "zy4cb605"},
  {"text": "浩阅小说 (zy8eef2a)", "value": "zy8eef2a"},
  {"text": "袋鼠点点短视频 (zyf4648c)", "value": "zyf4648c"},
  {"text": "枫以短视频 (zy3d1ef1)", "value": "zy3d1ef1"},
  {"text": "薏米短剧 (zy9351ae)", "value": "zy9351ae"},
  {"text": "速看短剧 (zya8dad8)", "value": "zya8dad8"},
  {"text": "伊看短剧 (zy6ee66f)", "value": "zy6ee66f"},
  {"text": "卡看 (zya3c0e0)", "value": "zya3c0e0"},
  {"text": "北京主体伊看 (zy8b0c8f)", "value": "zy8b0c8f"},
  {"text": "得间努比亚小说 (zye4a38c)", "value": "zye4a38c"},
  {"text": "得间鸿蒙 (zy4248ba)", "value": "zy4248ba"},
  {"text": "鸿蒙-七读小说 (zy819b7a)", "value": "zy819b7a"},
  {"text": "鸿蒙-浩看小说 (zy613a68)", "value": "zy613a68"},
  {"text": "鸿蒙-得间极速版 (zy8f2e24)", "value": "zy8f2e24"},
  {"text": "鸿蒙-阅瓣小说 (zy7595fe)", "value": "zy7595fe"},
  {"text": "鸿蒙-追读小说 (zyd0d2ca)", "value": "zyd0d2ca"},
  {"text": "新速看短剧（北京伊看） (zy8b0c8f)", "value": "zy8b0c8f"}
])

// 计算属性 - Arco Select选项数据
const selectOptions = computed(() => {
  return appIdOptions.value.map(option => ({
    label: option.text,
    value: option.value
  }))
})

// 方法
const showResult = (message: string, type: 'success' | 'error' = 'success', encryptedData?: string): void => {
  result.value = {
    show: true,
    message,
    type,
    encryptedData
  }
  
  nextTick(() => {
    const resultElement = document.querySelector('.result-section')
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const handleSubmit = async (): Promise<void> => {
  const usr = formData.value.usr.trim()
  const p29 = formData.value.appId.trim()
  
  if (!usr || !p29) {
    showResult('请填写完整的USR信息和AppID', 'error')
    return
  }
  
  isLoading.value = true
  
  try {
    // 调用封装的API方法
    const encryptedResult = await encryptUsr({ usr, p29 })
    
    showResult(`✅ 加密成功！\n\n原始USR: ${usr}\nAppID: ${p29}`, 'success', encryptedResult)
  } catch (error) {
    console.error('加密请求失败:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    showResult(`❌ 加密失败: ${errorMessage}`, 'error')
  } finally {
    isLoading.value = false
  }
}

// 复制到剪贴板
const copyToClipboard = async (): Promise<void> => {
  if (!result.value.encryptedData) return
  
  try {
    await navigator.clipboard.writeText(result.value.encryptedData)
    isCopying.value = true
    
    // 2秒后恢复按钮状态
    setTimeout(() => {
      isCopying.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    
    // 降级方案：使用传统的复制方法
    try {
      const textArea = document.createElement('textarea')
      textArea.value = result.value.encryptedData || ''
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      isCopying.value = true
      setTimeout(() => {
        isCopying.value = false
      }, 2000)
    } catch (fallbackError) {
      console.error('降级复制方案也失败:', fallbackError)
      alert('复制失败，请手动选择文本复制')
    }
  }
}


</script>

<style scoped>
.usr-encrypt-page {
  background: 
    radial-gradient(circle at 20% 80%, rgba(179, 127, 235, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(211, 173, 247, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(179, 127, 235, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.encrypt-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.page-title {
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 8px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: 400;
  margin-top: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-notice {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.encrypt-form {
  width: 100%;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.9);
}

.form-input:hover {
  border-color: rgba(179, 127, 235, 0.5);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 1px rgba(179, 127, 235, 0.2);
}

.form-input:focus {
  outline: none;
  border-color: rgba(179, 127, 235, 0.6);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 3px rgba(179, 127, 235, 0.15);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* Arco Select自定义样式 - 紫色主题 */
.custom-select {
  width: 100%;
}


.custom-select :deep(.arco-select-view) {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 16px;
  transition: all 0.3s ease;
  height: 48px;
  box-shadow: none !important;
  display: flex;
  align-items: center;
}

.custom-select :deep(.arco-select-view:hover) {
  border-color: rgba(179, 127, 235, 0.5) !important;
  background: rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 0 0 1px rgba(179, 127, 235, 0.2) !important;
}

.custom-select :deep(.arco-select-view-focus) {
  border-color: rgba(179, 127, 235, 0.6) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 0 0 3px rgba(179, 127, 235, 0.15) !important;
}

.custom-select :deep(.arco-select-view-value) {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 20px;
}

.custom-select :deep(.arco-select-view-placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.custom-select :deep(.arco-select-view-suffix) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.custom-select :deep(.arco-select-view-arrow) {
  color: rgba(255, 255, 255, 0.7) !important;
  transition: all 0.3s ease;
}

.custom-select :deep(.arco-select-view-arrow.arco-select-view-arrow-expand) {
  transform: rotate(180deg);
  color: rgba(179, 127, 235, 0.8) !important;
}

.custom-select :deep(.arco-select-view-input) {
  color: rgba(255, 255, 255, 0.9) !important;
  background: transparent !important;
  font-size: 16px;
}

.custom-select :deep(.arco-select-view-input::placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #b37feb 0%, #d3adf7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(179, 127, 235, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.result-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-title {
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.result-content {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #b37feb;
}

.result-message {
  word-break: break-all;
  font-family: 'Courier New', monospace;
  white-space: pre-line;
  margin-bottom: 15px;
}

.encrypted-result {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  margin-top: 10px;
}

.encrypted-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 14px;
}

.encrypted-value {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
  color: #212529;
  margin-bottom: 12px;
  line-height: 1.5;
}

.copy-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.copy-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.copy-btn:active {
  transform: translateY(0);
}

.copy-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #b37feb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #e74c3c;
  background: #fdf2f2;
  border-left-color: #e74c3c;
}

.success {
  color: #27ae60;
  background: #f2fdf2;
  border-left-color: #27ae60;
}



/* 动态背景样式 */
.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation: float1 6s ease-in-out infinite;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 15%;
  animation: float2 8s ease-in-out infinite;
  background: rgba(179, 127, 235, 0.15);
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 20%;
  animation: float3 7s ease-in-out infinite;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  right: 20%;
  animation: float4 9s ease-in-out infinite;
  background: rgba(211, 173, 247, 0.12);
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 60%;
  left: 50%;
  animation: float5 5s ease-in-out infinite;
  border-radius: 20% 80% 80% 20% / 20% 20% 80% 80%;
}

.shape-6 {
  width: 90px;
  height: 90px;
  top: 40%;
  right: 40%;
  animation: float6 10s ease-in-out infinite;
  background: rgba(102, 126, 234, 0.1);
}

@keyframes float1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes float2 {
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  50% { transform: translateX(20px) rotate(-180deg); }
}

@keyframes float3 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  33% { transform: translateY(-15px) translateX(15px) rotate(120deg); }
  66% { transform: translateY(15px) translateX(-15px) rotate(240deg); }
}

@keyframes float4 {
  0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
  50% { transform: translateY(-25px) scale(1.1) rotate(180deg); }
}

@keyframes float5 {
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  25% { transform: translateX(10px) rotate(90deg); }
  50% { transform: translateX(-10px) rotate(180deg); }
  75% { transform: translateX(5px) rotate(270deg); }
}

@keyframes float6 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  20% { transform: translateY(-10px) translateX(10px) rotate(72deg); }
  40% { transform: translateY(10px) translateX(20px) rotate(144deg); }
  60% { transform: translateY(-5px) translateX(-10px) rotate(216deg); }
  80% { transform: translateY(15px) translateX(-20px) rotate(288deg); }
}

.encrypt-container {
  position: relative;
  z-index: 1;
}

/* 容器内装饰元素 */
.container-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.deco-1 {
  width: 150px;
  height: 150px;
  top: -75px;
  right: -75px;
  animation: rotate 20s linear infinite;
}

.deco-2 {
  width: 100px;
  height: 100px;
  bottom: -50px;
  left: -50px;
  animation: rotate 15s linear infinite reverse;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .usr-encrypt-page {
    padding: 15px;
  }
  
  .encrypt-container {
    padding: 30px 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  /* 移动端减少动画元素 */
  .shape-3, .shape-5, .shape-6 {
    display: none;
  }
  
  .floating-shape {
    opacity: 0.6;
  }
  
  /* 移动端Select优化 */
  .custom-select :deep(.arco-select-view) {
    font-size: 14px;
    padding: 10px 12px;
    min-height: 44px;
  }
  
  .custom-select :deep(.arco-select-view-value) {
    font-size: 14px;
  }
  
  .custom-select :deep(.arco-select-option) {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style> 

<style>
/* 下拉框面板样式 - 紫色主题 */
.arco-select-dropdown {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-radius: 12px !important;
  border: 1px solid rgba(179, 127, 235, 0.2) !important;
  box-shadow: 
    0 8px 32px rgba(179, 127, 235, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1) !important;
  margin-top: 4px;
  overflow: hidden;
}

.arco-select-dropdown-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
}

.arco-select-option {
  padding: 12px 16px;
  color: #4a4a4a !important;
  font-size: 14px;
  transition: all 0.2s ease;
  border-radius: 8px !important;
  margin: 2px 0;
  background: transparent !important;
}

.arco-select-option:hover {
  background: rgba(179, 127, 235, 0.1) !important;
  color: #b37feb !important;
  transform: translateX(2px);
}

.arco-select-option-selected {
  background: linear-gradient(135deg, rgba(179, 127, 235, 0.15), rgba(211, 173, 247, 0.15)) !important;
  color: #b37feb !important;
  font-weight: 500;
  border: 1px solid rgba(179, 127, 235, 0.2) !important;
}

.arco-select-option-active {
  background: rgba(179, 127, 235, 0.08) !important;
}

.arco-select-option-disabled {
  color: #999 !important;
  background: transparent !important;
  opacity: 0.5;
}

/* 搜索无结果时的样式 */
.arco-select-dropdown-empty {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
  background: rgba(179, 127, 235, 0.05);
  border-radius: 8px;
  margin: 8px;
}

/* 滚动条样式 - 紫色主题 */
.arco-select-dropdown-list::-webkit-scrollbar {
  width: 6px;
}

.arco-select-dropdown-list::-webkit-scrollbar-track {
  background: rgba(179, 127, 235, 0.1);
  border-radius: 3px;
}

.arco-select-dropdown-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #b37feb, #d3adf7);
  border-radius: 3px;
  transition: all 0.2s ease;
}

.arco-select-dropdown-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #9254de, #b37feb);
  transform: scaleY(1.1);
}
</style>