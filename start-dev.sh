#!/bin/bash

echo "🚀 启动USR信息加密工具开发环境..."
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js，请先安装Node.js"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否可用
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未检测到npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"
echo ""

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "🎉 依赖安装完成！"
echo ""

# 启动开发服务器
echo "🌟 启动开发服务器..."
echo "📍 访问地址: http://localhost:5173"
echo "🔧 开发工具: Vue3 + TypeScript + Vite"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev 