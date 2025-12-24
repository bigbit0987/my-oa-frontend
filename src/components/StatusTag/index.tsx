/**
 * StatusTag - 统一状态标签组件
 * 用于显示审批状态、项目状态等
 */
import React from 'react';
import { Tag } from 'antd';
import {
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    PauseCircleOutlined,
} from '@ant-design/icons';
import './StatusTag.css';

// 预定义状态类型
export type StatusType =
    | 'pending'        // 待处理
    | 'processing'     // 进行中
    | 'completed'      // 已完成
    | 'approved'       // 已通过
    | 'rejected'       // 已驳回
    | 'cancelled'      // 已取消
    | 'suspended'      // 已暂停
    | 'expired'        // 已过期
    | 'draft';         // 草稿

// 状态配置
const statusConfigs: Record<StatusType, {
    color: string;
    icon: React.ReactNode;
    label: string;
}> = {
    pending: {
        color: 'warning',
        icon: <ClockCircleOutlined />,
        label: '待处理',
    },
    processing: {
        color: 'processing',
        icon: <SyncOutlined spin />,
        label: '进行中',
    },
    completed: {
        color: 'success',
        icon: <CheckCircleOutlined />,
        label: '已完成',
    },
    approved: {
        color: 'success',
        icon: <CheckCircleOutlined />,
        label: '已通过',
    },
    rejected: {
        color: 'error',
        icon: <CloseCircleOutlined />,
        label: '已驳回',
    },
    cancelled: {
        color: 'default',
        icon: <MinusCircleOutlined />,
        label: '已取消',
    },
    suspended: {
        color: 'warning',
        icon: <PauseCircleOutlined />,
        label: '已暂停',
    },
    expired: {
        color: 'error',
        icon: <ExclamationCircleOutlined />,
        label: '已过期',
    },
    draft: {
        color: 'default',
        icon: <MinusCircleOutlined />,
        label: '草稿',
    },
};

interface StatusTagProps {
    /** 状态类型 */
    status: StatusType | string;
    /** 自定义标签文字（覆盖默认） */
    label?: string;
    /** 是否显示图标 */
    showIcon?: boolean;
    /** 尺寸 */
    size?: 'small' | 'default';
    /** 自定义样式类名 */
    className?: string;
}

const StatusTag: React.FC<StatusTagProps> = ({
    status,
    label,
    showIcon = true,
    size = 'default',
    className = '',
}) => {
    // 获取配置，如果没有预定义则使用默认配置
    const config = statusConfigs[status as StatusType] || {
        color: 'default',
        icon: null,
        label: status,
    };

    const displayLabel = label || config.label;

    return (
        <Tag
            color={config.color}
            icon={showIcon ? config.icon : undefined}
            className={`status-tag ${size === 'small' ? 'status-tag-small' : ''} ${className}`}
        >
            {displayLabel}
        </Tag>
    );
};

export default StatusTag;

// 导出状态类型供外部使用
export { statusConfigs };
