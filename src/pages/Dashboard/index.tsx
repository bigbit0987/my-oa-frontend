/**
 * Dashboard 工作台页面
 * "Morning Hub" - 每日第一站
 */
import React, { useEffect, useState } from 'react';
import { Typography, Progress, Avatar, Space } from 'antd';
import { UserOutlined, SyncOutlined } from '@ant-design/icons';
import { BentoCard, KPICard, UrgentList, QuickAccess } from './components';
import type { UrgentItem, QuickAccessItem } from './components';
import { useUserStore } from '@/stores/userStore';
import schemaService from '@/services/schema';
import './Dashboard.css';

const { Title, Text } = Typography;

// Mock 数据类型定义
interface DashboardData {
    kpi: {
        todoCount: number;
        projectCount: number;
        completedThisMonth: number;
        overdueTasks: number;
    };
    urgentList: UrgentItem[];
    quickAccess: QuickAccessItem[];
    recentProjects: Array<{
        id: string;
        name: string;
        stage: string;
        progress: number;
    }>;
}

const Dashboard: React.FC = () => {
    const { name, avatar } = useUserStore();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);

    // 获取问候语
    const getGreeting = (): string => {
        const hour = new Date().getHours();
        if (hour < 6) return '夜深了';
        if (hour < 9) return '早上好';
        if (hour < 12) return '上午好';
        if (hour < 14) return '中午好';
        if (hour < 18) return '下午好';
        return '晚上好';
    };

    // 加载数据
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await schemaService.load<DashboardData>('dashboard');
                setData(result);
            } catch (error) {
                console.error('加载 Dashboard 数据失败:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div className="dashboard-container">
            {/* 欢迎横幅 */}
            <div className="dashboard-header">
                <div className="header-content">
                    <Avatar size={64} src={avatar} icon={<UserOutlined />} className="header-avatar" />
                    <div className="header-info">
                        <Title level={3} className="header-greeting">
                            {getGreeting()}，{name}
                        </Title>
                        <Text className="header-subtitle">
                            欢迎回来！今天是 {new Date().toLocaleDateString('zh-CN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </div>
                </div>
                <div className="header-summary">
                    <Space size="large">
                        <div className="summary-item">
                            <Text type="secondary">今日待办</Text>
                            <Text strong className="summary-value">{data?.kpi.todoCount || 0}</Text>
                        </div>
                        <div className="summary-item">
                            <Text type="secondary">进行中项目</Text>
                            <Text strong className="summary-value">{data?.kpi.projectCount || 0}</Text>
                        </div>
                    </Space>
                </div>
            </div>

            {/* Bento Grid 布局 */}
            <div className="bento-grid">
                {/* KPI 统计卡片 - 2x1 */}
                <BentoCard
                    title="📊 数据概览"
                    size="2x1"
                    loading={loading}
                    extra={<SyncOutlined spin={loading} />}
                >
                    {data && (
                        <KPICard
                            todoCount={data.kpi.todoCount}
                            projectCount={data.kpi.projectCount}
                            completedThisMonth={data.kpi.completedThisMonth}
                            overdueTasks={data.kpi.overdueTasks}
                        />
                    )}
                </BentoCard>

                {/* 快捷入口 - 1x1 */}
                <BentoCard title="🚀 快捷入口" size="1x1" loading={loading}>
                    {data && <QuickAccess items={data.quickAccess} />}
                </BentoCard>

                {/* 紧急待办 - 1x2 */}
                <BentoCard
                    title="🔔 紧急待办"
                    size="1x2"
                    loading={loading}
                    extra={<a href="#/process/todo">查看全部</a>}
                >
                    {data && <UrgentList items={data.urgentList} />}
                </BentoCard>

                {/* 最近项目 - 2x1 */}
                <BentoCard title="📁 最近项目" size="2x1" loading={loading}>
                    <div className="recent-projects">
                        {data?.recentProjects.map((project) => (
                            <div key={project.id} className="project-item">
                                <div className="project-info">
                                    <Text strong className="project-name">{project.name}</Text>
                                    <Text type="secondary" className="project-stage">{project.stage}</Text>
                                </div>
                                <div className="project-progress">
                                    <Progress
                                        percent={project.progress}
                                        size="small"
                                        strokeColor={{
                                            '0%': '#1890ff',
                                            '100%': '#52c41a',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </BentoCard>
            </div>
        </div>
    );
};

export default Dashboard;
