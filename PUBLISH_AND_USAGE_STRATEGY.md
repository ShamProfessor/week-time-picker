# 发布和使用策略说明

## 包结构说明

当前项目采用 monorepo 结构，包含以下三个独立的 npm 包：

1.  **`@weektime-picker/core`**:
    *   **内容**: 包含核心的业务逻辑、状态管理、工具函数和基础的 UI 渲染逻辑（无框架特定代码）。
    *   **用途**: 为 React 和 Vue 包提供核心功能，也可供需要深度定制或在其他框架中使用的开发者直接使用。

2.  **`@weektime-picker/react`**:
    *   **内容**: 基于 `@weektime-picker/core` 构建的 React 组件封装。
    *   **用途**: 为 React 应用提供开箱即用的组件。

3.  **`@weektime-picker/vue`**:
    *   **内容**: 基于 `@weektime-picker/core` 构建的 Vue 3 组件封装。
    *   **用途**: 为 Vue 3 应用提供开箱即用的组件。

## 发布策略

您需要在 npm 上创建并发布这三个独立的包。

*   **创建**: 当您第一次对一个包执行 `npm publish` 时，如果该包名称（带 scope `@weektime-picker/`）在 npm 上不存在，它会自动为您创建。
*   **发布顺序**:
    1.  首先发布 `@weektime-picker/core`，因为它被其他两个包所依赖。
    2.  然后可以并行发布 `@weektime-picker/react` 和 `@weektime-picker/vue`。

## 用户使用策略

为了让用户只安装一个包就能使用 React 或 Vue 组件，您不需要创建第四个“主”包。用户根据他们使用的框架选择安装对应的包即可。

### 方式一：按需安装（推荐）

这是最清晰、最符合当前项目结构的方式。

*   **React 用户**:
    ```bash
    npm install @weektime-picker/react
    ```
    *   这会自动将 `@weektime-picker/core` 作为依赖安装，用户无需关心。

*   **Vue 用户**:
    ```bash
    npm install @weektime-picker/vue
    ```
    *   这会自动将 `@weektime-picker/core` 作为依赖安装，用户无需关心。

*   **需要核心逻辑的用户** (例如，想在 Angular 中自己封装):
    ```bash
    npm install @weektime-picker/core
    ```

### 方式二：创建一个“主”包 (不推荐，除非有特殊需求)

如果您坚持创建一个“主”包，让用户只安装一个包，理论上可以这样做，但这会增加复杂性和包体积：

1.  **创建新包**: 创建一个名为 `weektime-picker` (或 `@weektime-picker/weektime-picker`) 的新包。
2.  **添加依赖**: 将 `@weektime-picker/react` 和 `@weektime-picker/vue` 都添加为 `dependencies` (不是 `peerDependencies`)。
3.  **导出**: 在这个主包的入口文件中，从 `./react` 和 `./vue` 路径分别导出 React 和 Vue 的组件。或者，不导出，仅仅作为一个安装入口。
4.  **用户安装**:
    ```bash
    npm install weektime-picker
    ```
5.  **用户引入**:
    ```javascript
    // React 用户
    import WeekTimeGrid from 'weektime-picker/react';

    // Vue 用户
    import WeekTimeGrid from 'weektime-picker/vue';
    ```
    或者
    ```javascript
    // 主包内部处理了动态导入或全局注册，但这会更复杂
    import { ReactWeekTimeGrid, VueWeekTimeGrid } from 'weektime-picker';
    ```

**缺点**:
*   **包体积大**: 用户无论使用哪个框架，都会下载另一个框架的代码和依赖。
*   **不够清晰**: 增加了一层间接性，不如直接安装所需框架的包清晰。

## 结论

**强烈推荐使用“方式一：按需安装”**。

*   **为用户**: 清晰、高效，只安装所需代码。
*   **为您**: 简化发布和维护流程，每个包职责单一。
*   **社区标准**: 这是现代前端库（如 MUI, Ant Design 等）普遍采用的模式。

因此，您只需发布 `@weektime-picker/core`、`@weektime-picker/react` 和 `@weektime-picker/vue` 这三个包即可。