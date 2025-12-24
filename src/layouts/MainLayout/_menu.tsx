import { DashboardOutlined, ProjectOutlined, ClusterOutlined, SettingOutlined } from '@ant-design/icons';

// 菜单配置
export const menuItems = {
    route: {
        path: '/',
        routes: [
            {
                path: '/dashboard',
                name: '工作台',
                icon: <DashboardOutlined />,
            },
            {
                path: '/process',
                name: '流程中心',
                icon: <ClusterOutlined />,
                routes: [
                    { path: '/process/todo', name: '待办任务' },
                    { path: '/process/history', name: '已办历史' },
                    { path: '/process/my-request', name: '我的申请' },
                ],
            },
            {
                path: '/project',
                name: '项目中心',
                icon: <ProjectOutlined />,
                routes: [
                    { path: '/project/list', name: '项目台账' },
                ],
            },
            {
                path: '/admin',
                name: '系统管理',
                icon: <SettingOutlined />,
                routes: [
                    { path: '/admin/users', name: '用户管理' },
                    { path: '/admin/permissions', name: '权限配置' },
                ],
            },
        ],
    },
    location: {
        pathname: '/',
    },
};
