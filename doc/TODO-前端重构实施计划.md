# OA前端系统重构实施计划 (Roadmap 2025 Q1)

> **关联文档**: 
> - [ADR-006 前端技术架构与设计规范](./ADR-006-前端技术架构与设计规范.md)
> - [07_前端系统架构与开发实施指南](./07_前端系统架构与开发实施指南.md)

## 📋 总体实施策略

采用 **"保守核心 + 激进外壳"** 的混合技术架构，结合 **"四阶段迭代"** 的开发模式，确保项目在追求现代化开发体验的同时，保障企业级交付的稳定性。

### 🛠️ 核心技术栈锁定
- **Core (稳)**: `React 18.3.1`, `React Router v6.28.0`, `Ant Design 5.x`, `Formily 2.x`
- **Tooling (快)**: `Vite 7.x`, `Tailwind CSS v4.0`, `TypeScript 5.x`

---

## 📅 阶段实施明细

### 🟢 Phase 1: 基础设施与安全底座 (Week 1-2)
**目标**: 建立纯净、规范、安全的项目基座，为多人协作打好基础。

| 任务ID | 任务名称 | 详细说明 | 验收标准 | 状态 |
|:---:|---|---|---|:---:|
| 1.1 | **初始化项目环境** | - 使用 `npm create vite` 初始化项目<br>- 安装 `React 18` 全家桶 (降级处理)<br>- 配置 `vite.config.ts` 别名 (@/) | - `package.json` 依赖版本正确<br>- `npm run dev` 启动 < 500ms | ✅ |
| 1.2 | **样式系统搭建** | - 集成 `Tailwind CSS v4` (PostCSS)<br>- 建立 `src/index.css`<br>- **[关键]** 实现 AntD Token -> Tailwind 变量桥接 (如 `--color-primary`) | - HTML中写 `text-primary` 能正确显示科技蓝 | ✅ |
| 1.3 | **安全水印容器** | - 开发 `WatermarkWrapper` 组件<br>- 集成 AntD 5 原生 Watermark<br>- 动态注入"姓名+手机尾号" | - 页面全屏覆盖水印<br>- 水印不遮挡点击事件 | ✅ |
| 1.4 | **主布局开发** | - 开发 `MainLayout` (基于 ProLayout)<br>- 配置左侧侧边栏与顶部导航<br>- 建立 `src/routes.tsx` 路由表 | - 响应式布局正常<br>- 菜单点击跳转正确 | ✅ |
| 1.5 | **状态管理基座** | - 初始化 `Zustand` Store<br>- `useUserStore`: 存储 Token/UserInfo<br>- `useConfigStore`: 存储 Theme/Locale | - Redux DevTools 可观测到状态变化 | ✅ |

> 📅 **Phase 1 完成日期**: 2024-12-24

### 🔵 Phase 2: 工作台与数据仿真 (Week 3-4)
**目标**: 打造高颜值的 "Morning Hub" (每日第一站)，并打通前后端并行开发流程。

| 任务ID | 任务名称 | 详细说明 | 验收标准 | 状态 |
|:---:|---|---|---|:---:|
| 2.1 | **Schema Mock机制** | - 建立 `src/services/schema.ts`<br>- 实现"本地/远程"双模式加载策略<br>- 编写 Mock JSON 文件 | - 断网环境下依然能加载测试表单 | ✅ |
| 2.2 | **Bento Grid 布局** | - 封装 `BentoCard` 组件<br>- 实现 Grid 响应式布局 (1x1, 2x1, 2x2) | - 拖拽窗口时卡片自动重排 | ✅ |
| 2.3 | **核心 Widget 开发** | - `KPICard`: 待办数/项目数 (带微动画)<br>- `UrgentList`: Top 5 紧急待办 (红灯预警)<br>- `QuickAccess`: 高频入口图标组 | - 卡片加载带 Skeleton 骨架屏 | ✅ |
| 2.4 | **数据接口联调** | - 封装 Axios 拦截器 (Auth/Error Handling)<br>- 对接真实 Dashboard API | - 401 自动跳转登录<br>- 500 弹出 ErrorBoundary | ✅ |

> 📅 **Phase 2 完成日期**: 2024-12-24

### 🟠 Phase 3: 流程中心 (Week 5-7)
**目标**: 攻克系统心脏——复杂的动态表单与审批流转。

