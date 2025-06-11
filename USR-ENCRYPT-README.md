# USR信息加密工具使用说明

## 🎯 功能介绍
这是一个用于将原始USR信息转换为加密USR信息的Web工具。

## 🚀 快速开始

### 方案一：本地代理服务器（推荐）

1. **启动代理服务器**
   ```bash
   # 方法1: 直接运行
   node proxy-server.js
   
   # 方法2: 使用启动脚本
   # Windows用户
   start-proxy.bat
   
   # Mac/Linux用户
   ./start-proxy.sh
   ```

2. **使用工具**
   - 在浏览器中打开 `usr.html`
   - 输入原始USR信息
   - 选择对应的AppID
   - 点击"获取加密USR信息"按钮

### 方案二：Chrome禁用CORS

1. **关闭所有Chrome窗口**

2. **使用特殊参数启动Chrome**
   ```bash
   # Windows
   chrome.exe --disable-web-security --user-data-dir="C:/temp/chrome_dev_session"
   
   # Mac
   open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_session" --disable-web-security
   
   # Linux
   google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev_session"
   ```

3. **在新启动的Chrome中打开 `usr.html`**

### 方案三：浏览器插件

安装CORS插件（如"CORS Unblock"），临时禁用跨域限制。

## 📋 AppID列表

工具包含以下产品的AppID：

- 得间小说安卓 (zy4248ba)
- 得间小说 iOS (zy4248ba)
- 得间小说安卓极速版 (zy8f2e24)
- 得间小说 iOS 极速版 (zy8f2e24)
- 追读 iOS (zybc0e74)
- 七读小说 (zy819b7a)
- 得间畅听 (zy9b17a7)
- 琅阅小说 (zy21c192)
- 得间大字版 (zy78e04c)
- 阅瓣小说 (zy7595fe)
- 贤读小说 (zyf36a0f)
- 追读小说 (zyd0d2ca)
- 袋鼠点点小说 (zybd351b)
- 盛读小说 (zy0903f1)
- 速读小说 (zyb03dd4)
- 浩看小说 (zy613a68)
- 秘读小说 (zy4cb605)
- 浩阅小说 (zy8eef2a)
- 袋鼠点点短视频 (zyf4648c)
- 枫以短视频 (zy3d1ef1)
- 薏米短剧 (zy9351ae)
- 速看短剧 (zya8dad8)
- 伊看短剧 (zy6ee66f)
- 卡看 (zya3c0e0)
- 北京主体伊看 (zy8b0c8f)
- 得间努比亚小说 (zye4a38c)
- 得间鸿蒙 (zy4248ba)
- 鸿蒙-七读小说 (zy819b7a)
- 鸿蒙-浩看小说 (zy613a68)
- 鸿蒙-得间极速版 (zy8f2e24)
- 鸿蒙-阅瓣小说 (zy7595fe)
- 鸿蒙-追读小说 (zyd0d2ca)
- 新速看短剧（北京伊看） (zy8b0c8f)

## 🔧 技术说明

### 代理服务器
- 端口：3001
- 接口：`http://localhost:3001/proxy?usr=你的usr&p29=你的p29`
- 功能：解决浏览器跨域限制问题

### 目标API
- 地址：`http://dejian-welfare-welfare-gateway.test.svc.zhangyue-inc.com/gateway/user/encrypt`
- 参数：`usr`（原始USR）、`p29`（AppID）
- 方法：GET

## ❓ 常见问题

### Q: 提示"所有请求方式都失败了"怎么办？
A: 按以下顺序尝试：
1. 启动本地代理服务器
2. 使用Chrome禁用CORS方案
3. 安装浏览器CORS插件
4. 联系后端开发人员添加CORS头

### Q: 没有Node.js环境怎么办？
A: 
1. 下载安装Node.js：https://nodejs.org/
2. 或者使用Chrome禁用CORS方案
3. 或者安装浏览器CORS插件

### Q: 代理服务器启动失败？
A: 检查：
1. 是否安装了Node.js
2. 端口3001是否被占用
3. 是否在正确的目录下运行

## 📞 技术支持

如果遇到问题，请检查：
1. 网络连接是否正常
2. 目标API服务是否可用
3. 浏览器控制台是否有错误信息

---

**注意：** 本工具仅用于开发测试环境，生产环境请联系后端开发人员配置正确的CORS策略。 