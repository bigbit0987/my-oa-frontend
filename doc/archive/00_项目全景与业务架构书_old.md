# 项目全景与业务架构书

> **文档版本**: v1.0  
> **最后更新**: 2024-12-24  
> **文档状态**: 正式  
> **来源依据**: [05_用户操作使用说明书.md](./05_用户操作使用说明书.md)

---

## 🏗️ 1. 业务全景图 (Business Panorama)

本项目是一个全生命周期的**工程项目管理系统**，覆盖了从项目立项、策划、设计、送审、直至归档的完整核心链路。

### 1.1 核心业务实体
*   **Project (项目)**: 业务流转的核心载体，包含基本信息、成员、工期、质量分等属性。
*   **Process (流程)**: 驱动业务流转的引擎，分为审批流（Approval）和自动触发流（Auto-Trigger）。
*   **Task (任务)**: 流程在节点上的具体实例，由具体人员（User）办理。
*   **Deliverable (成果)**: 项目各阶段产出的文件（附件），如策划书、方案图纸、审定成果。

### 1.2 核心用户角色
| 角色 | 职责描述 | 
|---|---|
| **生产经营室** | 项目登记、工期管理、合同管理、变更发起 |
| **技术办** | 技术标准审核、审定人指定、质量评定 |
| **规划所/所领导** | 项目组组建、所内审核、质量把控 |
| **项目负责人** | 项目全过程执行、流程发起、成果上传、修改 |
| **项目组成员** | 协助设计、现场踏勘、校对 |
| **信息中心** | 范围线检查、成果入库、归档检查 |
| **院领导** | 重大项目签发、综合得分审批 |

---

## 🔄 2. 业务流程九大阶段 (Key Phases)

### Phase 1: 项目登记 (Registration)
*   **核心目标**: 完成项目立项，确定项目分类（所A/B，院A/B）、人员与周期。
*   **流程清单**:
    1.  `project_registration` (项目信息登记表) - **核心入口**

### Phase 2: 事前准备 (Preparation)
*   **核心目标**: 明确设计输入，完成现场勘测。
*   **自动触发机制**: 项目登记完成后，根据项目类型（I/II/III类）自动触发。
*   **流程清单**:
    2.  `product_planning` (产品实现策划)
    3.  `site_survey` (项目现场踏勘记录)
    4.  `design_input_review` (设计输入评审记录)

### Phase 3: 方案审查 (Scheme Review)
*   **核心目标**: 方案内部审核与院级审查。
*   **管控点**: 必须通过所审才能申请院审；必须通过院审才能进入送审阶段。
*   **流程清单**:
    5.  `scheme_institute_review` (方案所审记录表)
    6.  `academy_review_apply` (方案院审会申请单) - *手动发起*
    7.  `academy_review_record` (方案院审会记录表) - *自动触发*
    8.  `academy_review_deliverable` (送审成果院审会审查记录)

### Phase 4: 送审成果 (Submission Deliverable)
*   **核心目标**: 成果文件的所内三校、技术审核与审定。
*   **流程清单**:
    9.  `submission_proofread_planning` (送审成果规划专业校对)
    10. `submission_proofread_engineering` (送审成果工程专业校对)
    11. `submission_dept_review` (送审成果所级审核)
    12. `submission_tech_review` (送审成果技术助理意见)
    13. `submission_cross_review` (送审成果交叉审核)
    14. `submission_final_approval` (送审成果审定记录)

### Phase 5: 正式成果 (Official Deliverable)
*   **核心目标**: 最终成果的审核与发布。流程逻辑与送审阶段高度相似。
*   **流程清单**:
    15. `official_proofread_planning` (正式成果规划专业校对)
    16. `official_proofread_engineering` (正式成果工程专业校对)
    17. `official_dept_review` (正式成果所级审核)
    18. `official_tech_review` (正式成果技术助理意见)
    19. `official_cross_review` (正式成果交叉审核)
    20. `official_final_approval` (正式成果审定记录)

### Phase 6: 归档评分 (Archiving & Scoring)
*   **核心目标**: 成果归档、移交以及项目质量与工期打分。
*   **流程清单**:
    21. `archive_schedule` (归档工期计划表)
    22. `archive_apply` (项目归档申请表)
    23. `customer_property_archive` (顾客财产归档表)
    24. `task_completion_confirm` (任务完成认定表) - *含自动评分*
    25. `assignment_book_confirm` (任务书接收确认表)
    26. `archive_transfer_list` (项目归档移交记录清单)
    27. `quality_evaluation_apply` (创新创优项目质量评定申报)
    28. `data_enhancement_apply` (项目数据增强评定申报)

### Phase 7: 项目变更 (Change Management)
*   **核心目标**: 全周期的变更控制，需联动更新项目台账信息。
*   **流程清单** (均为手动发起):
    29. `change_project_name` (项目名称变更)
    30. `change_project_code` (项目编号变更)
    31. `change_project_member` (项目人员变更)
    32. `change_auditor` (审核人员变更)
    33. `change_project_period` (项目工期变更)
    34. `change_actual_period` (项目实际工期变更)
    35. `change_process_level` (项目流程管控强度变更)
    36. `project_termination` (项目终止/取消申请)
    37. `project_recovery` (项目恢复运行申请)
    38. `project_emergency_release` (项目紧急放行申请)

### Phase 8: 其它辅助 (Others)
*   **流程清单**:
    39. `deliverable_handover` (成果交接确认单)
    40. `check_handover` (核定交接确认单)
    41. `customer_communication` (顾客沟通记录表)
    42. `bulletin_drawing` (公告图流程)
    43. `drawing_notice` (项目出图通知单)

---

## 📊 3. 关键业务规则与逻辑

### 3.1 自动触发机制 (Auto-Trigger)
*   多数流程（如Phase 2-6）由上一个流程结束自动触发，无需人工发起。
*   前端需展示**流程链条**，让用户知道当前流程的前置和后置关系。

### 3.2 跳过与裁剪 (Skip Logic)
*   根据项目类型（V类 vs I类），某些阶段（如所审、交叉审核）可以被**跳过**。
*   前端表单需根据后端返回的 `ProcessContext` 动态显示或隐藏“跳过”选项。

### 3.3 数据回写与同步 (Data Sync)
*   变更流程（如名称变更）审批通过后，需实时更新**项目台账**。
*   已触发但未完成的流程（如院审中），若发生项目信息变更，需同步更新表单内的项目信息快照。

### 3.4 评分逻辑 (Scoring)
*   工期分、质量分根据过程数据自动加权计算。
*   前端需提供可视化的评分面板。

---

## 📱 4. 前端应用架构映射

为支撑上述业务，前端应用划分为以下核心域：

1.  **Workbench (工作台)**: 聚合待办、已办、通知，作为所有流程任务的统一入口。
2.  **Process Center (流程中心)**:
    *   **Task Handle UI**: 通用任务办理页，通过 Formily Schema 动态渲染上述 40+ 种表单。
    *   **Process View**: 展示流程全景图、审批时间线。
3.  **Project Hub (项目中心)**:
    *   **Ledger**: 项目台账列表。
    *   **Profile**: 项目详情大屏，聚合该项目下产生的所有流程记录、成果文件、资金状态。
4.  **Admin (管理配置)**:
    *   用户/角色管理。
    *   流程表单权限矩阵配置。
