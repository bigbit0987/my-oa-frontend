# 工程化与开发规范指南

> **文档版本**: v1.0  
> **最后更新**: 2024-12-24

---

## 🛠️ 1. 开发环境配置 (Development Environment)

### 1.1 Node.js 版本
*   推荐使用 `Node.js >= 18.0.0`
*   推荐使用 `pnpm` 或 `npm` (本项目锁定 `npm` 生成 `package-lock.json`)

### 1.2 编辑器配置 (VS Code)
推荐安装以下插件以获得最佳开发体验：
*   **ESLint**: 代码质量检查
*   **Prettier**: 代码格式化
*   **Tailwind CSS IntelliSense**: 样式智能提示
*   **Simple React Snippets**: React 代码片段

**Workspace Settings (`.vscode/settings.json`)**:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 🏗️ 2. Git 工作流规范 (Git Workflow)

采用简化版的 **Gitflow**：

*   **main**: 主分支，始终保持可部署状态。
*   **develop**: 开发分支，由此检出 feature 分支。
*   **feature/***: 功能分支，命名如 `feature/dashboard-ui`。
*   **fix/***: 修复分支，命名如 `fix/login-bug`。

**提交信息规范 (Conventional Commits)**:
```text
<type>(<scope>): <subject>

feat(project): 增加项目详情页
fix(auth): 修复 Token 过期跳转问题
docs(readme): 更新开发文档
style(ui): 调整按钮圆角
refactor(store): 重构 UserStore
```

---

## 🎨 3. 样式开发规范 (Style Guide)

### 3.1 核心原则
*   **优先使用 Tailwind Utility Utility**: 布局（Flex/Grid）、间距（m/p）、尺寸（w/h）。
*   **复杂逻辑使用 CSS Module (可选)**: 极少数极其复杂的样式才写 CSS 文件。
*   **禁止使用行内样式 (`style={{}}`)**: 动态样式除外。

### 3.2 Token Bridge (AntD -> Tailwind)

为保证 Ant Design 的 `colorPrimary` 与 Tailwind 的 `text-primary` 一致，请遵循以下配置：

1.  **定义 CSS 变量**:
    在 `src/index.css` 的 `@theme` 中定义：
    ```css
    @import "tailwindcss";

    @theme {
      --color-primary: #1890ff; /* 对应 AntD 的 Daybreak Blue */
      --color-success: #52c41a;
      --color-warning: #faad14;
      --color-error: #ff4d4f;
    }
    ```

2.  **AntD ConfigProvider**:
    在 `App.tsx` 中使用相同的值：
    ```tsx
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      ...
    </ConfigProvider>
    ```

---

## 🧬 4. 动态表单开发流程 (Formily Workflow)

开发一个新的业务表单（如“项目名称变更”）的步骤：

1.  **定义 Schema**:
    *   并在 `src/mocks/schemas/` 下创建 `change_project_name.json`。
    *   定义字段、校验规则、布局结构。
2.  **注册 Mock**:
    *   在 `src/services/schema.ts` 中注册该 Schema ID，使其能被本地加载。
3.  **调试渲染**:
    *   访问 `/process/task/mock/change_project_name` (需预设路由支持) 查看渲染效果。
4.  **联调后端**:
    *   待后端 API 完成后，关闭 Mock 开关，验证真实数据。

---

## 🧹 5. 代码质量 (Code Quality)

*   **TypeScript**: 不允许使用 `any`，必须定义 Interface。
*   **React Hooks**: 遵循 `exhaustive-deps` 规则，不遗漏依赖项。
*   **Console**: 生产环境构建时必须移除 `console.log`。
