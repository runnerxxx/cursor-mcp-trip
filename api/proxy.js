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
    // 构建目标URL
    const targetUrl = `http://dejian-welfare-welfare-gateway.test.svc.zhangyue-inc.com/gateway/user/encrypt?usr=${encodeURIComponent(usr)}&p29=${encodeURIComponent(p29)}`;
    
    console.log(`代理请求: ${targetUrl}`);
    
    // 发起请求
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // 设置超时时间
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.text();
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(data);
    
  } catch (error) {
    console.error('代理请求错误:', error);
    
    let errorMessage = '代理请求失败';
    if (error.name === 'TimeoutError') {
      errorMessage = '请求超时';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ error: errorMessage });
  }
} 