import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import TaskList from '@/pages/Process/TaskList';
import TaskHandle from '@/pages/Process/TaskHandle';
import HistoryList from '@/pages/Process/HistoryList';
import MyRequest from '@/pages/Process/MyRequest';
import ProjectList from '@/pages/Project/ProjectList';
import ProjectDetail from '@/pages/Project/ProjectDetail';
import UserManage from '@/pages/Admin/UserManage';
import PermConfig from '@/pages/Admin/PermConfig';

export const router = createBrowserRouter([
    // 认证相关页面（无侧边栏布局）
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
        ],
    },
    // 主应用（带侧边栏布局）
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            // 流程中心路由
            {
                path: 'process',
                children: [
                    {
                        path: '',
                        element: <Navigate to="/process/todo" replace />,
                    },
                    {
                        path: 'todo',
                        element: <TaskList />,
                    },
                    {
                        path: 'history',
                        element: <HistoryList />,
                    },
                    {
                        path: 'my-request',
                        element: <MyRequest />,
                    },
                    {
                        path: 'task/:taskId',
                        element: <TaskHandle />,
                    },
                ],
            },
            // 项目中心路由
            {
                path: 'project',
                children: [
                    {
                        path: '',
                        element: <Navigate to="/project/list" replace />,
                    },
                    {
                        path: 'list',
                        element: <ProjectList />,
                    },
                    {
                        path: ':projectId',
                        element: <ProjectDetail />,
                    },
                ],
            },
            // 系统管理路由
            {
                path: 'admin',
                children: [
                    {
                        path: '',
                        element: <Navigate to="/admin/users" replace />,
                    },
                    {
                        path: 'users',
                        element: <UserManage />,
                    },
                    {
                        path: 'permissions',
                        element: <PermConfig />,
                    },
                ],
            },
        ],
    },
    // 登录页面快捷路由
    {
        path: '/login',
        element: <Navigate to="/auth/login" replace />,
    },
]);
