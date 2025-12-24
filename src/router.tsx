import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import TaskList from '@/pages/Process/TaskList';
import TaskHandle from '@/pages/Process/TaskHandle';
import ProjectList from '@/pages/Project/ProjectList';
import ProjectDetail from '@/pages/Project/ProjectDetail';

export const router = createBrowserRouter([
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
                        element: <TaskList />, // 暂时复用，后续区分
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
            {
                path: 'admin/*',
                element: <div>Admin Content</div>,
            },
        ],
    },
]);
