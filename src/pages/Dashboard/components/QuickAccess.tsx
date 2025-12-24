/**
 * QuickAccess - 快捷入口组件
 * 高频操作入口图标组
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircleOutlined,
    CheckSquareOutlined,
    ProjectOutlined,
    HistoryOutlined,
    BarChartOutlined,
    CalendarOutlined,
    FileTextOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import './QuickAccess.css';

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
    PlusCircleOutlined: <PlusCircleOutlined />,
    CheckSquareOutlined: <CheckSquareOutlined />,
    ProjectOutlined: <ProjectOutlined />,
    HistoryOutlined: <HistoryOutlined />,
    BarChartOutlined: <BarChartOutlined />,
    CalendarOutlined: <CalendarOutlined />,
    FileTextOutlined: <FileTextOutlined />,
    TeamOutlined: <TeamOutlined />,
};

// 渐变色方案
const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
];

export interface QuickAccessItem {
    key: string;
    label: string;
    icon: string;
    path: string;
}

interface QuickAccessProps {
    items: QuickAccessItem[];
}

const QuickAccess: React.FC<QuickAccessProps> = ({ items }) => {
    const navigate = useNavigate();

    return (
        <div className="quick-access-grid">
            {items.map((item, index) => (
                <div
                    key={item.key}
                    className="quick-access-item"
                    onClick={() => navigate(item.path)}
                    style={{ '--item-gradient': gradients[index % gradients.length] } as React.CSSProperties}
                >
                    <div className="quick-access-icon">
                        {iconMap[item.icon] || <FileTextOutlined />}
                    </div>
                    <span className="quick-access-label">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default QuickAccess;
