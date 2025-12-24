/**
 * 项目服务 - API 接口封装
 * 实现本地/远程双模式加载策略
 */
import request from './request';

// 项目类型定义
export interface ProjectPhase {
    name: string;
    status: 'completed' | 'active' | 'pending';
    startDate: string;
    endDate: string;
}

export interface ProjectTeamMember {
    id: string;
    name: string;
    role: string;
    workload: number;
    avatar?: string;
}

export interface ProjectContract {
    id: string;
    name: string;
    amount: number;
    status: '生效' | '待签' | '已终止';
    signDate: string | null;
}

export interface ProjectFile {
    id: string;
    name: string;
    phase: string;
    type: string;
    size: number;
    uploadTime: string;
}

export interface ProjectManager {
    id: string;
    name: string;
    avatar: string | null;
    department: string;
}

export interface Project {
    id: string;
    code: string;
    name: string;
    type: string;
    status: '进行中' | '待启动' | '已完成' | '已暂停';
    phase: string;
    priority: 'high' | 'medium' | 'low';
    progress: number;
    startDate: string;
    endDate: string;
    budget: number;
    usedBudget: number;
    manager: ProjectManager;
    department: string;
    client: string;
    description: string;
    teamSize: number;
    contractCount: number;
    fileCount: number;
    phases: ProjectPhase[];
    team: ProjectTeamMember[];
    contracts: ProjectContract[];
    files: ProjectFile[];
}

// 查询参数类型
export interface ProjectQueryParams {
    keyword?: string;
    status?: string;
    type?: string;
    department?: string;
    priority?: string;
    page?: number;
    pageSize?: number;
}

// 分页响应类型
export interface PagedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

// 是否使用本地 Mock 数据
const USE_LOCAL_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

/**
 * 获取项目列表
 */
export async function getProjectList(params?: ProjectQueryParams): Promise<PagedResponse<Project>> {
    if (USE_LOCAL_MOCK) {
        // 本地 Mock 模式
        const mockData = await import('@/mocks/projects.json');
        let projects = mockData.projects as Project[];

        // 应用过滤条件
        if (params?.keyword) {
            const keyword = params.keyword.toLowerCase();
            projects = projects.filter(p =>
                p.name.toLowerCase().includes(keyword) ||
                p.code.toLowerCase().includes(keyword) ||
                p.manager.name.toLowerCase().includes(keyword)
            );
        }
        if (params?.status) {
            projects = projects.filter(p => p.status === params.status);
        }
        if (params?.type) {
            projects = projects.filter(p => p.type === params.type);
        }
        if (params?.department) {
            projects = projects.filter(p => p.department === params.department);
        }
        if (params?.priority) {
            projects = projects.filter(p => p.priority === params.priority);
        }

        // 分页处理
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        return {
            data: projects.slice(start, end),
            total: projects.length,
            page,
            pageSize,
        };
    }

    // 远程 API 模式
    return request.get('/projects', { params });
}

/**
 * 获取项目详情
 */
export async function getProjectDetail(projectId: string): Promise<Project> {
    if (USE_LOCAL_MOCK) {
        const mockData = await import('@/mocks/projects.json');
        const project = (mockData.projects as Project[]).find(p => p.id === projectId);
        if (!project) {
            throw new Error('项目不存在');
        }
        return project;
    }

    return request.get(`/projects/${projectId}`);
}

/**
 * 获取项目统计数据
 */
export async function getProjectStats(): Promise<{
    total: number;
    inProgress: number;
    pending: number;
    completed: number;
    totalBudget: number;
    usedBudget: number;
}> {
    if (USE_LOCAL_MOCK) {
        const mockData = await import('@/mocks/projects.json');
        const projects = mockData.projects as Project[];

        return {
            total: projects.length,
            inProgress: projects.filter(p => p.status === '进行中').length,
            pending: projects.filter(p => p.status === '待启动').length,
            completed: projects.filter(p => p.status === '已完成').length,
            totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
            usedBudget: projects.reduce((sum, p) => sum + p.usedBudget, 0),
        };
    }

    return request.get('/projects/stats');
}

/**
 * 获取项目类型列表（用于筛选）
 */
export async function getProjectTypes(): Promise<string[]> {
    if (USE_LOCAL_MOCK) {
        return ['研发项目', '工程项目', '服务项目'];
    }
    return request.get('/projects/types');
}

/**
 * 获取部门列表（用于筛选）
 */
export async function getDepartments(): Promise<string[]> {
    if (USE_LOCAL_MOCK) {
        return ['研发一部', '研发二部', '工程部', '软件部', '安防部'];
    }
    return request.get('/departments');
}

/**
 * 导出项目列表
 */
export async function exportProjects(params?: ProjectQueryParams): Promise<Blob> {
    return request.get('/projects/export', {
        params,
        responseType: 'blob',
    });
}
