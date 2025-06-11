import http from 'http';
import https from 'https';
import url from 'url';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3001;

// 获取文件的MIME类型
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon'
    };
    return mimeTypes[ext] || 'text/plain';
}

// 创建代理服务器
const server = http.createServer((req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // 处理API代理请求
    if (req.method === 'GET' && pathname === '/proxy') {
        const usr = parsedUrl.query.usr;
        const p29 = parsedUrl.query.p29;
        
        if (!usr || !p29) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '缺少必要参数 usr 或 p29' }));
            return;
        }
        
        // 构建目标URL
        const targetUrl = `http://dejian-welfare-welfare-gateway.test.svc.zhangyue-inc.com/gateway/user/encrypt?usr=${encodeURIComponent(usr)}&p29=${encodeURIComponent(p29)}`;
        
        console.log(`代理请求: ${targetUrl}`);
        
        // 发起HTTP请求
        const request = http.get(targetUrl, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                res.writeHead(response.statusCode, {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            });
        });
        
        request.on('error', (error) => {
            console.error('代理请求错误:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '代理请求失败: ' + error.message }));
        });
        
        request.setTimeout(10000, () => {
            request.destroy();
            res.writeHead(408, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '请求超时' }));
        });
        
    } else {
        // 处理静态文件请求
        let filePath = '';
        
        if (pathname === '/' || pathname === '/index.html') {
            filePath = path.join(process.cwd(), 'usr.html');
        } else {
            filePath = path.join(process.cwd(), pathname);
        }
        
        // 检查文件是否存在
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // 文件不存在，返回404或默认页面
                if (pathname === '/' || pathname === '/index.html') {
                    // 如果请求根路径但usr.html不存在，返回状态页面
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>USR加密工具服务器</title>
                            <style>
                                body { font-family: Arial, sans-serif; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                                .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
                                .status { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; }
                                .usage { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; margin-top: 20px; }
                                code { background: #e9ecef; padding: 2px 6px; border-radius: 4px; }
                                .api-test { margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="status">
                                    <h2>🟢 USR加密工具服务器运行中</h2>
                                    <p>端口: ${PORT}</p>
                                    <p>状态: 正常运行</p>
                                </div>
                                
                                <div class="usage">
                                    <h3>📋 可用接口:</h3>
                                    <p><strong>代理接口:</strong></p>
                                    <code>GET /proxy?usr=你的usr&p29=你的p29</code>
                                    <p style="margin-top: 10px;"><strong>前端页面:</strong></p>
                                    <p>请将 usr.html 文件放在服务器根目录，然后访问根路径即可使用完整功能。</p>
                                </div>
                                
                                <div class="api-test">
                                    <h3>🧪 API测试</h3>
                                    <p>你可以直接在浏览器中测试代理接口：</p>
                                    <p><a href="/proxy?usr=test&p29=zy4248ba" target="_blank">测试链接</a></p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found');
                }
                return;
            }
            
            // 读取并返回文件
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                
                const mimeType = getMimeType(filePath);
                res.writeHead(200, { 'Content-Type': mimeType });
                res.end(data);
            });
        });
    }
});

server.listen(PORT, () => {
    console.log(`🚀 USR加密工具服务器启动成功!`);
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`🔧 代理接口: http://localhost:${PORT}/proxy?usr=你的usr&p29=你的p29`);
    console.log(`🌐 前端页面: http://localhost:${PORT} (需要usr.html文件)`);
    console.log(`\n服务器同时提供静态文件服务和API代理功能。`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
}); 