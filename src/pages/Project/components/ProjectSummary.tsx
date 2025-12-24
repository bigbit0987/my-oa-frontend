/**
 * ProjectSummary - 项目摘要卡片
 * 吸顶显示项目核心信息，快速了解项目概况
 */
import React from 'react';
import { Card, Tag, Progress, Space, Avatar, Typography, Statistic, Row, Col, Tooltip } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    DollarOutlined,
    TeamOutlined,
    FileTextOutlined,
    FolderOutlined,
    RocketOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import type { Project } from '@/services/project';
import './ProjectSummary.css';

const { Title, Text, Paragraph } = Typography;

interface ProjectSummaryProps {
    project: Project;
    isSticky?: boolean;
}

// 状态配置
const statusConfig: Record<string, { color: string; icon: React.ReactNode; bgColor: string }> = {
    '进行中': { color: '#1890ff', icon: <RocketOutlined />, bgColor: '#e6f7ff' },
    '待启动': { color: '#faad14', icon: <ClockCircleOutlined />, bgColor: '#fffbe6' },
    '已完成': { color: '#52c41a', icon: <CheckCircleOutlined />, bgColor: '#f6ffed' },
    '已暂停': { color: '#d9d9d9', icon: <ClockCircleOutlined />, bgColor: '#fafafa' },
};

const priorityConfig: Record<string, { color: string; label: string }> = {
    high: { color: 'red', label: '紧急' },
    medium: { color: 'orange', label: '普通' },
    low: { color: 'green', label: '一般' },
};

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ project, isSticky = false }) => {
    const status = statusConfig[project.status] || statusConfig['进行中'];
    const priority = priorityConfig[project.priority];

    // 计算剩余天数
    const getRemainingDays = () => {
        const now = new Date();
        const end = new Date(project.endDate);
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const remainingDays = getRemainingDays();

    // 预算使用百分比
    const budgetPercentage = Math.round((project.usedBudget / project.budget) * 100);

    return (
        <Card
            className={`project-summary-card ${isSticky ? 'is-sticky' : ''}`}
            bordered={false}
        >
            <div className="summary-content">
                {/* 左侧：项目基本信息 */}
                <div className="summary-main">
                    <div className="project-header">
                        <div className="project-identity">
                            <Text type="secondary" className="project-code">{project.code}</Text>
                            <Title level={4} className="project-name" ellipsis={{ rows: 1 }}>
                                {project.name}
                            </Title>
                        </div>
                        <div className="project-tags">
                            <Tag
                                color={status.bgColor}
                                icon={status.icon}
                                style={{ color: status.color, borderColor: status.color }}
                            >
                                {project.status}
                            </Tag>
                            <Tag color={priority.color}>{priority.label}</Tag>
                            <Tag>{project.type}</Tag>
                        </div>
                    </div>

                    {!isSticky && (
                        <Paragraph
                            type="secondary"
                            className="project-description"
                            ellipsis={{ rows: 2 }}
                        >
                            {project.description}
                        </Paragraph>
                    )}

                    {/* 项目经理和部门 */}
                    <div className="project-meta">
                        <Space size="large">
                            <span className="meta-item">
                                <Avatar size="small" icon={<UserOutlined />} />
                                <Text strong>{project.manager.name}</Text>
                                <Text type="secondary">· {project.manager.department}</Text>
                            </span>
                            <span className="meta-item">
                                <CalendarOutlined />
                                <Text>
                                    {project.startDate} ~ {project.endDate}
                                </Text>
                                {remainingDays > 0 ? (
                                    <Text type={remainingDays < 30 ? 'warning' : 'secondary'}>
                                        （剩余 {remainingDays} 天）
                                    </Text>
                                ) : remainingDays === 0 ? (
                                    <Text type="warning">（今日截止）</Text>
                                ) : (
                                    <Text type="danger">（已逾期 {Math.abs(remainingDays)} 天）</Text>
                                )}
                            </span>
                        </Space>
                    </div>
                </div>

                {/* 右侧：统计数据 */}
                <div className="summary-stats">
                    <Row gutter={24}>
                        <Col>
                            <div className="stat-item">
                                <Tooltip title="项目整体进度">
                                    <Progress
                                        type="circle"
                                        percent={project.progress}
                                        size={64}
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                        format={(percent) => (
                                            <span className="progress-text">{percent}%</span>
                                        )}
                                    />
                                </Tooltip>
                                <Text type="secondary" className="stat-label">完成进度</Text>
                            </div>
                        </Col>
                        <Col>
                            <Statistic
                                title={<Space><DollarOutlined /> 预算(万)</Space>}
                                value={(project.budget / 10000).toFixed(0)}
                                valueStyle={{ fontSize: 20 }}
                                suffix={
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        / {budgetPercentage}%
                                    </Text>
                                }
                            />
                        </Col>
                        <Col>
                            <Statistic
                                title={<Space><TeamOutlined /> 团队</Space>}
                                value={project.teamSize}
                                valueStyle={{ fontSize: 20 }}
                                suffix="人"
                            />
                        </Col>
                        <Col>
                            <Statistic
                                title={<Space><FolderOutlined /> 合同</Space>}
                                value={project.contractCount}
                                valueStyle={{ fontSize: 20 }}
                                suffix="份"
                            />
                        </Col>
                        <Col>
                            <Statistic
                                title={<Space><FileTextOutlined /> 文档</Space>}
                                value={project.fileCount}
                                valueStyle={{ fontSize: 20 }}
                                suffix="个"
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </Card>
    );
};

export default ProjectSummary;
