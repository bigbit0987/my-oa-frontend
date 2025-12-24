/**
 * ProcessDiagram - BPMN 流程图预览组件
 * 展示流程的各个节点和当前进度
 */
import React, { useMemo } from 'react';
import { Tooltip, Tag } from 'antd';
import {
    PlayCircleOutlined,
    StopOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './ProcessDiagram.css';

// 节点类型
export type NodeType = 'start' | 'end' | 'userTask' | 'gateway' | 'serviceTask';

// 节点状态
export type NodeStatus = 'completed' | 'active' | 'pending' | 'skipped';

// 流程节点
export interface ProcessNode {
    id: string;
    name: string;
    type: NodeType;
    status: NodeStatus;
    assignee?: string;
    completedAt?: string;
}

// 节点连接
export interface ProcessEdge {
    from: string;
    to: string;
    label?: string;
}

interface ProcessDiagramProps {
    /** 流程节点 */
    nodes: ProcessNode[];
    /** 节点连接 */
    edges?: ProcessEdge[];
    /** 当前激活节点 ID */
    activeNodeId?: string;
    /** 是否使用简化模式 (线性展示) */
    simplified?: boolean;
}

// 节点类型图标
const nodeTypeIcons: Record<NodeType, React.ReactNode> = {
    start: <PlayCircleOutlined />,
    end: <StopOutlined />,
    userTask: <UserOutlined />,
    gateway: <span>◇</span>,
    serviceTask: <span>⚙</span>,
};

// 状态配置
const statusConfig: Record<NodeStatus, { color: string; bgColor: string; label: string }> = {
    completed: { color: '#52c41a', bgColor: '#f6ffed', label: '已完成' },
    active: { color: '#1890ff', bgColor: '#e6f7ff', label: '进行中' },
    pending: { color: '#8c8c8c', bgColor: '#f5f5f5', label: '待处理' },
    skipped: { color: '#d9d9d9', bgColor: '#fafafa', label: '已跳过' },
};

const ProcessDiagram: React.FC<ProcessDiagramProps> = ({
    nodes,
    activeNodeId,
    simplified = true,
}) => {
    // 找到当前激活的节点
    const activeIndex = useMemo(() => {
        if (activeNodeId) {
            return nodes.findIndex(n => n.id === activeNodeId);
        }
        return nodes.findIndex(n => n.status === 'active');
    }, [nodes, activeNodeId]);

    if (simplified) {
        // 简化的线性展示模式
        return (
            <div className="process-diagram simplified">
                <div className="diagram-track">
                    {nodes.map((node, index) => {
                        const isActive = node.status === 'active' || node.id === activeNodeId;
                        const isCompleted = node.status === 'completed';
                        const config = statusConfig[node.status];

                        return (
                            <React.Fragment key={node.id}>
                                {/* 连接线 */}
                                {index > 0 && (
                                    <div
                                        className={`diagram-connector ${index <= activeIndex || isCompleted ? 'completed' : ''
                                            }`}
                                    />
                                )}

                                {/* 节点 */}
                                <Tooltip
                                    title={
                                        <div>
                                            <div>{node.name}</div>
                                            {node.assignee && <div>处理人: {node.assignee}</div>}
                                            {node.completedAt && <div>完成时间: {node.completedAt}</div>}
                                        </div>
                                    }
                                >
                                    <div
                                        className={`diagram-node ${node.status} ${node.type}`}
                                        style={{
                                            borderColor: config.color,
                                            backgroundColor: config.bgColor,
                                        }}
                                    >
                                        <div className="node-icon" style={{ color: config.color }}>
                                            {isActive ? (
                                                <ClockCircleOutlined className="pulse" />
                                            ) : isCompleted ? (
                                                <CheckCircleOutlined />
                                            ) : (
                                                nodeTypeIcons[node.type]
                                            )}
                                        </div>
                                        <div className="node-name">
                                            {node.name}
                                        </div>
                                        {isActive && (
                                            <Tag color="processing" className="node-status-tag">
                                                进行中
                                            </Tag>
                                        )}
                                    </div>
                                </Tooltip>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* 进度指示器 */}
                <div className="diagram-progress">
                    <div
                        className="progress-bar"
                        style={{
                            width: `${Math.max(0, ((activeIndex + 1) / nodes.length) * 100)}%`
                        }}
                    />
                </div>
            </div>
        );
    }

    // TODO: 完整 BPMN 图形渲染模式
    return (
        <div className="process-diagram full">
            <div className="diagram-placeholder">
                完整 BPMN 图形渲染 (开发中...)
            </div>
        </div>
    );
};

export default ProcessDiagram;
