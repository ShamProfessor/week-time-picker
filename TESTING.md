# WeekTime Picker 测试指南

## 测试 Vue 和 React 组件

项目提供了两种方式来测试 Vue 和 React 版本的组件：

### 方式一：使用启动脚本（推荐）

项目根目录提供了一个便捷的启动脚本，可以自动构建核心包并启动示例应用：

```bash
# 在项目根目录执行
./start-examples.sh
```

然后按照提示选择要启动的示例（Vue 或 React）。

### 方式二：手动启动

如果你想手动启动示例，请按照以下步骤操作：

1. 首先确保 core 包已构建：

```bash
cd packages/core
pnpm build
cd ../..
```

2. 启动 Vue 示例：

```bash
cd packages/vue
VITE_EXAMPLE=true pnpm dev
```

3. 或启动 React 示例：

```bash
cd packages/react
VITE_EXAMPLE=true pnpm dev
```

## 注意事项

- 示例应用会在 http://localhost:5173 启动
- 确保先构建 core 包，否则会出现依赖解析错误
- 如果修改了 core 包的代码，需要重新构建后再启动示例