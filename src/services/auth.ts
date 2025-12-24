/**
 * Auth 服务 - 认证相关 API
 */
import request from './request';

// 用户登录信息
export interface LoginParams {
    username: string;
    password: string;
    captcha?: string;
}

// 登录响应
export interface LoginResult {
    token: string;
    refreshToken?: string;
    expiresIn: number;
    user: UserInfo;
}

// 用户信息
export interface UserInfo {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    email?: string;
    phone?: string;
    department: {
        id: string;
        name: string;
    };
    roles: string[];
    permissions: string[];
}

// Mock 用户数据
const mockUser: UserInfo = {
    id: 'user-001',
    username: 'admin',
    name: '管理员',
    avatar: undefined,
    email: 'admin@example.com',
    phone: '138****8888',
    department: {
        id: 'dept-001',
        name: '技术部',
    },
    roles: ['admin', 'project_manager'],
    permissions: ['*'],
};

// 是否使用本地 Mock
const USE_LOCAL_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

/**
 * 用户登录
 */
export async function login(params: LoginParams): Promise<LoginResult> {
    if (USE_LOCAL_MOCK) {
        // 模拟登录延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        // 简单验证
        if (params.username === 'admin' && params.password === 'admin123') {
            return {
                token: 'mock-jwt-token-' + Date.now(),
                refreshToken: 'mock-refresh-token-' + Date.now(),
                expiresIn: 7200,
                user: mockUser,
            };
        }
        throw new Error('用户名或密码错误');
    }

    return request.post('/auth/login', params);
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return;
    }

    return request.post('/auth/logout');
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<UserInfo> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockUser;
    }

    return request.get('/auth/current');
}

/**
 * 刷新 Token
 */
export async function refreshToken(token: string): Promise<{ token: string; expiresIn: number }> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            token: 'mock-jwt-token-refreshed-' + Date.now(),
            expiresIn: 7200,
        };
    }

    return request.post('/auth/refresh', { refreshToken: token });
}

/**
 * 修改密码
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (USE_LOCAL_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (oldPassword !== 'admin123') {
            throw new Error('原密码错误');
        }
        return;
    }

    return request.post('/auth/change-password', { oldPassword, newPassword });
}
