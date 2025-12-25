🧩 3. 关键架构设计详解

### 3.1 动态表单渲染架构 (Form Data Driven)

系统核心是 `Process Center`，其 40+ 个业务表单全部由后端下发 JSON Schema 驱动渲染。

- **Schema 来源**:
  1.  **Remote**: 生产环境从后端 API 获取。
  2.  **Local Mock**: 开发环境通过 `src/services/schema.ts` 拦截，读取本地 JSON。
- **渲染流**:
  `JSON Schema` -> `Schema Parser` -> `Formily Core` -> `React Component (AntD)`

### 3.2 样式系统架构 (Style System)

采用 **"CSS-in-JS + Atomic CSS"** 双引擎模式，并通过 Token Bridge 链接。

- **Ant Design (CSS-in-JS)**: 负责组件内部样式。
- **Tailwind CSS (Atomic)**: 负责布局、间距、排版、自定义样式。
- **Token Bridge**:
  在 `src/index.css` 或 `tailwind.config.js` 中，将 AntD 的 Design Token (如 `colorPrimary`) 映射为 Tailwind 的 Utility Class (如 `text-primary`)，保证视觉一致性。

### 3.3 安全架构 (Security)

- **Watermark**: 全局水印容器 (`WatermarkWrapper`)，显示当前用户姓名+手机尾号。
- **RBAC**: 基于角色的权限控制，通过 `PermConfig` 矩阵控制表单字段的 `Read/Write/Hidden` 状态。

---

---

## 📈 5. 性能优化策略

- **Code Splitting**: 路由级懒加载 (`React.lazy`).
- **Tree Shaking**: 确保 `import { Button } from 'antd'` 能被正确优化。
- **ProTable Performance**: 开启 `virtual` 虚拟滚动（针对大数据量台账）。
- **Image Optimization**: 使用 WebP 格式。

关键技术协议 (Protocol Specs)

### 6.1 动态表单加载协议

前端 `services/schema.ts` 需实现以下标准加载流：

1.  **Request**: `GET /api/v1/tasks/{taskId}/form`
2.  **Response**:
    ```json
    {
      "schema": { ... },       // Formily JSON Schema (已包含 x-pattern: readPretty 等后端计算结果)
      "formData": { ... },     // 业务数据
      "permissions": {         // (可选) 额外的按钮级权限
         "canReject": true,
         "canDelegate": false
      }
    }
    ```
3.  **Frontend Action**:
    - 根据 `permissions` 字段动态显示/隐藏底部的“驳回”、“委派”按钮。

### 6.2 开发稳定性与仿真机制

1.  **Schema 仿真**: 开发模式启动时，配置 Vite 插件或在 `services/schema.ts` 中拦截请求。当 `process.env.NODE_ENV === 'development'` 且 URL 匹配 `/api/v1/schemas/*` 时，优先读取本地静态 JSON 文件。
2.  **样式桥接实施**: 在 `src/main.tsx` 或顶层 Context 中，通过 AntD 的 `useToken()` 获取值并注入到 HTML 根节点的 CSS 变量中：
    ```typescript
    const { token } = theme.useToken();
    document.documentElement.style.setProperty(
      "--color-primary",
      token.colorPrimary
    );
    ```
3.  **渲染降级策略**: 为 `FormilyRenderer` 组件编写 HOC (高阶组件) `withErrorBoundary`。当捕捉到渲染异常时，展示一个带有“Schema 调试信息”的占位卡片，而非破坏主框架。

样式开发规范 (Style Guide)
3.1 核心原则
优先使用 Tailwind Utility Utility: 布局（Flex/Grid）、间距（m/p）、尺寸（w/h）。
复杂逻辑使用 CSS Module (可选): 极少数极其复杂的样式才写 CSS 文件。
禁止使用行内样式 (style={{}}): 动态样式除外。
3.2 Token Bridge (AntD -> Tailwind)
为保证 Ant Design 的 colorPrimary 与 Tailwind 的 text-primary 一致，请遵循以下配置：

