import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import TaskList from '@/pages/Process/TaskList';
import TaskHandle from '@/pages/Process/TaskHandle';

// 占位组件，后续 Phase 4 会替换
const ProjectCenter = () => <div>Project Center Content (Phase 4)</div>;

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
                path: 'project/*',
                element: <ProjectCenter />,
            },
            {
                path: 'admin/*',
                element: <div>Admin Content</div>,
            },
        ],
    },
]);
