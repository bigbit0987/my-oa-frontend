# 重构实施路线图 (Roadmap)

> **文档版本**: v1.0  
> **最后更新**: 2024-12-24  
> **状态**: Phase 1~4 已完成基础建设，Phase 5 进入深水区。

---

## 📅 总体进度概览

| 阶段 | 核心目标 | 预估周期 | 状态 |
|---|---|---|:---:|
| **Phase 1** | **基础设施 (Infrastructure)**<br>Vite环境、Layout、Auth、Zustand | Week 1-2 | ✅ 完成 |
| **Phase 2** | **核心引擎 (Core Engine)**<br>Formily渲染器、任务办理页、流程时间轴 | Week 3-4 | ✅ 完成 |
| **Phase 3** | **门户与项目 (Hub & Project)**<br>工作台、项目台账、项目大屏 | Week 5-6 | ✅ 完成 |
| **Phase 4** | **流程业务落地 (Process Migration)**<br>40+ 流程表单实现、流程发起与流转 | **Week 7-10** | 🔄 **进行中** |
| **Phase 5** | **系统管理与增强 (Admin & Polish)**<br>权限配置、报表统计、移动端适配 | Week 11-12 | 🗓️ 待开始 |

---

## 🚧 详细任务清单

### Phase 4: 流程业务落地 (The Big Core) - [当前重点]

本阶段目标是实现 `doc/05` 中定义的 40+ 个核心业务流程。这是系统最繁重的工作。

#### 4.1 流程发起机制 (Process Initiation)
- [ ] **流程发起中心**: 创建 `/process/start` 页面，按分类展示可发起的流程入口。
- [ ] **流程撤回**: 实现发起人撤销（未办结流程）的功能。
- [ ] **草稿箱**: 实现表单内容的暂存/恢复。

#### 4.2 核心流程 Schema 开发 (JSON Schemas)
需为以下流程创建 JSON Schema 并调试通过：

*   **项目登记**: `ProjectRegistration`
*   **事前准备**: `ProductPlanning`, `SiteSurvey`, `DesignInputReview`
*   **方案审查**: `SchemeReview`, `AcademyReviewApply`, `AcademyReviewRecord`
*   **送审成果**: `SubmissionReview` (含4个角色视图)
*   **正式成果**: `OfficialReview` (含4个角色视图)
*   **归档评分**: `ArchiveSchedule`, `ArchiveApply`, `TaskCompletion`...
*   **项目变更**: `ChangeProjectName`, `ChangeProjectMember`... (共10个)

#### 4.3 流程流转增强 (Flow Logic)
- [ ] **跳过逻辑**: 适配 V 类项目的跳过规则（如跳过交叉审核）。
- [ ] **多角色视图**: 同一个 UserTask，不同角色（校对/审核/审定）看到不同的表单字段（Readonly/Editable）。
- [ ] **自动触发**: 前端展示“自动触发”的视觉提示（如流程图上的连线）。

---

### Phase 5: 系统管理与增强 (Admin & Polish)

#### 5.1 系统管理 (Admin)
- [ ] **部门管理**: 组织架构树的增删改查。
- [ ] **角色/岗位**: 定义业务角色（生产经营室、技术办...）。
- [ ] **数据字典**: 统一管理项目类型、状态枚举。
- [ ] **操作日志**: 记录关键操作。

#### 5.2 报表与统计 (BI)
- [ ] **项目进度报表**: 按部门/状态统计。
- [ ] **质量评分报表**: 柱状图/折线图展示。

#### 5.3 体验增强 (UX Polish)
- [ ] **全局搜索**: Cmd+K 唤起，搜索项目/流程。
- [ ] **通知中心**: 站内信/待办提醒。
- [ ] **移动端适配**: FormLayout 降级为单列。

---

## 📈 交付标准 (Definition of Done)

1.  **功能完备**: 40+ 个流程均能跑通“发起 -> 审批 -> 归档”全链路。
2.  **数据准确**: 项目台账能实时反映流程产生的数据变更。
3.  **权限严密**: 用户只能看到权限范围内的项目和按钮。
4.  **体验流畅**: 页面加载 < 1s，操作无明显卡顿。
