# 代理配置说明

## 当前配置状态

项目目前使用 `vite.config.ts` 配置，采用**直接代理模式**。

## 代理模式说明

### 模式一：直接代理模式（当前使用）

**配置文件**: `vite.config.ts`
**代理目标**: `http://dejian-welfare-welfare-gateway.test.svc.zhangyue-inc.com`
**访问方式**: 前端直接通过Vite代理访问远程API

```typescript
server: {
  proxy: {
    '/proxy': {
      target: 'http://dejian-welfare-welfare-gateway.test.svc.zhangyue-inc.com',
      changeOrigin: true,
      rewrite: (path) => {
        const url = new URL(path, 'http://localhost')
        const usr = url.searchParams.get('usr')
        const p29 = url.searchParams.get('p29')
        return `/gateway/user/encrypt?usr=${usr}&p29=${p29}`
      }
    }
  }
}
```

**优点**:
- 配置简单，只需启动 `npm run dev`
- 不需要额外的Node.js服务器

**缺点**:
- 依赖网络环境，可能存在网络访问限制
- 如果远程服务不可用，工具无法使用

### 模式二：本地代理模式（备用方案）

**配置文件**: 需要修改 `vite.config.ts`
**代理目标**: `http://localhost:3001` (proxy-server.js)
**访问方式**: 前端 → Vite代理 → 本地Node.js服务器 → 远程API

如需切换到本地代理模式，请按以下步骤操作：

1. **修改 vite.config.ts**:
```typescript
server: {
  proxy: {
    '/proxy': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false
    }
  }
}
```

2. **启动本地代理服务器**:
```bash
# 终端1: 启动代理服务器
npm run server

# 终端2: 启动前端开发服务器
npm run dev
```

**优点**:
- 更好的错误处理和日志记录
- 可以自定义请求头和响应处理
- 网络问题时更容易调试

**缺点**:
- 需要同时运行两个服务
- 配置相对复杂

## 推荐使用方式

1. **首选**: 直接代理模式（当前配置）
2. **备用**: 如果遇到网络问题，切换到本地代理模式

## 故障排除

### 直接代理模式问题
- 检查网络连接
- 确认远程API服务状态
- 查看浏览器开发者工具的网络面板

### 本地代理模式问题
- 确认proxy-server.js正常启动
- 检查3001端口是否被占用
- 查看Node.js服务器日志

## 配置文件历史

- ✅ `vite.config.ts` - 当前使用的TypeScript配置文件
- ❌ `vite.config.js` - 已删除的JavaScript配置文件（避免冲突） 