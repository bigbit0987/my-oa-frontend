/**
 * KPICard - KPI 统计卡片
 * 展示待办数、项目数等关键指标，带微动画效果
 */
import React from 'react';
import { Typography } from 'antd';
import {
    CheckSquareOutlined,
    ProjectOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import './KPICard.css';

const { Title, Text } = Typography;

interface KPIItem {
    key: string;
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: number;
}

interface KPICardProps {
    todoCount: number;
    projectCount: number;
    completedThisMonth: number;
    overdueTasks: number;
}

const KPICard: React.FC<KPICardProps> = ({
    todoCount,
    projectCount,
    completedThisMonth,
    overdueTasks,
}) => {
    const kpiItems: KPIItem[] = [
        {
            key: 'todo',
            label: '待办任务',
            value: todoCount,
            icon: <CheckSquareOutlined />,
            color: '#1890ff',
        },
        {
            key: 'project',
            label: '负责项目',
            value: projectCount,
            icon: <ProjectOutlined />,
            color: '#52c41a',
        },
        {
            key: 'completed',
            label: '本月完成',
            value: completedThisMonth,
            icon: <CheckCircleOutlined />,
            color: '#722ed1',
        },
        {
            key: 'overdue',
            label: '逾期任务',
            value: overdueTasks,
            icon: <ClockCircleOutlined />,
            color: overdueTasks > 0 ? '#ff4d4f' : '#8c8c8c',
        },
    ];

    return (
        <div className="kpi-grid">
            {kpiItems.map((item) => (
                <div key={item.key} className="kpi-item" style={{ '--kpi-color': item.color } as React.CSSProperties}>
                    <div className="kpi-icon-wrapper">
                        {item.icon}
                    </div>
                    <div className="kpi-content">
                        <Title level={2} className="kpi-value">
                            {item.value}
                        </Title>
                        <Text className="kpi-label">{item.label}</Text>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KPICard;
