# USR信息加密工具 - Vue3 + Vite 版本

## 项目简介

这是一个基于Vue3 + Vite开发的USR信息加密工具，支持将原始USR信息通过API接口转换为加密的USR信息。

## 技术栈

- **前端**: Vue 3 + Composition API
- **构建工具**: Vite 5.x
- **路由**: Vue Router 4
- **后端代理**: Node.js Express
- **样式**: 原生CSS + 现代化UI设计

## 项目结构

```
my-vue-app/
├── src/
│   ├── components/          # Vue组件
│   ├── views/
│   │   └── UsrEncrypt.vue  # USR加密页面
│   ├── App.vue             # 根组件
│   └── main.js             # 应用入口
├── public/                 # 静态资源
├── proxy-server.js         # Node.js代理服务器
├── vite.config.js          # Vite配置
├── package.json            # 项目配置
└── table.md               # AppID数据表
```

## 功能特性

### 🎯 核心功能
- **USR信息加密**: 输入原始USR信息，选择对应AppID进行加密
- **智能选择器**: 支持33个产品的AppID选择，带模糊搜索功能
- **实时验证**: 表单验证和错误提示
- **响应式设计**: 适配各种屏幕尺寸

### 🚀 技术特性
- **Vue3 Composition API**: 现代化的Vue开发方式
- **Vite热更新**: 快速开发体验
- **路由管理**: 单页面应用，路由地址为 `/usr-encrypt`
- **代理服务**: 解决跨域问题
- **TypeScript支持**: 可选的类型检查

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

需要同时启动两个服务：

**启动Vite开发服务器 (端口5173):**
```bash
npm run dev
```

**启动代理服务器 (端口3001):**
```bash
npm run server
```

### 3. 访问应用

打开浏览器访问: http://localhost:5173

页面会自动重定向到: http://localhost:5173/usr-encrypt

## 可用脚本

```bash
# 开发模式 - 启动Vite开发服务器
npm run dev

# 启动代理服务器
npm run server

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 运行测试
npm test
```

## 路由配置

- **根路径** `/` - 自动重定向到 `/usr-encrypt`
- **加密页面** `/usr-encrypt` - USR信息加密工具主页面

## API接口

### 加密接口
- **URL**: `/proxy?usr={原始USR}&p29={AppID}`
- **方法**: GET
- **代理目标**: `http://dejian-welfare-welfare-gateway.test.svc.zhangyue-inc.com/gateway/user/encrypt`

### 支持的AppID

项目支持33个产品的AppID，包括：
- 得间小说系列 (安卓/iOS/极速版/大字版等)
- 追读系列 (iOS/小说)
- 短视频系列 (袋鼠点点/枫以/薏米短剧等)
- 鸿蒙系列应用

完整列表请查看 `table.md` 文件。

## 开发指南

### 添加新的AppID

1. 编辑 `src/views/UsrEncrypt.vue`
2. 在 `appIdOptions` 数组中添加新的选项：

```javascript
{"label": "新产品名称 (AppID)", "value": "沙盒AppID"}
```

### 修改样式

全局样式定义在 `index.html` 中，组件特定样式可以在对应的 `.vue` 文件中添加。

### 添加新页面

1. 在 `src/views/` 中创建新的Vue组件
2. 在 `src/main.js` 中添加路由配置
3. 更新导航菜单（如需要）

## 部署说明

### 开发环境部署

1. 确保Node.js版本 >= 16.0.0
2. 安装依赖: `npm install`
3. 同时启动两个服务: `npm run dev` 和 `npm run server`

### 生产环境部署

1. 构建项目: `npm run build`
2. 部署 `dist/` 目录到静态文件服务器
3. 部署 `proxy-server.js` 到Node.js服务器
4. 配置反向代理将 `/proxy` 请求转发到Node.js服务器

### 云平台部署

支持部署到以下平台：
- **Vercel**: 前端自动部署，需要单独部署代理服务
- **Netlify**: 前端部署，配置Functions处理代理
- **Railway**: 全栈部署，同时部署前端和后端
- **Heroku**: 全栈部署

## 故障排除

### 常见问题

1. **端口冲突**: 修改 `vite.config.js` 中的端口配置
2. **代理失败**: 检查代理服务器是否在3001端口运行
3. **跨域错误**: 确保Vite代理配置正确

### 调试技巧

1. 打开浏览器开发者工具查看网络请求
2. 检查控制台错误信息
3. 使用Vue DevTools调试组件状态

## 更新日志

### v1.0.0 (2024-01-XX)
- ✨ 初始版本发布
- 🎯 支持33个产品的USR加密
- 🚀 Vue3 + Vite技术栈
- 📱 响应式设计
- 🔧 完整的开发环境配置

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发者。 