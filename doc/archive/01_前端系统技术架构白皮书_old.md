# 前端系统技术架构白皮书

> **文档版本**: v1.0  
> **技术基座**: React 18 + Vite + Ant Design 5  
> **最后更新**: 2024-12-24

---

## 🏗️ 1. 总体架构设计 (Architecture Overview)

本系统采用 **分层解耦、配置驱动** 的现代前端架构，旨在实现高内聚、低耦合的企业级应用开发。

```mermaid
graph TD
    User[用户终端 (PC/Mobile)] --> Gateway[接入层 (Nginx)]
    Gateway --> App[应用层 (React App)]
    
    subgraph Frontend Architecture
        App --> Router[路由层 (React Router v6)]
        
        Router --> Pages[页面视图层]
        Pages --> Dashboard[工作台]
        Pages --> Process[流程中心]
        Pages --> Project[项目中心]
        Pages --> Admin[系统管理]
        
        Pages --> BusinessComps[业务组件层]
        BusinessComps --> TaskHandle[任务办理容器]
        BusinessComps --> FormilyRenderer[动态表单引擎]
        BusinessComps --> ProjectProfile[项目大屏]
        
        BusinessComps --> BasicUI[基础UI层]
        BasicUI --> AntD[Ant Design 5]
        BasicUI --> ProComps[ProComponents]
        BasicUI --> Tailwind[Tailwind CSS v4]
        
        Pages --> DataLayer[数据层]
        DataLayer --> Store[Zustand (Global State)]
        DataLayer --> Axios[API Client]
        DataLayer --> ReactQuery[React Query (可选, Server State)]
        
        BusinessComps --> SchemaEngine[Schema 引擎]
        SchemaEngine --> SchemaLoader[协议加载器]
        SchemaEngine --> MockService[本地仿真器]
    end
```

---

## 🛠️ 2. 核心技术栈 (Technology Stack)

基于稳定性与先进性的平衡（"Stable Core + Fast Tooling"），锁定以下版本：

### 2.1 核心框架 (The Core)
*   **Framework**: `React 18.3.1` 
    *   *决策*: 锁定 18 版本以确保 `Formily 2.x` 生态的稳定性。
*   **Language**: `TypeScript 5.x`
    *   *规范*: 使用 `Strict Mode`，启用 `Project References` 加速构建。
*   **Routing**: `React Router v6.28.0`
    *   *模式*: Data Router (`createBrowserRouter`)。

### 2.2 构建工具 (The Tooling)
*   **Bundler**: `Vite 7.x`
    *   *特性*: 秒级冷启动，极速 HMR。
*   **CSS Engine**: `Tailwind CSS v4.0`
    *   *决策*: 采用 Oxide 引擎，零配置 (`@import "tailwindcss"`)。
*   **Package Manager**: `npm` (推荐) 或 `pnpm`。

### 2.3 UI 组件系统 (The UI System)
本次重构采用混合组件策略：
*   **Base UI**: `Ant Design 5.x` (Design Token)
*   **Pro UI**: `@ant-design/pro-components` (Layout, Table)
*   **Icons**: `@ant-design/icons`

### 2.4 核心引擎 (The Engines)
*   **Form Engine**: `Formily 2.x` (`@formily/antd-v5`)
    *   *职责*: 承载所有业务流程表单的渲染、校验、联动逻辑。
*   **State Management**: `Zustand 5.x`
    *   *职责*: 管理用户会话、全局 UI 配置（Theme/Locale）。

---

## 🧩 3. 关键架构设计详解

### 3.1 动态表单渲染架构 (Form Data Driven)
系统核心是 `Process Center`，其 40+ 个业务表单全部由后端下发 JSON Schema 驱动渲染。

*   **Schema 来源**:
    1.  **Remote**: 生产环境从后端 API 获取。
    2.  **Local Mock**: 开发环境通过 `src/services/schema.ts` 拦截，读取本地 JSON。
*   **渲染流**:
    `JSON Schema` -> `Schema Parser` -> `Formily Core` -> `React Component (AntD)`

### 3.2 样式系统架构 (Style System)
采用 **"CSS-in-JS + Atomic CSS"** 双引擎模式，并通过 Token Bridge 链接。

*   **Ant Design (CSS-in-JS)**: 负责组件内部样式。
*   **Tailwind CSS (Atomic)**: 负责布局、间距、排版、自定义样式。
*   **Token Bridge**:
    在 `src/index.css` 或 `tailwind.config.js` 中，将 AntD 的 Design Token (如 `colorPrimary`) 映射为 Tailwind 的 Utility Class (如 `text-primary`)，保证视觉一致性。

### 3.3 安全架构 (Security)
*   **Watermark**: 全局水印容器 (`WatermarkWrapper`)，显示当前用户姓名+手机尾号。
*   **RBAC**: 基于角色的权限控制，通过 `PermConfig` 矩阵控制表单字段的 `Read/Write/Hidden` 状态。

---

## 📂 4. 目录结构规范 (Project Structure)

```text
src/
├── assets/                 # 静态资源
├── components/             # 通用业务组件
│   ├── FormilyRenderer/    # [核心] 动态表单引擎
│   ├── ProcessTimeline/    # 审批时间线
│   ├── WatermarkWrapper/   # 水印容器
│   └── StatusTag/          # 状态标签
├── layouts/                # 布局容器
│   ├── MainLayout/         # 核心布局 (基于 ProLayout)
│   └── AuthLayout/         # 登录页布局
├── pages/                  # 页面视图 (按业务域划分)
│   ├── Dashboard/          # 工作台
│   ├── Process/            # 流程中心 (TaskList, TaskHandle)
│   ├── Project/            # 项目中心 (ProjectList, ProjectDetail)
│   └── Admin/              # 系统管理
├── services/               # API 服务层
│   ├── schema.ts           # Protocol Loader (含 Mock 逻辑)
│   └── request.ts          # Axios 拦截器
├── stores/                 # Zustand 状态仓库
├── utils/                  # 工具函数
└── mocks/                  # 本地仿真数据 (JSON)
```

---

## 📈 5. 性能优化策略

*   **Code Splitting**: 路由级懒加载 (`React.lazy`).
*   **Tree Shaking**: 确保 `import { Button } from 'antd'` 能被正确优化。
*   **ProTable Performance**: 开启 `virtual` 虚拟滚动（针对大数据量台账）。
*   **Image Optimization**: 使用 WebP 格式。
