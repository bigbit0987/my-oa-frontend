/**
 * UrgentList - 紧急待办列表
 * Top 5 紧急待办，带红灯预警效果
 */
import React from 'react';
import { List, Tag, Typography, Badge } from 'antd';
import { ExclamationCircleOutlined, ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './UrgentList.css';

const { Text } = Typography;

export interface UrgentItem {
    id: string;
    title: string;
    type: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
    status: string;
}

interface UrgentListProps {
    items: UrgentItem[];
    onItemClick?: (item: UrgentItem) => void;
}

const priorityConfig: Record<string, { color: string; label: string }> = {
    high: { color: '#ff4d4f', label: '紧急' },
    medium: { color: '#faad14', label: '普通' },
    low: { color: '#52c41a', label: '一般' },
};

// 计算剩余天数
const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const UrgentList: React.FC<UrgentListProps> = ({ items, onItemClick }) => {
    const navigate = useNavigate();

    const handleItemClick = (item: UrgentItem) => {
        if (onItemClick) {
            onItemClick(item);
        } else {
            navigate(`/process/task/${item.id}`);
        }
    };

    return (
        <div className="urgent-list-container">
            <List
                dataSource={items.slice(0, 5)}
                renderItem={(item) => {
                    const daysRemaining = getDaysRemaining(item.deadline);
                    const isOverdue = daysRemaining < 0;
                    const isUrgent = daysRemaining <= 2 && !isOverdue;
                    const priority = priorityConfig[item.priority];

                    return (
                        <List.Item
                            className={`urgent-item ${isOverdue ? 'overdue' : ''} ${isUrgent ? 'warning' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <div className="urgent-item-content">
                                <div className="urgent-item-left">
                                    {(isOverdue || item.priority === 'high') && (
                                        <Badge status="error" className="urgent-badge pulse" />
                                    )}
                                    <div className="urgent-item-info">
                                        <Text strong className="urgent-title" ellipsis>
                                            {item.title}
                                        </Text>
                                        <div className="urgent-meta">
                                            <Tag bordered={false} style={{ background: `${priority.color}15`, color: priority.color }}>
                                                {priority.label}
                                            </Tag>
                                            <Text type="secondary" className="urgent-type">{item.type}</Text>
                                        </div>
                                    </div>
                                </div>
                                <div className="urgent-item-right">
                                    <div className={`deadline-tag ${isOverdue ? 'overdue' : isUrgent ? 'warning' : ''}`}>
                                        <ClockCircleOutlined />
                                        <span>
                                            {isOverdue
                                                ? `逾期 ${Math.abs(daysRemaining)} 天`
                                                : daysRemaining === 0
                                                    ? '今天截止'
                                                    : `${daysRemaining} 天后`
                                            }
                                        </span>
                                    </div>
                                    <RightOutlined className="urgent-arrow" />
                                </div>
                            </div>
                        </List.Item>
                    );
                }}
            />
            {items.length === 0 && (
                <div className="urgent-empty">
                    <ExclamationCircleOutlined />
                    <Text type="secondary">暂无紧急待办</Text>
                </div>
            )}
        </div>
    );
};

export default UrgentList;
