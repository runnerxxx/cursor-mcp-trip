# Vercel 部署说明

## 问题分析

你的项目部署到 Vercel 后接口访问失败的原因：

1. **代理配置失效**：Vite 的开发服务器代理配置只在开发环境有效
2. **接口路径问题**：生产环境中 `/proxy` 路径不存在
3. **跨域问题**：直接访问内网接口会遇到跨域限制

## 解决方案

已为你创建了以下文件来解决问题：

### 1. API 路由文件 (`api/proxy.js`)
- 创建了 Vercel 的 serverless 函数来处理代理请求
- 支持 CORS 跨域访问
- 包含错误处理和超时控制

### 2. Vercel 配置文件 (`vercel.json`)
- 配置路由重写：`/proxy` → `/api/proxy`
- 设置 CORS 头部
- 配置函数超时时间

## 部署步骤

1. **提交代码到 Git 仓库**
   ```bash
   git add .
   git commit -m "✨ Features | 新功能: 添加 Vercel API 路由支持"
   git push
   ```

2. **重新部署到 Vercel**
   - 在 Vercel 控制台触发重新部署
   - 或者推送代码后自动部署

3. **测试接口**
   访问：`https://你的域名/proxy?usr=test&p29=zy4248ba`

## 注意事项

### 网络访问限制
你的目标接口是内网地址：
```
http://dejian-welfare-welfare-gateway.test.svc.zhangyue-inc.com
```

这可能存在以下问题：
- **内网访问**：Vercel 的服务器可能无法访问你的内网服务
- **域名解析**：`.test.svc.zhangyue-inc.com` 可能只在内网环境可解析

### 建议的解决方案

1. **使用公网接口**：
   - 将内网接口暴露到公网
   - 或使用公网可访问的接口地址

2. **修改目标地址**：
   如果有公网地址，修改 `api/proxy.js` 中的 `targetUrl`：
   ```javascript
   const targetUrl = `https://你的公网域名/gateway/user/encrypt?usr=${encodeURIComponent(usr)}&p29=${encodeURIComponent(p29)}`;
   ```

3. **本地开发环境**：
   本地开发时仍然可以使用 Vite 代理配置

## 测试方法

1. **直接测试 API**：
   ```
   https://你的vercel域名/api/proxy?usr=test&p29=zy4248ba
   ```

2. **通过前端页面测试**：
   ```
   https://你的vercel域名/usr-encrypt
   ```

## 错误排查

如果仍然失败，请检查：

1. **Vercel 函数日志**：在 Vercel 控制台查看函数执行日志
2. **网络连通性**：确认 Vercel 服务器能否访问目标接口
3. **接口响应**：确认目标接口返回的数据格式

## 当前状态

- ✅ 已创建 API 路由文件
- ✅ 已配置 Vercel 路由重写
- ✅ 已设置 CORS 支持
- ⚠️ 需要确认目标接口的网络可达性 