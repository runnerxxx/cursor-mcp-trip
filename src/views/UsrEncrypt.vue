<template>
  <div class="usr-encrypt-page">
    <div class="encrypt-container">
      <h1 class="page-title">USR信息加密工具</h1>
      
      <div class="status-notice">
        • 支持所有产品的AppID选择和USR信息加密
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
          >
        </div>
        
        <div class="form-group">
          <label class="form-label" for="appIdSelect">AppID</label>
          <div class="select-container" ref="selectContainer">
            <input 
              type="text" 
              id="appIdSelect" 
              class="select-input" 
              placeholder="请选择或输入AppID" 
              autocomplete="off"
              v-model="formData.appId"
              @click="toggleDropdown"
              @input="handleInput"
              @keydown="handleKeydown"
              required
            >
            <span class="select-arrow" :class="{ 'arrow-rotate': isDropdownOpen }">▼</span>
            <div class="select-dropdown" :class="{ show: isDropdownOpen }">
              <div 
                v-for="option in filteredOptions" 
                :key="option.value"
                class="select-option"
                @click="selectOption(option)"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
        
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading"></span>
          {{ isLoading ? '加密中...' : '获取加密USR信息' }}
        </button>
      </form>
      
      <div v-if="result.show" class="result-section">
        <h3 class="result-title">加密结果</h3>
        <div class="result-content" :class="result.type">{{ result.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

// 类型定义
interface AppIdOption {
  label: string
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
}

// 响应式数据
const formData = ref<FormData>({
  usr: '',
  appId: ''
})

const isDropdownOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const result = ref<Result>({
  show: false,
  message: '',
  type: 'success'
})

const selectContainer = ref<HTMLElement | null>(null)

// AppID选项数据
const appIdOptions = ref<AppIdOption[]>([
  {"label": "得间小说安卓 (zy4248ba)", "value": "zy4248ba"},
  {"label": "得间小说 iOS (zy4248ba)", "value": "zy4248ba"},
  {"label": "得间小说安卓极速版 (zy8f2e24)", "value": "zy8f2e24"},
  {"label": "得间小说 iOS 极速版 (zy8f2e24)", "value": "zy8f2e24"},
  {"label": "追读 iOS (zybc0e74)", "value": "zybc0e74"},
  {"label": "七读小说 (zy819b7a)", "value": "zy819b7a"},
  {"label": "得间畅听 (zy9b17a7)", "value": "zy9b17a7"},
  {"label": "琅阅小说 (zy21c192)", "value": "zy21c192"},
  {"label": "得间大字版 (zy78e04c)", "value": "zy78e04c"},
  {"label": "阅瓣小说 (zy7595fe)", "value": "zy7595fe"},
  {"label": "贤读小说 (zyf36a0f)", "value": "zyf36a0f"},
  {"label": "追读小说 (zyd0d2ca)", "value": "zyd0d2ca"},
  {"label": "袋鼠点点小说 (zybd351b)", "value": "zybd351b"},
  {"label": "盛读小说 (zy0903f1)", "value": "zy0903f1"},
  {"label": "速读小说 (zyb03dd4)", "value": "zyb03dd4"},
  {"label": "浩看小说 (zy613a68)", "value": "zy613a68"},
  {"label": "秘读小说 (zy4cb605)", "value": "zy4cb605"},
  {"label": "浩阅小说 (zy8eef2a)", "value": "zy8eef2a"},
  {"label": "袋鼠点点短视频 (zyf4648c)", "value": "zyf4648c"},
  {"label": "枫以短视频 (zy3d1ef1)", "value": "zy3d1ef1"},
  {"label": "薏米短剧 (zy9351ae)", "value": "zy9351ae"},
  {"label": "速看短剧 (zya8dad8)", "value": "zya8dad8"},
  {"label": "伊看短剧 (zy6ee66f)", "value": "zy6ee66f"},
  {"label": "卡看 (zya3c0e0)", "value": "zya3c0e0"},
  {"label": "北京主体伊看 (zy8b0c8f)", "value": "zy8b0c8f"},
  {"label": "得间努比亚小说 (zye4a38c)", "value": "zye4a38c"},
  {"label": "得间鸿蒙 (zy4248ba)", "value": "zy4248ba"},
  {"label": "鸿蒙-七读小说 (zy819b7a)", "value": "zy819b7a"},
  {"label": "鸿蒙-浩看小说 (zy613a68)", "value": "zy613a68"},
  {"label": "鸿蒙-得间极速版 (zy8f2e24)", "value": "zy8f2e24"},
  {"label": "鸿蒙-阅瓣小说 (zy7595fe)", "value": "zy7595fe"},
  {"label": "鸿蒙-追读小说 (zyd0d2ca)", "value": "zyd0d2ca"},
  {"label": "新速看短剧（北京伊看） (zy8b0c8f)", "value": "zy8b0c8f"}
])

// 计算属性 - 过滤选项
const filteredOptions = computed<AppIdOption[]>(() => {
  if (!formData.value.appId) return appIdOptions.value
  
  const searchText = formData.value.appId.toLowerCase()
  return appIdOptions.value.filter(option => 
    option.label.toLowerCase().includes(searchText) ||
    option.value.toLowerCase().includes(searchText)
  )
})

// 方法
const toggleDropdown = (): void => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = (): void => {
  isDropdownOpen.value = false
}

const selectOption = (option: AppIdOption): void => {
  formData.value.appId = option.value
  closeDropdown()
}

const handleInput = (): void => {
  if (!isDropdownOpen.value && formData.value.appId) {
    isDropdownOpen.value = true
  }
}

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Enter') {
    e.preventDefault()
    closeDropdown()
  } else if (e.key === 'Escape') {
    closeDropdown()
  }
}

const showResult = (message: string, type: 'success' | 'error' = 'success'): void => {
  result.value = {
    show: true,
    message,
    type
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
    // 使用Vite代理或直接调用代理接口
    const proxyUrl = `/proxy?usr=${encodeURIComponent(usr)}&p29=${encodeURIComponent(p29)}`
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const resultText = await response.text()
      showResult(`✅ 加密成功！\n\n原始USR: ${usr}\nAppID: ${p29}\n加密结果: ${resultText}`, 'success')
    } else {
      throw new Error(`服务器响应错误: HTTP ${response.status}`)
    }
  } catch (error) {
    console.error('加密请求失败:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    showResult(`❌ 加密失败: ${errorMessage}\n\n请检查网络连接或联系管理员`, 'error')
  } finally {
    isLoading.value = false
  }
}

// 点击外部关闭下拉框的事件处理
const handleClickOutside = (e: Event): void => {
  if (selectContainer.value && !selectContainer.value.contains(e.target as Node)) {
    closeDropdown()
  }
}

// 添加事件监听器
document.addEventListener('click', handleClickOutside)
</script>

<style scoped>
.usr-encrypt-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.encrypt-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.status-notice {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #0c5460;
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
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

.select-container {
  position: relative;
}

.select-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: #f8f9fa;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.select-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
  transition: transform 0.3s ease;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
}

.select-dropdown.show {
  display: block;
}

.select-option {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.select-option:hover {
  background-color: #f8f9fa;
}

.select-option:last-child {
  border-bottom: none;
}

.select-option.selected {
  background-color: #667eea;
  color: white;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102,126,234,0.4);
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
  border-left: 4px solid #667eea;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  white-space: pre-line;
}

.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
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

.arrow-rotate {
  transform: translateY(-50%) rotate(180deg) !important;
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
}
</style> 