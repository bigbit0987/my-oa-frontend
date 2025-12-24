/**
 * TeamView - 人力负荷视图
 * 展示项目团队成员和工作负荷情况
 */
import React from 'react';
import { Card, Row, Col, Avatar, Progress, Typography, Tag, Space, Empty, Tooltip, Badge } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    CrownOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import type { Project, ProjectTeamMember } from '@/services/project';
import './TeamView.css';

const { Title, Text } = Typography;

interface TeamViewProps {
    project: Project;
}

// 角色配置
const roleConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    '项目经理': { color: '#722ed1', icon: <CrownOutlined /> },
    '技术负责人': { color: '#1890ff', icon: <ThunderboltOutlined /> },
    '技术总监': { color: '#1890ff', icon: <ThunderboltOutlined /> },
    '需求分析师': { color: '#52c41a', icon: <CheckCircleOutlined /> },
    'default': { color: '#8c8c8c', icon: <UserOutlined /> },
};

// 工作负荷等级配置
const getWorkloadConfig = (workload: number) => {
    if (workload >= 90) return { status: 'error' as const, label: '超负荷', color: '#ff4d4f' };
    if (workload >= 70) return { status: 'warning' as const, label: '高负荷', color: '#faad14' };
    if (workload >= 40) return { status: 'default' as const, label: '正常', color: '#52c41a' };
    return { status: 'success' as const, label: '空闲', color: '#1890ff' };
};

const TeamView: React.FC<TeamViewProps> = ({ project }) => {
    // 计算团队统计数据
    const avgWorkload = project.team.length > 0
        ? Math.round(project.team.reduce((sum, m) => sum + m.workload, 0) / project.team.length)
        : 0;

    const overloadCount = project.team.filter(m => m.workload >= 90).length;
    const normalCount = project.team.filter(m => m.workload >= 40 && m.workload < 90).length;
    const idleCount = project.team.filter(m => m.workload < 40).length;

    // 渲染成员卡片
    const renderMemberCard = (member: ProjectTeamMember) => {
        const roleConf = roleConfig[member.role] || roleConfig['default'];
        const workloadConf = getWorkloadConfig(member.workload);

        return (
            <Col xs={24} sm={12} md={8} lg={6} key={member.id}>
                <Card className="member-card" hoverable>
                    <div className="member-content">
                        <div className="member-avatar">
                            <Badge
                                status={workloadConf.status}
                                offset={[-4, 36]}
                            >
                                <Avatar
                                    size={48}
                                    icon={<UserOutlined />}
                                    src={member.avatar}
                                    style={{ backgroundColor: roleConf.color }}
                                >
                                    {member.name.charAt(0)}
                                </Avatar>
                            </Badge>
                        </div>
                        <div className="member-info">
                            <Text strong className="member-name">{member.name}</Text>
                            <Tag
                                icon={roleConf.icon}
                                color={roleConf.color}
                                className="role-tag"
                            >
                                {member.role}
                            </Tag>
                        </div>
                        <div className="member-workload">
                            <div className="workload-header">
                                <Text type="secondary">工作负荷</Text>
                                <Text style={{ color: workloadConf.color, fontWeight: 500 }}>
                                    {workloadConf.label}
                                </Text>
                            </div>
                            <Tooltip title={`${member.workload}%`}>
                                <Progress
                                    percent={member.workload}
                                    size="small"
                                    strokeColor={workloadConf.color}
                                    showInfo={false}
                                />
                            </Tooltip>
                        </div>
                    </div>
                </Card>
            </Col>
        );
    };

    return (
        <div className="team-view">
            {/* 团队概览 */}
            <Card className="team-overview-card">
                <Row gutter={24} align="middle">
                    <Col xs={12} sm={6}>
                        <div className="overview-stat">
                            <TeamOutlined className="stat-icon" />
                            <div className="stat-content">
                                <Text type="secondary">团队人数</Text>
                                <Title level={4}>{project.teamSize} 人</Title>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div className="overview-stat">
                            <Progress
                                type="circle"
                                percent={avgWorkload}
                                size={56}
                                strokeColor={{
                                    '0%': '#52c41a',
                                    '50%': '#faad14',
                                    '100%': '#ff4d4f',
                                }}
                            />
                            <div className="stat-content">
                                <Text type="secondary">平均负荷</Text>
                                <Title level={4}>{avgWorkload}%</Title>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <div className="workload-distribution">
                            <Text type="secondary">负荷分布</Text>
                            <Space size="large" className="distribution-tags">
                                <Tag color="error">超负荷 {overloadCount} 人</Tag>
                                <Tag color="success">正常 {normalCount} 人</Tag>
                                <Tag color="processing">空闲 {idleCount} 人</Tag>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* 成员列表 */}
            <Card
                className="members-card"
                title={
                    <div className="card-title">
                        <UserOutlined />
                        <span>团队成员</span>
                    </div>
                }
            >
                {project.team.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {project.team.map(renderMemberCard)}
                    </Row>
                ) : (
                    <Empty description="暂无团队成员信息" />
                )}
            </Card>
        </div>
    );
};

export default TeamView;
