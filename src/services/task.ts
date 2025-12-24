/**
 * Task 服务 - 任务相关 API
 */
import request from './request';

// 任务类型
export interface Task {
    id: string;
    processInstanceId: string;
    processDefinitionId: string;
    processName: string;
    taskName: string;
    taskDefinitionKey: string;
    createTime: string;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'completed' | 'rejected';
    initiator: {
        id: string;
        name: string;
        avatar?: string;
        department?: string;
    };
    assignee?: {
        id: string;
        name: string;
    };
    formKey?: string;
    businessKey?: string;
    variables?: Record<string, unknown>;
}

// 任务查询参数
export interface TaskQueryParams {
    type?: 'todo' | 'done' | 'initiated';
    keyword?: string;
    processKey?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
}

// 分页响应
export interface PagedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

// 审批操作参数
export interface ApprovalParams {
    taskId: string;
    action: 'approve' | 'reject' | 'delegate' | 'addSign';
    comment: string;
    variables?: Record<string, unknown>;
    delegateUserId?: string;
    addSignUserIds?: string[];
}

// Mock 待办任务数据
const mockTodoTasks: Task[] = [
    {
        id: 'task-001',
        processInstanceId: 'proc-001',
        processDefinitionId: 'design_input_review:1:1',
        processName: '设计输入评审',
        taskName: '技术负责人审核',
        taskDefinitionKey: 'techReview',
        createTime: '2024-12-24T10:00:00',
        dueDate: '2024-12-26T18:00:00',
        priority: 'high',
        status: 'pending',
        initiator: { id: 'user-003', name: '王五', department: '研发部' },
        formKey: 'design_input_review',
    },
    {
        id: 'task-002',
        processInstanceId: 'proc-002',
        processDefinitionId: 'purchase_contract:1:1',
        processName: '采购合同审批',
        taskName: '部门负责人审批',
        taskDefinitionKey: 'deptApproval',
        createTime: '2024-12-23T14:30:00',
        dueDate: '2024-12-27T18:00:00',
        priority: 'medium',
        status: 'pending',
        initiator: { id: 'user-004', name: '李四', department: '采购部' },
        formKey: 'purchase_contract',
    },
    {
        id: 'task-003',
        processInstanceId: 'proc-003',
        processDefinitionId: 'project_change:1:1',
        processName: '项目变更申请',
        taskName: '总工审批',
        taskDefinitionKey: 'chiefEngineerApproval',
        createTime: '2024-12-22T09:00:00',
        priority: 'low',
        status: 'pending',
        initiator: { id: 'user-005', name: '赵六', department: '项目部' },
        formKey: 'project_change',
    },
];

// Mock 已办任务数据
const mockDoneTasks: Task[] = [
    {
        id: 'task-done-001',
        processInstanceId: 'proc-done-001',
        processDefinitionId: 'design_input_review:1:1',
        processName: '设计输入评审',
        taskName: '技术负责人审核',
        taskDefinitionKey: 'techReview',
        createTime: '2024-12-20T10:00:00',
        priority: 'high',
        status: 'completed',
        initiator: { id: 'user-006', name: '张三', department: '研发部' },
        formKey: 'design_input_review',
    },
    {
        id: 'task-done-002',
        processInstanceId: 'proc-done-002',
        processDefinitionId: 'leave_request:1:1',
        processName: '请假申请',
        taskName: '部门负责人审批',
        taskDefinitionKey: 'deptApproval',
        createTime: '2024-12-19T14:30:00',
        priority: 'low',
        status: 'completed',
        initiator: { id: 'user-007', name: '钱七', department: '行政部' },
        formKey: 'leave_request',
    },
];

// Mock 我发起的任务
const mockInitiatedTasks: Task[] = [
    {
        id: 'task-init-001',
        processInstanceId: 'proc-init-001',
        processDefinitionId: 'expense_claim:1:1',
        processName: '费用报销',
        taskName: '财务审核',
        taskDefinitionKey: 'financeReview',
        createTime: '2024-12-23T09:00:00',
        priority: 'medium',
        status: 'pending',
        initiator: { id: 'user-001', name: '管理员', department: '技术部' },
        formKey: 'expense_claim',
    },
];

const USE_LOCAL_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

/**
 * 获取待办任务列表
 */
export async function getTodoTasks(params?: TaskQueryParams): Promise<PagedResponse<Task>> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        let tasks = [...mockTodoTasks];

        // 关键字过滤
        if (params?.keyword) {
            const keyword = params.keyword.toLowerCase();
            tasks = tasks.filter(t =>
                t.processName.toLowerCase().includes(keyword) ||
                t.taskName.toLowerCase().includes(keyword) ||
                t.initiator.name.toLowerCase().includes(keyword)
            );
        }

        // 优先级过滤
        if (params?.priority) {
            tasks = tasks.filter(t => t.priority === params.priority);
        }

        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;

        return {
            data: tasks.slice(start, start + pageSize),
            total: tasks.length,
            page,
            pageSize,
        };
    }

    return request.get('/tasks/todo', { params });
}

/**
 * 获取已办任务列表
 */
export async function getDoneTasks(params?: TaskQueryParams): Promise<PagedResponse<Task>> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        let tasks = [...mockDoneTasks];

        if (params?.keyword) {
            const keyword = params.keyword.toLowerCase();
            tasks = tasks.filter(t =>
                t.processName.toLowerCase().includes(keyword) ||
                t.taskName.toLowerCase().includes(keyword)
            );
        }

        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;

        return {
            data: tasks.slice(start, start + pageSize),
            total: tasks.length,
            page,
            pageSize,
        };
    }

    return request.get('/tasks/done', { params });
}

/**
 * 获取我发起的任务列表
 */
export async function getInitiatedTasks(params?: TaskQueryParams): Promise<PagedResponse<Task>> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const tasks = [...mockInitiatedTasks];
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;

        return {
            data: tasks.slice(start, start + pageSize),
            total: tasks.length,
            page,
            pageSize,
        };
    }

    return request.get('/tasks/initiated', { params });
}

/**
 * 获取任务详情
 */
export async function getTaskDetail(taskId: string): Promise<Task> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const allTasks = [...mockTodoTasks, ...mockDoneTasks, ...mockInitiatedTasks];
        const task = allTasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error('任务不存在');
        }
        return task;
    }

    return request.get(`/tasks/${taskId}`);
}

/**
 * 提交审批
 */
export async function submitApproval(params: ApprovalParams): Promise<void> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Mock 审批提交:', params);
        return;
    }

    return request.post('/tasks/approve', params);
}

/**
 * 获取任务统计
 */
export async function getTaskStats(): Promise<{
    todoCount: number;
    doneCount: number;
    initiatedCount: number;
    urgentCount: number;
}> {
    if (USE_LOCAL_MOCK) {
        return {
            todoCount: mockTodoTasks.length,
            doneCount: mockDoneTasks.length,
            initiatedCount: mockInitiatedTasks.length,
            urgentCount: mockTodoTasks.filter(t => t.priority === 'high').length,
        };
    }

    return request.get('/tasks/stats');
}
