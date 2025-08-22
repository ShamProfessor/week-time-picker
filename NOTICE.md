# 项目结构

    1 weektime-picker/
    2 ├── packages/
    3 │   ├── core/           # 核心逻辑包
    4 │   ├── react/          # React组件包
    5 │   └── vue/            # Vue组件包
    6 ├── docs/               # 文档
    7 ├── node_modules/       # 依赖包
    8 ├── package.json        # 根package.json
    9 ├── pnpm-workspace.yaml # pnpm工作区配置

10 └── start-examples.sh # 示例启动脚本

## 每个包的结构：

1 packages/{core|react|vue}/
2 ├── src/ # 源代码
3 ├── dist/ # 构建输出
4 ├── examples/ # 示例代码
5 ├── package.json # 包配置
6 ├── tsconfig.json # TypeScript 配置
7 └── vite.config.ts # Vite 配置（React/Vue）

## 为何使用 UMD

UMD (Universal Module Definition) 是一种通用的模块定义格式，可以在多种环境中使用：

### 优势：

1.  兼容性好：支持 AMD、CommonJS 和全局变量三种方式加载
2.  灵活使用：
    - 在 Node.js 环境中通过 require()引入
    - 在现代浏览器中通过 ES6 import 引入
    - 在传统浏览器中通过<script>标签直接引入
3.  广泛支持：大多数构建工具和包管理器都支持 UMD 格式

### 使用场景：

- CDN 分发
- 传统项目集成
- 脚本直接引入
- 与其他模块系统互操作

### UMD 配置说明

1. Rollup 配置（core 包）
   在 packages/core/rollup.config.js 中：

   1 export default {
   2 input: 'src/index.ts',
   3 output: [
   4 {
   5 file: 'dist/index.js',
   6 format: 'umd',
   7 name: 'WeekTimeGridCore',
   8 globals: {
   9 // 外部依赖映射
   10 }
   11 },
   12 {
   13 file: 'dist/index.esm.js',
   14 format: 'es'
   15 }
   16 ],
   17 plugins: [
   18 // 插件配置
   19 ]
   20 };

### 2. package.json 配置

1 {
2 "main": "dist/index.js", // CommonJS 入口
3 "module": "dist/index.esm.js", // ES Module 入口
4 "browser": "dist/index.umd.js" // UMD 入口（浏览器）
5 }

# 工具和依赖说明

## 核心工具

1.  pnpm - 快速、节省磁盘空间的包管理器
2.  TypeScript - 静态类型检查
3.  Rollup - 模块打包工具（core 包）
4.  Vite - 构建工具（React/Vue 包）
5.  Vitest - 测试框架

## React 包依赖

- @vitejs/plugin-react - React 支持
- @types/react - React 类型定义
- react, react-dom - React 核心库

## Vue 包依赖

- @vitejs/plugin-vue - Vue 支持
- vue - Vue 核心库
- vue-tsc - Vue TypeScript 检查

## 开发依赖

- rimraf - 文件删除工具
- typescript - TypeScript 编译器

# Rollup 配置过程

## 1. 安装依赖

1 pnpm add -D rollup @rollup/plugin-typescript tslib

2. 创建配置文件
   packages/core/rollup.config.js：

   1 import typescript from '@rollup/plugin-typescript';
   2
   3 export default {
   4 input: 'src/index.ts',
   5 output: [
   6 {
   7 file: 'dist/index.js',
   8 format: 'umd',
   9 name: 'WeekTimeGridCore'

10 },
11 {
12 file: 'dist/index.esm.js',
13 format: 'es'
14 }
15 ],
16 plugins: [
17 typescript({
18 tsconfig: './tsconfig.json'
19 })
20 ]
21 };

3. 配置 TypeScript 插件
   确保 tsconfig.json 正确配置：

   1 {
   2 "compilerOptions": {
   3 "target": "es2018",
   4 "module": "esnext",
   5 "moduleResolution": "node",
   6 "declaration": true,
   7 "outDir": "dist",
   8 "rootDir": "src"
   9 },

10 "include": ["src/**/*"]
11 }

4. 配置 package.json 脚本

1 {
2 "scripts": {
3 "build": "rollup -c",
4 "dev": "rollup -c -w"
5 }
6 }

# 发布版本教程

1. 准备工作

1 # 1. 确保所有测试通过
2 pnpm test
3
4 # 2. 构建所有包
5 pnpm build
6
7 # 3. 检查 git 状态
8 git status

2. 更新版本号

1 # 方法 1：使用 npm version 命令（推荐）
2 pnpm --filter @weektime-picker/core version patch # 补丁版本
3 pnpm --filter @weektime-picker/react version minor # 次要版本
4 pnpm --filter @weektime-picker/vue version major # 主要版本
5
6 # 方法 2：手动修改 package.json 中的 version 字段

3. 更新变更日志
   编辑 CHANGELOG.md 文件，添加新版本的变更记录：

1 ## [1.0.1] - 2025-08-22
2 ### 修复
3 - 修复了时间间隔为 15 分钟/30 分钟时 header 与 body 对齐问题
4
5 ### 优化
6 - 优化了组件样式，移除了多余的样式代码

4. 提交更改

1 git add .
2 git commit -m "chore: release v1.0.1"
3 git push origin main

5. 发布到 npm

1 # 登录 npm（如果未登录）
2 npm login
3
4 # 发布每个包
5 pnpm --filter @weektime-picker/core publish --access public
6 pnpm --filter @weektime-picker/react publish --access public
7 pnpm --filter @weektime-picker/vue publish --access public

6. 创建 Git 标签

1 # 为每个包创建标签
2 git tag core-v1.0.1
3 git tag react-v1.0.1
4 git tag vue-v1.0.1
5
6 # 推送标签
7 git push origin --tags

7. 发布 GitHub Release（可选）
1. 访问 GitHub 仓库的 Releases 页面
1. 点击"Draft a new release"
1. 选择刚创建的标签
1. 填写版本信息和变更日志
1. 发布 Release

自动化发布（推荐）
可以使用工具如 release-it 来自动化发布流程：

1.  安装依赖：

1 pnpm add -D release-it @release-it/conventional-changelog

2.  配置.release-it.json：

    1 {
    2 "git": {
    3 "commitMessage": "chore: release v${version}"
    4 },
    5 "github": {
    6 "release": true
    7 },
    8 "npm": {
    9 "publish": true

10 }
11 }

3.  添加脚本到根 package.json：

1 {
2 "scripts": {
3 "release": "release-it"
4 }
5 }

4.  运行发布命令：

1 pnpm release

这样就可以自动完成版本更新、提交、标签创建、npm 发布和 GitHub Release 的整个流程。
