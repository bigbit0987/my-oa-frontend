import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';

// 占位组件，后续 Phase 2-4 会替换
const Dashboard = () => <div>Dashboard Content (Phase 2)</div>;
const ProcessCenter = () => <div>Process Center Content (Phase 3)</div>;
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
            {
                path: 'process/*',
                element: <ProcessCenter />,
            },
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
