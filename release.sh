#!/bin/bash

# WeekTime Picker 多包发布脚本

set -e

echo "🚀 开始发布 @weektime-picker 系列包..."

# 检查是否登录npm
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 请先登录npm: npm login"
    exit 1
fi

# 获取当前版本号
echo "📌 当前版本号:"
CORE_VERSION=$(node -p "require('./packages/core/package.json').version")
REACT_VERSION=$(node -p "require('./packages/react/package.json').version")
VUE_VERSION=$(node -p "require('./packages/vue/package.json').version")
echo "  - @weektime-picker/core: $CORE_VERSION"
echo "  - @weektime-picker/react: $REACT_VERSION"
echo "  - @weektime-picker/vue: $VUE_VERSION"

# 更新版本号
echo "📌 更新版本号..."
cd packages/core
npm version patch --no-git-tag-version
cd ../..
cd packages/react
npm version patch --no-git-tag-version
cd ../..
cd packages/vue
npm version patch --no-git-tag-version
cd ../..

# 获取新版本号
echo "📌 新版本号:"
NEW_CORE_VERSION=$(node -p "require('./packages/core/package.json').version")
NEW_REACT_VERSION=$(node -p "require('./packages/react/package.json').version")
NEW_VUE_VERSION=$(node -p "require('./packages/vue/package.json').version")
echo "  - @weektime-picker/core: $NEW_CORE_VERSION"
echo "  - @weektime-picker/react: $NEW_REACT_VERSION"
echo "  - @weektime-picker/vue: $NEW_VUE_VERSION"

# 清理构建产物
echo "🧹 清理构建产物..."
pnpm --filter @weektime-picker/core clean
pnpm --filter @weektime-picker/react clean
pnpm --filter @weektime-picker/vue clean

# 构建core包
echo "🔨 构建 @weektime-picker/core..."
pnpm --filter @weektime-picker/core build

# 构建react包
echo "📦 构建 @weektime-picker/react..."
pnpm --filter @weektime-picker/react build

# 构建vue包
echo "📦 构建 @weektime-picker/vue..."
pnpm --filter @weektime-picker/vue build

# 运行测试
echo "🧪 运行测试..."
pnpm --filter @weektime-picker/core test
pnpm --filter @weektime-picker/react test
pnpm --filter @weektime-picker/vue test

# 检查构建产物
echo "📋 检查构建产物..."

# 检查core包 (使用rollup构建)
if [ ! -d "packages/core/dist" ]; then
    echo "❌ packages/core/dist 目录不存在"
    exit 1
fi

if [ ! -f "packages/core/dist/index.js" ]; then
    echo "❌ packages/core/dist/index.js 不存在"
    exit 1
fi

if [ ! -f "packages/core/dist/index.d.ts" ]; then
    echo "❌ packages/core/dist/index.d.ts 不存在"
    exit 1
fi

# 检查react和vue包 (使用vite构建)
for package in react vue; do
    if [ ! -d "packages/$package/dist" ]; then
        echo "❌ packages/$package/dist 目录不存在"
        exit 1
    fi
    
    if [ ! -f "packages/$package/dist/index.es.js" ]; then
        echo "❌ packages/$package/dist/index.es.js 不存在"
        exit 1
    fi
    
    if [ ! -f "packages/$package/dist/index.umd.js" ]; then
        echo "❌ packages/$package/dist/index.umd.js 不存在"
        exit 1
    fi
done

echo "✅ 所有检查通过，准备发布..."

# 发布core包
echo "📤 发布 @weektime-picker/core..."
cd packages/core
npm publish
cd ../..

# 发布react包
echo "📤 发布 @weektime-picker/react..."
cd packages/react
npm publish
cd ../..

# 发布vue包
echo "📤 发布 @weektime-picker/vue..."
cd packages/vue
npm publish
cd ../..

echo "🎉 发布完成！"
echo ""
echo "📋 发布的包："
echo "  - @weektime-picker/core@$NEW_CORE_VERSION"
echo "  - @weektime-picker/react@$NEW_REACT_VERSION"
echo "  - @weektime-picker/vue@$NEW_VUE_VERSION"
echo ""
echo "🔗 NPM链接："
echo "  - https://www.npmjs.com/package/@weektime-picker/core"
echo "  - https://www.npmjs.com/package/@weektime-picker/react"
echo "  - https://www.npmjs.com/package/@weektime-picker/vue"
echo ""
echo "📖 使用方法："
echo "  # React项目"
echo "  npm install @weektime-picker/react"
echo "  import { WeekTimeGrid } from '@weektime-picker/react'"
echo ""
echo "  # Vue项目"
echo "  npm install @weektime-picker/vue"
echo "  import { WeekTimeGrid } from '@weektime-picker/vue'"
echo ""
echo "  # 仅使用核心逻辑"
echo "  npm install @weektime-picker/core"
echo "  import { WeekTimeGridCore } from '@weektime-picker/core'"