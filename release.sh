#!/bin/bash

# WeekTime Picker 发布脚本 (使用 Changesets)

set -e

echo "🚀 开始发布 @weektime-picker 系列包..."

# 检查是否登录npm
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 请先登录npm: npm login"
    exit 1
fi

# 检查是否有待处理的 changesets
if [ ! "$(find .changeset -name '*.md' -not -name 'README.md' 2>/dev/null)" ]; then
    echo "❌ 没有找到待处理的 changesets"
    echo "💡 请先运行: pnpm changeset"
    echo "   然后添加你的变更记录"
    exit 1
fi

# 显示当前版本号
echo "📌 当前版本号:"
echo "  - @weektime-picker/core: $(node -p "require('./packages/core/package.json').version")"
echo "  - @weektime-picker/react: $(node -p "require('./packages/react/package.json').version")"
echo "  - @weektime-picker/vue: $(node -p "require('./packages/vue/package.json').version")"

# 使用 changesets 更新版本号和生成 changelog
echo ""
echo "📝 更新版本号和生成 changelog..."
pnpm changeset version

# 显示新版本号
echo ""
echo "📌 新版本号:"
NEW_CORE_VERSION=$(node -p "require('./packages/core/package.json').version")
NEW_REACT_VERSION=$(node -p "require('./packages/react/package.json').version")
NEW_VUE_VERSION=$(node -p "require('./packages/vue/package.json').version")
echo "  - @weektime-picker/core: $NEW_CORE_VERSION"
echo "  - @weektime-picker/react: $NEW_REACT_VERSION"
echo "  - @weektime-picker/vue: $NEW_VUE_VERSION"

# 清理和构建
echo ""
echo "🧹 清理构建产物..."
pnpm clean

echo "🔨 构建所有包..."
pnpm build

# 运行测试
echo ""
echo "🧪 运行测试..."
pnpm test

# 检查构建产物
echo ""
echo "📋 检查构建产物..."

# 检查必要文件是否存在
for package in core react vue; do
    if [ ! -d "packages/$package/dist" ]; then
        echo "❌ packages/$package/dist 目录不存在"
        exit 1
    fi
    
    if [ ! -f "packages/$package/dist/index.d.ts" ]; then
        echo "❌ packages/$package/dist/index.d.ts 不存在"
        exit 1
    fi
done

echo "✅ 所有检查通过！"

# 确认发布
echo ""
read -p "🤔 确认发布以上版本到 npm? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 发布已取消"
    exit 1
fi

# 使用 changesets 发布
echo ""
echo "📤 发布到 npm..."
pnpm changeset publish

echo ""
echo "🎉 发布完成！"
echo ""
echo "📋 已发布的包："
echo "  - @weektime-picker/core@$NEW_CORE_VERSION"
echo "  - @weektime-picker/react@$NEW_REACT_VERSION"
echo "  - @weektime-picker/vue@$NEW_VUE_VERSION"
echo ""
echo "🔗 NPM 链接："
echo "  - https://www.npmjs.com/package/@weektime-picker/core"
echo "  - https://www.npmjs.com/package/@weektime-picker/react"
echo "  - https://www.npmjs.com/package/@weektime-picker/vue"
echo ""
echo "💡 下次发布流程："
echo "  1. 开发完成后运行: pnpm changeset"
echo "  2. 添加变更记录并提交代码"
echo "  3. 运行: pnpm release"