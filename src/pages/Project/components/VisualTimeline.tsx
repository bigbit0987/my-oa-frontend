/**
 * VisualTimeline - 项目阶段可视化进度条
 * 顶部时间线组件，显示项目各阶段的状态和进度
 */
import React from 'react';
import { Tooltip } from 'antd';
import {
    CheckCircleFilled,
    SyncOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import './VisualTimeline.css';

export interface TimelinePhase {
    name: string;
    status: 'completed' | 'active' | 'pending';
    startDate: string;
    endDate: string;
}

interface VisualTimelineProps {
    phases: TimelinePhase[];
    currentPhase?: string;
}

const VisualTimeline: React.FC<VisualTimelineProps> = ({ phases }) => {
    // 获取阶段状态配置
    const getStatusConfig = (status: TimelinePhase['status']) => {
        switch (status) {
            case 'completed':
                return {
                    icon: <CheckCircleFilled />,
                    className: 'phase-completed',
                    label: '已完成',
                };
            case 'active':
                return {
                    icon: <SyncOutlined spin />,
                    className: 'phase-active',
                    label: '进行中',
                };
            case 'pending':
            default:
                return {
                    icon: <ClockCircleOutlined />,
                    className: 'phase-pending',
                    label: '待开始',
                };
        }
    };

    // 格式化日期
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // 计算进度百分比（用于 active 阶段）
    const calculateProgress = (phase: TimelinePhase) => {
        if (phase.status !== 'active') return 100;

        const start = new Date(phase.startDate).getTime();
        const end = new Date(phase.endDate).getTime();
        const now = Date.now();

        if (now <= start) return 0;
        if (now >= end) return 100;

        return Math.round(((now - start) / (end - start)) * 100);
    };

    return (
        <div className="visual-timeline">
            <div className="timeline-track">
                {phases.map((phase, index) => {
                    const config = getStatusConfig(phase.status);
                    const isLast = index === phases.length - 1;
                    const progress = calculateProgress(phase);

                    return (
                        <div key={phase.name} className="timeline-segment">
                            {/* 阶段节点 */}
                            <Tooltip
                                title={
                                    <div className="phase-tooltip">
                                        <div className="tooltip-title">{phase.name}</div>
                                        <div className="tooltip-status">{config.label}</div>
                                        <div className="tooltip-date">
                                            {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                                        </div>
                                    </div>
                                }
                                placement="bottom"
                            >
                                <div className={`phase-node ${config.className}`}>
                                    <div className="phase-icon">{config.icon}</div>
                                    <div className="phase-label">{phase.name}</div>
                                </div>
                            </Tooltip>

                            {/* 连接线 */}
                            {!isLast && (
                                <div className="timeline-connector">
                                    <div
                                        className={`connector-line ${phase.status === 'completed' ? 'line-completed' : ''}`}
                                        style={phase.status === 'active' ? {
                                            '--progress': `${progress}%`
                                        } as React.CSSProperties : undefined}
                                    >
                                        {phase.status === 'active' && (
                                            <div className="progress-indicator" style={{ left: `${progress}%` }} />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisualTimeline;
