/**
 * ProcessTimeline - 审批记录时间线
 * 可视化展示"谁在什么时间做了什么"
 */
import React from 'react';
import { Timeline, Avatar, Tag, Typography, Tooltip } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    SendOutlined,
    UserOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import './ProcessTimeline.css';

const { Text, Paragraph } = Typography;

// 审批动作类型
export type ApprovalAction =
    | 'submit'      // 提交
    | 'approve'     // 同意
    | 'reject'      // 驳回
    | 'forward'     // 转办
    | 'countersign' // 加签
    | 'withdraw'    // 撤回
    | 'pending';    // 待办

// 审批记录项
export interface ApprovalRecord {
    id: string;
    /** 操作人 */
    operator: {
        id: string;
        name: string;
        avatar?: string;
        department?: string;
    };
    /** 操作动作 */
    action: ApprovalAction;
    /** 操作时间 */
    timestamp: string;
    /** 节点名称 */
    nodeName: string;
    /** 审批意见 */
    comment?: string;
    /** 耗时 (分钟) */
    duration?: number;
    /** 是否当前节点 */
    isCurrent?: boolean;
}

interface ProcessTimelineProps {
    /** 审批记录列表 */
    records: ApprovalRecord[];
    /** 是否显示详细信息 */
    showDetail?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 最大显示条数 (超出折叠) */
    maxItems?: number;
}

// 动作配置
const actionConfig: Record<ApprovalAction, {
    label: string;
    color: string;
    icon: React.ReactNode;
    dotColor: 'green' | 'red' | 'blue' | 'gray' | 'orange';
}> = {
    submit: {
        label: '提交申请',
        color: '#1890ff',
        icon: <SendOutlined />,
        dotColor: 'blue',
    },
    approve: {
        label: '审批通过',
        color: '#52c41a',
        icon: <CheckCircleOutlined />,
        dotColor: 'green',
    },
    reject: {
        label: '审批驳回',
        color: '#ff4d4f',
        icon: <CloseCircleOutlined />,
        dotColor: 'red',
    },
    forward: {
        label: '转办',
        color: '#722ed1',
        icon: <SyncOutlined />,
        dotColor: 'blue',
    },
    countersign: {
        label: '加签',
        color: '#fa8c16',
        icon: <ExclamationCircleOutlined />,
        dotColor: 'orange',
    },
    withdraw: {
        label: '撤回',
        color: '#8c8c8c',
        icon: <CloseCircleOutlined />,
        dotColor: 'gray',
    },
    pending: {
        label: '待处理',
        color: '#faad14',
        icon: <ClockCircleOutlined />,
        dotColor: 'gray',
    },
};

// 格式化时间
const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// 格式化耗时
const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    const days = Math.floor(hours / 24);
    const remainHours = hours % 24;
    return `${days}天${remainHours > 0 ? remainHours + '小时' : ''}`;
};

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
    records,
    showDetail = true,
    loading = false,
    maxItems,
}) => {
    // 处理折叠
    const displayRecords = maxItems && records.length > maxItems
        ? records.slice(0, maxItems)
        : records;
    const hasMore = maxItems && records.length > maxItems;

    const items = displayRecords.map((record) => {
        const config = actionConfig[record.action];

        return {
            key: record.id,
            color: config.dotColor,
            dot: record.isCurrent ? (
                <div className="timeline-dot-current">
                    <ClockCircleOutlined spin />
                </div>
            ) : (
                <div className={`timeline-dot timeline-dot-${config.dotColor}`}>
                    {config.icon}
                </div>
            ),
            children: (
                <div className={`timeline-item ${record.isCurrent ? 'current' : ''}`}>
                    <div className="timeline-header">
                        <div className="timeline-user">
                            <Avatar
                                size="small"
                                src={record.operator.avatar}
                                icon={<UserOutlined />}
                            />
                            <Text strong className="timeline-user-name">
                                {record.operator.name}
                            </Text>
                            {record.operator.department && (
                                <Text type="secondary" className="timeline-user-dept">
                                    ({record.operator.department})
                                </Text>
                            )}
                        </div>
                        <Tag
                            color={config.color}
                            bordered={false}
                            className="timeline-action-tag"
                        >
                            {config.label}
                        </Tag>
                    </div>

                    <div className="timeline-node">
                        <Text type="secondary">{record.nodeName}</Text>
                    </div>

                    {showDetail && record.comment && (
                        <Paragraph className="timeline-comment">
                            "{record.comment}"
                        </Paragraph>
                    )}

                    <div className="timeline-footer">
                        <Text type="secondary" className="timeline-time">
                            {formatTime(record.timestamp)}
                        </Text>
                        {record.duration && (
                            <Tooltip title="处理耗时">
                                <Text type="secondary" className="timeline-duration">
                                    <ClockCircleOutlined /> {formatDuration(record.duration)}
                                </Text>
                            </Tooltip>
                        )}
                    </div>
                </div>
            ),
        };
    });

    // 添加"更多"项
    if (hasMore) {
        items.push({
            key: 'more',
            color: 'gray' as const,
            dot: <div className="timeline-dot-more">···</div>,
            children: (
                <Text type="secondary">
                    还有 {records.length - maxItems!} 条记录
                </Text>
            ),
        });
    }

    return (
        <div className="process-timeline">
            <Timeline
                pending={loading ? '加载中...' : false}
                items={items}
            />
        </div>
    );
};

export default ProcessTimeline;
