/**
 * FinanceView - 资金/合同看板
 * 展示项目的预算使用情况和合同信息
 */
import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Typography, Empty, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    DollarOutlined,
    RiseOutlined,
    FallOutlined,
    FileProtectOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
} from '@ant-design/icons';
import type { Project, ProjectContract } from '@/services/project';
import './FinanceView.css';

const { Text } = Typography;

interface FinanceViewProps {
    project: Project;
}

// 合同状态配置
const contractStatusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    '生效': { color: 'success', icon: <CheckCircleOutlined /> },
    '待签': { color: 'warning', icon: <ClockCircleOutlined /> },
    '已终止': { color: 'default', icon: <StopOutlined /> },
};

const FinanceView: React.FC<FinanceViewProps> = ({ project }) => {
    // 计算预算数据
    const budgetUsedPercent = Math.round((project.usedBudget / project.budget) * 100);
    const remainingBudget = project.budget - project.usedBudget;

    // 合同总额
    const contractTotal = project.contracts.reduce((sum, c) => sum + c.amount, 0);
    const signedContractTotal = project.contracts
        .filter(c => c.status === '生效')
        .reduce((sum, c) => sum + c.amount, 0);

    // 合同表格列定义
    const contractColumns: ColumnsType<ProjectContract> = [
        {
            title: '合同名称',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: '金额(万)',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (amount) => (
                <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    {(amount / 10000).toFixed(2)}
                </Text>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const config = contractStatusConfig[status];
                return (
                    <Tag color={config.color} icon={config.icon}>
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: '签订日期',
            dataIndex: 'signDate',
            key: 'signDate',
            width: 110,
            render: (date) => date || '-',
        },
    ];

    return (
        <div className="finance-view">
            {/* 预算概览卡片 */}
            <Row gutter={16} className="budget-cards">
                <Col xs={24} sm={12} md={6}>
                    <Card className="budget-card budget-total">
                        <Statistic
                            title="项目预算"
                            value={(project.budget / 10000).toFixed(0)}
                            prefix={<DollarOutlined />}
                            suffix="万"
                            valueStyle={{ color: '#1890ff', fontSize: 28 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="budget-card budget-used">
                        <Statistic
                            title="已用预算"
                            value={(project.usedBudget / 10000).toFixed(0)}
                            prefix={<FallOutlined />}
                            suffix="万"
                            valueStyle={{ color: '#fa8c16', fontSize: 28 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="budget-card budget-remaining">
                        <Statistic
                            title="剩余预算"
                            value={(remainingBudget / 10000).toFixed(0)}
                            prefix={<RiseOutlined />}
                            suffix="万"
                            valueStyle={{ color: remainingBudget > 0 ? '#52c41a' : '#f5222d', fontSize: 28 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="budget-card budget-progress">
                        <div className="progress-wrapper">
                            <Text type="secondary">预算使用率</Text>
                            <Tooltip title={`已使用 ${budgetUsedPercent}%`}>
                                <Progress
                                    type="circle"
                                    percent={budgetUsedPercent}
                                    size={80}
                                    strokeColor={{
                                        '0%': '#108ee9',
                                        '100%': budgetUsedPercent > 90 ? '#f5222d' : '#87d068',
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 合同信息 */}
            <Card
                className="contract-card"
                title={
                    <div className="card-title">
                        <FileProtectOutlined />
                        <span>合同信息</span>
                        <Tag color="blue">{project.contracts.length} 份</Tag>
                    </div>
                }
                extra={
                    <Text type="secondary">
                        合同总额: <Text strong style={{ color: '#1890ff' }}>{(contractTotal / 10000).toFixed(2)}</Text> 万
                        | 已签: <Text strong style={{ color: '#52c41a' }}>{(signedContractTotal / 10000).toFixed(2)}</Text> 万
                    </Text>
                }
            >
                {project.contracts.length > 0 ? (
                    <Table
                        columns={contractColumns}
                        dataSource={project.contracts}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                    />
                ) : (
                    <Empty description="暂无合同信息" />
                )}
            </Card>
        </div>
    );
};

export default FinanceView;
