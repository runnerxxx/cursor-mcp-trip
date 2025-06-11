# USR加密工具 - 云端部署版本

## 📋 项目概述

这是一个完整的USR信息加密工具，包含前端页面和后端代理服务器，可以一键部署到云端平台，无需用户本地安装Node.js环境。

## 🗂️ 文件结构

```
├── usr.html              # 前端页面（云端版本）
├── proxy-server.js       # Node.js代理服务器
├── package.json          # 项目配置文件
├── table.md              # AppID数据表
└── DEPLOY-README.md      # 部署说明文档
```

## 🚀 部署方式

### 1. Vercel 部署（推荐）

1. 将项目文件上传到GitHub仓库
2. 访问 [vercel.com](https://vercel.com)
3. 连接GitHub仓库并导入项目
4. 在项目设置中配置：
   - **Framework Preset**: Other
   - **Build Command**: 留空
   - **Output Directory**: 留空
   - **Install Command**: `npm install`
   - **Development Command**: `npm start`

### 2. Railway 部署

1. 访问 [railway.app](https://railway.app)
2. 连接GitHub仓库
3. 选择项目进行部署
4. Railway会自动检测Node.js项目并部署

### 3. Render 部署

1. 访问 [render.com](https://render.com)
2. 创建新的Web Service
3. 连接GitHub仓库
4. 配置：
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 4. Heroku 部署

1. 安装Heroku CLI
2. 在项目目录运行：
```bash
heroku create your-app-name
git push heroku main
```

## 🔧 本地测试

```bash
# 安装依赖（如果需要）
npm install

# 启动服务器
npm start

# 访问应用
# 浏览器打开: http://localhost:3001
```

## 📝 功能特性

- ✅ **无需本地环境**：部署到云端后，用户直接访问网页即可使用
- ✅ **智能AppID选择**：支持模糊搜索和手动输入
- ✅ **33个产品支持**：覆盖所有得间系列产品
- ✅ **现代化UI**：响应式设计，支持移动端
- ✅ **实时加密**：通过代理服务器调用加密接口
- ✅ **错误处理**：完善的错误提示和状态反馈

## 🌐 使用说明

部署成功后，用户只需：

1. 访问部署的网址
2. 输入原始USR信息
3. 选择对应的AppID
4. 点击"获取加密USR信息"按钮
5. 获得加密结果

## 🔒 安全说明

- 代理服务器仅转发请求，不存储任何用户数据
- 所有通信都通过HTTPS加密（部署平台提供）
- 支持CORS跨域请求处理

## 📊 支持的产品列表

包含33个产品的沙盒AppID：
- 得间小说系列（安卓、iOS、极速版等）
- 追读系列
- 七读小说
- 得间畅听
- 各种短视频和短剧应用
- 鸿蒙系列应用

## 🛠️ 技术栈

- **前端**: 原生HTML/CSS/JavaScript
- **后端**: Node.js + HTTP模块
- **部署**: 支持Vercel、Railway、Render、Heroku等平台

## 📞 联系方式

如有问题，请联系：xulijing@zhangyue.com

---

**注意**: 此工具仅供内部测试使用，请勿用于生产环境。 