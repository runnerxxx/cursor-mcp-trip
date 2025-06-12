/*
 * @Author: xulijing xulijing@zhangyue.com
 * @Date: 2025-06-12 16:25:23
 * @LastEditors: xulijing xulijing@zhangyue.com
 * @LastEditTime: 2025-06-12 16:55:51
 * @Description: file content
 * @FilePath: /my-vue-app/api/proxy.js
 */
export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: '只支持GET请求' });
    return;
  }
  
  const { usr, p29 } = req.query;
  
  if (!usr || !p29) {
    res.status(400).json({ error: '缺少必要参数 usr 或 p29' });
    return;
  }
  
  try {
    // 构建目标URL - 使用新的公网接口
    const targetUrl = `https://welfare-gateway.palmestore.com/gateway/user/encrypt?usr=${encodeURIComponent(usr)}&p29=${encodeURIComponent(p29)}`;
    
    console.log(`代理请求: ${targetUrl}`);
    console.log(`请求时间: ${new Date().toISOString()}`);
    
    // 发起请求
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
        'Accept': 'application/json'
      },
      // 设置超时时间为10秒
      signal: AbortSignal.timeout(10000)
    });
    
    console.log(`响应状态: ${response.status}`);
    console.log(`响应头: ${JSON.stringify(Object.fromEntries(response.headers))}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.text();
    console.log(`响应数据: ${data}`);
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(data);
    
  } catch (error) {
    console.error('代理请求错误:', error);
    console.error('错误类型:', error.name);
    console.error('错误消息:', error.message);
    
    let errorMessage = '代理请求失败';
    let statusCode = 500;
    
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      errorMessage = '请求超时 - 无法连接到内网服务器';
      statusCode = 504;
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'DNS解析失败 - 无法解析内网域名';
      statusCode = 502;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = '连接被拒绝 - 目标服务器不可达';
      statusCode = 502;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // 返回详细的错误信息
    res.status(statusCode).json({ 
      error: errorMessage,
      details: {
        errorType: error.name,
        errorCode: error.code,
                 timestamp: new Date().toISOString()
      }
    });
  }
} 