| 任务ID | 任务名称 | 详细说明 | 验收标准 | 状态 |
|:---:|---|---|---|:---:|
| 3.1 | **表单渲染引擎** | - 封装 `FormilyRenderer` 组件<br>- 注册 AntD 组件库映射<br>- 实现 `x-pattern: readPretty` 只读模式 | - 后端修改 JSON 字段，前端无需发版即生效 | ✅ |
| 3.2 | **三段式办理页** | - 开发 `TaskHandle` 页面骨架<br>- 左: 表单 (80%) / 右: Timeline (20%)<br>- 底: Sticky Action Bar (吸底操作栏) | - 滚动时操作栏始终可见 | ✅ |
| 3.3 | **流程组件库** | - `ProcessTimeline`: 审批记录可视化<br>- `ProcessDiagram`: BPMN 流程图预览 | - 能够清晰展示"谁在什么时间做了什么" | ✅ |
| 3.4 | **审批交互逻辑** | - 实现同意/驳回/转办/加签<br>- 集成"常用审批意见"模板 | - 操作成功有 Message 反馈<br>- 危险操作有二次确认 | ✅ |

> 📅 **Phase 3 完成日期**: 2024-12-24

### 🟣 Phase 4: 项目中心与可视化 (Week 8-10)
**目标**: 实现全维度的项目档案管理与数据大屏。

| 任务ID | 任务名称 | 详细说明 | 验收标准 | 状态 |
|:---:|---|---|---|:---:|
| 4.1 | **项目台账** | - 基于 `ProTable` 实现超级列表<br>- 支持高级筛选、列显隐、导出 | - 1000条数据渲染无卡顿 | 🔴 |
| 4.2 | **项目详情大屏** | - 开发 `ProjectProfile` 容器<br>- 实现 Sticky Header (项目摘要吸顶)<br>- 顶部 Visual Timeline 阶段进度条 | - 切换 Tab 时无明显闪烁 | 🔴 |
| 4.3 | **多维业务视图** | - `Finance`: 资金/合同看板<br>- `Team`: 人力负荷视图<br>- `Files`: 附件聚合柜 (按阶段自动归档) | - 附件支持在线预览 (Phase 4+) | 🔴 |

---

## ⚠️ 风险与对策 (Risk Management)

| 风险点 | 影响 | 对策 |
|---|---|---|
| **Formily 学习成本** | 团队成员上手慢，开发效率低 | - 前期由架构师封装通用组件(`FormilyRenderer`)<br>- 提供标准 JSON 模板 |
| **Tailwind 样式冲突** | 与 AntD 默认样式打架 (Preflight) | - 使用 `Tailwind v4` + PostCSS 插件方案<br>- 严格的 `layer` 分层管理 |
| **React 18 vs 19** | 第三方库不兼容新版 API | - **决策**: 锁定 React 18.3.1，待生态成熟后再升级 |

---

## ✅ 准备工作清单 (Immediate Actions)

- [x] 修剪 `package.json`，锁定 React 18 版本
- [x] 初始化 Git 仓库与 `.gitignore`
- [x] 配置 VSCode `settings.json` (Tailwind IntelliSense)

---

## 📈 开发进度记录

### 2024-12-24 开发日志

**Phase 1 & 2 主要成果：**

| 模块 | 已创建文件 | 功能描述 |
|---|---|---|
| **Services** | `schema.ts`, `request.ts` | Schema 双模式加载、Axios 拦截器封装 |
| **Stores** | `userStore.ts`, `configStore.ts` | 用户状态、应用配置全局状态管理 |
| **Layouts** | `MainLayout/index.tsx`, `_menu.tsx` | ProLayout 主布局、菜单配置 |
| **Components** | `WatermarkWrapper/` | 安全水印容器 |
| **Dashboard** | `index.tsx`, `Dashboard.css` | 工作台主页面 |
| **Widgets** | `BentoCard`, `KPICard`, `UrgentList`, `QuickAccess` | Bento Grid 卡片组件库 |
| **Mocks** | `dashboard.json` | 工作台 Mock 数据 |

**Phase 3 主要成果：**

| 模块 | 已创建文件 | 功能描述 |
|---|---|---|
| **FormilyRenderer** | `components/FormilyRenderer.tsx` | 表单渲染引擎，支持 JSON Schema 动态渲染 |
| **ProcessTimeline** | `components/ProcessTimeline.tsx` | 审批记录时间线组件 |
| **ProcessDiagram** | `components/ProcessDiagram.tsx` | BPMN 流程图简化预览 |
| **ApprovalActions** | `components/ApprovalActions.tsx` | 审批操作组件(同意/驳回/转办/加签) |
| **TaskHandle** | `TaskHandle/index.tsx` | 三段式任务办理页面 |
| **TaskList** | `TaskList/index.tsx` | 待办任务列表页面 |
| **Mocks** | `taskHandle.json` | 任务办理 Mock 数据 |

**下一步：Phase 4 项目中心开发**
