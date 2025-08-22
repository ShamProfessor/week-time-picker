#!/bin/bash

# WeekTime Picker 统一发布脚本

set -e

echo "🚀 开始发布 WeekTime Picker (统一版本)..."

# 检查是否登录npm
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 请先登录npm: npm login"
    exit 1
fi

# 检查是否在主分支
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    echo "⚠️  您当前不在主分支 ($current_branch). 是否继续? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "❌ 发布已取消。"
        exit 1
    fi
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo "❌ 检测到未提交的更改。请先提交或暂存所有更改。"
    exit 1
fi

# 获取新版本号
echo "📦 请输入新版本号 (例如: 1.0.0):"
read -r new_version

# 手动更新所有包的版本号
echo "✏️  更新版本号到 $new_version..."
for package in core react vue; do
  # 使用 node 命令更新 package.json 中的版本号
  node -e "
    const fs = require('fs');
    const path = 'packages/$package/package.json';
    const pkg = JSON.parse(fs.readFileSync(path, 'utf-8'));
    pkg.version = '$new_version';
    // 更新对 core 包的依赖版本号 (如果存在)
    if (pkg.dependencies && pkg.dependencies['@weektime-picker/core']) {
      pkg.dependencies['@weektime-picker/core'] = '$new_version';
    }
    fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
  "
  echo "  ✅ packages/$package/package.json 已更新到 $new_version"
done

# 更新根目录 package.json 的版本号
node -e "
  const fs = require('fs');
  const path = 'package.json';
  const pkg = JSON.parse(fs.readFileSync(path, 'utf-8'));
  pkg.version = '$new_version';
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
"
echo "  ✅ package.json 已更新到 $new_version"

# 重新安装依赖以确保 lock 文件是最新的
echo "🔁 重新安装依赖..."
pnpm install

# 清理构建产物
echo "🧹 清理构建产物..."
pnpm run clean

# 构建所有包
echo "🔨 构建所有包..."
pnpm run build:all

# 运行测试
echo "🧪 运行测试..."
pnpm run test

# 检查构建产物
echo "📦 检查构建产物..."
for package in core react vue; do
    if [ ! -d "packages/$package/dist" ]; then
        echo "❌ packages/$package/dist 目录不存在"
        exit 1
    fi
    if [ -z "$(ls -A "packages/$package/dist")" ]; then
        echo "❌ packages/$package/dist 目录为空"
        exit 1
    fi
    echo "✅ packages/$package/dist 存在且非空"
done

echo "✅ 所有检查通过，准备发布..."

# 发布包（按依赖顺序）
echo "📤 发布 @weektime-picker/core..."
cd packages/core
npm publish # (需要输入 OTP)
cd ../..

echo "📤 发布 @weektime-picker/react..."
cd packages/react
npm publish # (需要输入 OTP)
cd ../..

echo "📤 发布 @weektime-picker/vue..."
cd packages/vue
npm publish # (需要输入 OTP)
cd ../..

echo "🎉 发布完成！"

# 创建并推送 Git 标签
echo "🔖 创建并推送 Git 标签..."
git tag "v$new_version"
git push origin "v$new_version"

echo "🔗 NPM链接："
echo "  - https://www.npmjs.com/package/@weektime-picker/core"
echo "  - https://www.npmjs.com/package/@weektime-picker/react"
echo "  - https://www.npmjs.com/package/@weektime-picker/vue"

echo "📌 Git 标签: v$new_version"