定义 CSS 变量: 在 src/index.css 的 @theme 中定义：

@import "tailwindcss";

@theme {
--color-primary: #1890ff; /_ 对应 AntD 的 Daybreak Blue _/
--color-success: #52c41a;
--color-warning: #faad14;
--color-error: #ff4d4f;
}
AntD ConfigProvider: 在 App.tsx 中使用相同的值：

<ConfigProvider
theme={{
    token: {
      colorPrimary: '#1890ff',
    },
  }}

> ...
> </ConfigProvider>
> 🧬 4. 动态表单开发流程 (Formily Workflow)
> 开发一个新的业务表单（如“项目名称变更”）的步骤：

定义 Schema:
并在 src/mocks/schemas/ 下创建 change_project_name.json。
定义字段、校验规则、布局结构。
注册 Mock:
在 src/services/schema.ts 中注册该 Schema ID，使其能被本地加载。
调试渲染:
访问 /process/task/mock/change_project_name (需预设路由支持) 查看渲染效果。
联调后端:
待后端 API 完成后，关闭 Mock 开关，验证真实数据。
🧹 5. 代码质量 (Code Quality)
TypeScript: 不允许使用 any，必须定义 Interface。
React Hooks: 遵循 exhaustive-deps 规则，不遗漏依赖项。
Console: 生产环境构建时必须移除 console.log。

# OA 项目管理系统 - 前端 API 对接手册

## 1. 基础配置

- **Base URL**: `http://localhost:8080/api/v1`
- **认证方式**: JWT Bearer Token
- **请求头**: `Authorization: Bearer <token>`
- **统一响应格式**:

```json
{
  "success": true,
  "data": { ... },
  "error": { "code": "...", "message": "..." },
  "timestamp": "..."
}
```

## 2. 核心业务 API 调用指南

### 2.1 认证 (AuthService)

| 接口       | 方法 | 路径          | 备注                     |
| :--------- | :--- | :------------ | :----------------------- |
| 登录       | POST | `/auth/login` | 返回 token 和用户信息    |
| 获取当前人 | GET  | `/auth/me`    | 用于初始化全局 UserStore |

### 2.2 任务办理 (TaskService) - **最重要**

| 接口         | 方法 | 路径                                              | 备注                                      |
| :----------- | :--- | :------------------------------------------------ | :---------------------------------------- |
| 获取待办列表 | GET  | `/tasks`                                          | 参数：`page`, `size`, `assignee`          |
| 获取任务表单 | GET  | `/form-permissions/runtime/tasks/{taskId}/schema` | **必用**：返回带权限控制的 Formily Schema |
| 提交任务     | POST | `/tasks/{taskId}/complete`                        | Body 提交 Formily 表单数据                |
| 暂存草稿     | POST | `/tasks/{taskId}/draft`                           | 保存当前表单状态但不流转                  |

### 2.3 项目管理 (ProjectService)

| 接口         | 方法 | 路径                            | 备注                         |
| :----------- | :--- | :------------------------------ | :--------------------------- |
| 项目分页列表 | GET  | `/projects`                     | 支持复杂筛选                 |
| 获取项目详情 | GET  | `/projects/{id}`                | 用于 ProjectProfile 页面展示 |
| 任务书列表   | GET  | `/taskbook/preview/{projectId}` | 用于详情页的成果清单展示     |

### 2.4 数据源 (FormService)

- **动态下拉数据**: `GET /forms/data/{dataType}?dictKey=...`
- **级联查询**: 用于 Formily 的 `x-reactions` 联动，前端需封装统一组件。

## 3. 开发注意事项

1. **Token 存储**: 存储在 `localStorage`，并通过 `Zustand` 的 `userStore` 进行状态同步。
2. **错误处理**: `axios` 拦截器需统一处理 401（重定向登录）和业务错误（antd message 提示）。
3. **Schema 缓存**: 运行时 Schema 建议不要在前端做强缓存，确保后端修改权限后实时生效。

---

_实时接口定义请参考: [Swagger UI](http://localhost:8080/swagger-ui.html)_
