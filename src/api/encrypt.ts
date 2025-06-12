/*
 * @Author: xulijing xulijing@zhangyue.com
 * @Date: 2025-06-12 17:06:41
 * @LastEditors: xulijing xulijing@zhangyue.com
 * @LastEditTime: 2025-06-12 17:07:19
 * @Description: file content
 * @FilePath: /my-vue-app/src/api/encrypt.ts
 */
/**
 * 加密相关的API接口
 */

// 接口响应类型定义
export interface EncryptResponse {
  body: string
  code: number
  msg: string
}

// 请求参数类型定义
export interface EncryptParams {
  usr: string
  p29: string
}

/**
 * USR信息加密接口
 * @param params 加密参数
 * @returns Promise<string> 返回加密结果
 */
export async function encryptUsr(params: EncryptParams): Promise<string> {
  const { usr, p29 } = params
  
  if (!usr || !p29) {
    throw new Error('缺少必要参数 usr 或 p29')
  }
  
  // 构建请求URL
  const requestUrl = `https://welfare-gateway.palmestore.com/gateway/user/encrypt?usr=${encodeURIComponent(usr)}&p29=${encodeURIComponent(p29)}`
  
  console.log(`发起加密请求: ${requestUrl}`)
  
  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`服务器响应错误: HTTP ${response.status} ${response.statusText}`)
    }
    
    const resultText = await response.text()
    console.log(`加密响应: ${resultText}`)
    
    // 尝试解析JSON格式的响应
    try {
      const jsonData: EncryptResponse = JSON.parse(resultText)
      
      // 检查响应状态
      if (jsonData.code === 0 && jsonData.body) {
        return jsonData.body
      } else {
        throw new Error(`加密失败: ${jsonData.msg || '未知错误'}`)
      }
    } catch (parseError) {
      // 如果不是JSON格式，直接返回原始文本
      if (parseError instanceof SyntaxError) {
        return resultText
      }
      throw parseError
    }
  } catch (error) {
    console.error('加密请求失败:', error)
    
    if (error instanceof Error) {
      // 处理网络错误
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('网络连接失败，请检查网络连接')
      }
      
      // 处理跨域错误
      if (error.message.includes('CORS') || error.message.includes('blocked')) {
        throw new Error('跨域访问被阻止，请联系管理员')
      }
      
      throw error
    }
    
    throw new Error('未知错误')
  }
} 