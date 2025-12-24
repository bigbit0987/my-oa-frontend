/**
 * BentoCard - Bento Grid 卡片组件
 * 支持多种尺寸：1x1, 2x1, 2x2
 */
import React from 'react';
import { Card, Skeleton } from 'antd';
import './BentoCard.css';

export type BentoSize = '1x1' | '2x1' | '1x2' | '2x2';

export interface BentoCardProps {
    size?: BentoSize;
    title?: React.ReactNode;
    extra?: React.ReactNode;
    loading?: boolean;
    children?: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    onClick?: () => void;
}

const sizeClasses: Record<BentoSize, string> = {
    '1x1': 'bento-1x1',
    '2x1': 'bento-2x1',
    '1x2': 'bento-1x2',
    '2x2': 'bento-2x2',
};

export const BentoCard: React.FC<BentoCardProps> = ({
    size = '1x1',
    title,
    extra,
    loading = false,
    children,
    className = '',
    hoverable = true,
    onClick,
}) => {
    return (
        <Card
            className={`bento-card ${sizeClasses[size]} ${className}`}
            title={title}
            extra={extra}
            hoverable={hoverable}
            onClick={onClick}
            styles={{
                body: { height: '100%', display: 'flex', flexDirection: 'column' }
            }}
        >
            {loading ? (
                <Skeleton active paragraph={{ rows: size === '2x2' ? 6 : size === '2x1' || size === '1x2' ? 4 : 2 }} />
            ) : (
                children
            )}
        </Card>
    );
};

export default BentoCard;
