/**
 * API 接口类型定义
 * 基于后端 Java DTO 自动生成
 * 对应后端项目: oa_system (E:\IdeaWorkspace\oa_system)
 */

// ==================== 通用响应结构 ====================

/**
 * 标准通用响应
 * 对应: com.bigbit.common.dto.StandardResponse
 */
export interface StandardResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
    path?: string;
  };
  timestamp: string; // ISO Date String
}

/**
 * 分页响应
 * 对应: com.bigbit.common.dto.PageResponse
 */
export interface PageResponse<T = any> {
  content: T[];
  total: number;
  page: number; // 当前页码 (0-based)
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
  numberOfElements: number;
  isEmpty: boolean;
}

// ==================== 认证模块 (Auth) ====================

/**
 * 登录请求
 * 对应: com.bigbit.module.auth.dto.LoginRequest
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应
 * 对应: com.bigbit.module.auth.dto.LoginResponse
 */
export interface LoginResponse {
  token: string;
  userInfo: UserDto;
  authorities?: any[];
}

// ==================== 系统模块 (System) ====================

/**
 * 用户信息
 * 对应: com.bigbit.module.system.user.dto.UserDto
 */
export interface UserDto {
  userId: string | number; // Long -> string/number (建议字符串)
  deptId?: string | number;
  loginName: string;
  userName: string;
  userType: string;
  email?: string;
  phonenumber?: string;
  sex?: "0" | "1" | "2"; // 0男 1女 2未知
  avatar?: string;
  status?: "0" | "1"; // 0正常 1停用
  delFlag?: "0" | "2";
  loginIp?: string;
  loginDate?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;

  // 扩展字段
  employeeNo?: string;
  jobLevel?: string;
  officePhone?: string;
  workLocation?: string;
  entryDate?: string;
  reportTo?: string;
  birthDate?: string;

  // 关联对象
  dept?: DeptDto;
  department?: string;
  departmentId?: string | number;
  roles?: RoleDto[];
  roleKeys?: string[];
  roleIds?: (string | number)[];
  role?: string;
  postId?: string | number;
  postName?: string;
}

/**
 * 部门信息
 * 对应: com.bigbit.module.system.dept.dto.DeptDto
 */
export interface DeptDto {
  deptId: string | number;
  parentId?: string | number;
  ancestors?: string;
  deptName: string;
  deptCode?: string;
  deptType?: string;
  orderNum?: number;
  deptDirector?: string | number;
  deptAdmin?: string; // 逗号分隔
  phone?: string;
  email?: string;
  status?: string;
  createTime?: string;
  children?: DeptDto[];
}

/**
 * 角色信息
 * 对应: com.bigbit.module.system.role.dto.RoleDto
 */
export interface RoleDto {
  roleId: string | number;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope?: string;
  menuCheckStrictly?: boolean;
  deptCheckStrictly?: boolean;
  status?: string;
  remark?: string;
  roleType?: string;
  roleCategory?: string;
  isDefault?: string;
  menuIds?: (string | number)[];
  deptIds?: (string | number)[];
  permissions?: PermissionDto[];
}

/**
 * 权限/菜单信息
 * 对应: com.bigbit.module.system.permission.dto.PermissionDto
 */
export interface PermissionDto {
  permissionId: string | number;
  permissionName: string;
  permissionKey: string;
  permissionType?: string; // SYSTEM, BUSINESS, PERSONAL
  moduleCode?: string;
  moduleName?: string;
  parentId?: string | number;
  permissionPath?: string;
  httpMethod?: string;
  sortOrder?: number;
  status?: string;
  remark?: string;
  children?: PermissionDto[];
}

// ==================== 工作流模块 (Workflow) ====================

/**
 * 任务信息
 * 对应: com.bigbit.module.workflow.task.dto.TaskDto
 */
export interface TaskDto {
  id: string;
  name: string;
  processInstanceId: string;
  processDefinitionId: string;
  assignee?: string;
  createTime?: string;
  dueDate?: string;
  priority?: number;
  description?: string;
  suspended?: boolean;
}

/**
 * 流程实例
 * 对应: com.bigbit.module.workflow.process.dto.ProcessInstanceDto
 */
export interface ProcessInstanceDto {
  id: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  businessKey?: string;
  startTime?: string;
  startUserId?: string;
  suspended?: boolean;
  ended?: boolean;
  variables?: Record<string, any>;
}

/**
 * 流程定义
 * 对应: com.bigbit.module.workflow.process.dto.ProcessDefinitionDto
 */
export interface ProcessDefinitionDto {
  id: string;
  key: string;
  name: string;
  version?: number;
  deploymentId?: string;
  category?: string;
  description?: string;
}

// ==================== 业务模块 (Project) ====================

/**
 * 项目登记表单 DTO
 * 对应: com.bigbit.module.project.dto.ProjectRegistrationDTO
 */
export interface ProjectRegistrationDTO {
  // 基本信息
  projectName?: string;
  projectNumber?: string;
  register?: string | number; // ID
  registerName?: string;
  registrationTime?: string;
  projectLevelKey?: string;
  controlLevelKey?: string;
  importanceKey?: string;
  importanceKey2?: string[];

  clients?: {
    clientName?: string;
    contactName?: string;
    contactPhone?: string;
  }[];

  // 人员安排
  responsibleDeptId?: string | number;
  responsibleDeptName?: string;
  projectManagerId?: string | number;
  projectManagerName?: string;
  leadDesignerId?: string | number;
  leadDesignerName?: string;
  teamMemberIds?: (string | number)[];
  teamMemberNames?: string[];
  coopDeptIds?: (string | number)[];
  coopDeptNames?: string[];
  projectSupervisorId?: string | number;
  projectSupervisorName?: string;
  projectAuditorId?: string | number;
  projectAuditorName?: string;
  issuerId?: string | number;
  issuerName?: string;
  issueTime?: string;
  internalMemo?: string;

  // 附属属性
  projectTypeKey?: string;
  projectTypeDetailKey?: string;
  regionalStructureKey?: string;
  regionalStructureDetailKey?: string;
  functionalZoneKey?: string;
  projectSourceKey?: string;
  workTypeKey?: string;
  greenChannelKey?: string;
  parkProjectKey?: string;
  newCityProjectKey?: string;
  hasContract?: string; // "yes"/"no"
  estimatedAmount?: number;
  projectTagFlag?: string;
  governmentProjectTypeKey?: string;
  highTechProjectTypeKey?: string;
  qualificationKeys?: string[];

  // 附件相关
  hasScopeFileKey?: string;
  scopeFile?: Record<string, any>[];
  taskSourceInfo?: string;
  taskSourceAttachment?: Record<string, any>[];

  // 扩展列表
  importanceTags?: {
    isTarget?: string;
    level?: string;
  }[];

  // 计划日期
  planDateInternalReview?: string;
  planDatePlanReview?: string;
  planDateSubmitReview?: string;
  planDateSubmitAchievement?: string;
  planDateFormalAchievement?: string;
  planDateArchiveEfile?: string;
  planDateArchivePaper?: string;

  mainWorkContent?: string;
  demandRemarks?: string;
}
