#!/bin/bash

# WeekTime Picker 发布脚本

set -e

echo "🚀 开始发布 WeekTime Picker..."

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

echo "📤 发布 @weektime-picker/react..."
cd ../react
npm publish # (需要输入 OTP)

echo "📤 发布 @weektime-picker/vue..."
cd ../vue
npm publish # (需要输入 OTP)

cd ../..

echo "🎉 发布完成！"

# 创建并推送 Git 标签
echo "🔖 创建并推送 Git 标签..."
core_version=$(node -p "require('./packages/core/package.json').version")
git tag "v$core_version"
git push origin "v$core_version"

echo "🔗 NPM链接："
echo "  - https://www.npmjs.com/package/@weektime-picker/core"
echo "  - https://www.npmjs.com/package/@weektime-picker/react"
echo "  - https://www.npmjs.com/package/@weektime-picker/vue"

echo "📌 Git 标签: v$core_version"