/**
 * HTTP 请求服务 - Axios 封装
 * 统一处理 Auth、Error 拦截
 */
import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { useUserStore } from '@/stores/userStore';

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 注入 Token
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useUserStore.getState().token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
    (response: AxiosResponse) => {
        // 业务层成功
        return response.data;
    },
    (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status;

        switch (status) {
            case 401:
                // Token 失效，清除用户信息并跳转登录
                useUserStore.getState().setUser({ token: undefined });
                message.error('登录已过期，请重新登录');
                window.location.href = '/login';
                break;
            case 403:
                message.error('没有权限访问该资源');
                break;
            case 404:
                message.error('请求的资源不存在');
                break;
            case 500:
                message.error('服务器内部错误，请稍后重试');
                break;
            default:
                message.error(error.response?.data?.message || '网络请求失败');
        }

        return Promise.reject(error);
    }
);

export default request;
