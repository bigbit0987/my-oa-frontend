/**
 * ProjectList - 项目台账页面
 * 基于 ProTable 实现的超级列表，支持高级筛选、列显隐、导出
 */
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Tag, Progress, Space, Tooltip, Typography, Avatar, Dropdown, message, Badge, Card, Statistic, Row, Col } from 'antd';
import type { MenuProps } from 'antd';
import {
    PlusOutlined,
    ExportOutlined,
    EyeOutlined,
    EditOutlined,
    MoreOutlined,
    ProjectOutlined,
    TeamOutlined,
    DollarOutlined,
    FileTextOutlined,
    RocketOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PauseCircleOutlined,
} from '@ant-design/icons';
import { getProjectList, getProjectStats } from '@/services/project';
import type { Project, ProjectQueryParams } from '@/services/project';
import './ProjectList.css';

const { Text } = Typography;

// 状态配置
const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    '进行中': { color: 'processing', icon: <RocketOutlined /> },
    '待启动': { color: 'warning', icon: <ClockCircleOutlined /> },
    '已完成': { color: 'success', icon: <CheckCircleOutlined /> },
    '已暂停': { color: 'default', icon: <PauseCircleOutlined /> },
};

// 优先级配置
const priorityConfig: Record<string, { color: string; label: string }> = {
    high: { color: 'red', label: '紧急' },
    medium: { color: 'orange', label: '普通' },
    low: { color: 'green', label: '一般' },
};

const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [stats, setStats] = useState({
        total: 0,
        inProgress: 0,
        pending: 0,
        completed: 0,
        totalBudget: 0,
        usedBudget: 0,
    });

    // 加载统计数据
    React.useEffect(() => {
        getProjectStats().then(setStats);
    }, []);

    // 查看项目详情
    const handleView = (project: Project) => {
        navigate(`/project/${project.id}`);
    };

    // 编辑项目
    const handleEdit = (project: Project) => {
        message.info(`编辑项目: ${project.name}`);
    };

    // 更多操作菜单
    const getMoreActions = (project: Project): MenuProps['items'] => [
        {
            key: 'edit',
            label: '编辑项目',
            icon: <EditOutlined />,
            onClick: () => handleEdit(project),
        },
        {
            key: 'team',
            label: '团队管理',
            icon: <TeamOutlined />,
        },
        {
            key: 'files',
            label: '文档管理',
            icon: <FileTextOutlined />,
        },
        { type: 'divider' },
        {
            key: 'archive',
            label: '归档项目',
            danger: true,
        },
    ];

    // 导出项目列表
    const handleExport = () => {
        message.success('项目列表导出中...');
    };

    // 表格列定义
    const columns: ProColumns<Project>[] = [
        {
            title: '项目编号',
            dataIndex: 'code',
            key: 'code',
            width: 140,
            fixed: 'left',
            copyable: true,
            render: (_, record) => (
                <Text strong className="project-code">{record.code}</Text>
            ),
        },
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            width: 280,
            ellipsis: true,
            render: (_, record) => (
                <div className="project-name-cell">
                    <Tooltip title={record.description}>
                        <Text
                            strong
                            className="project-name-link"
                            onClick={() => handleView(record)}
                        >
                            {record.name}
                        </Text>
                    </Tooltip>
                    <Text type="secondary" className="project-phase">
                        {record.phase}
                    </Text>
                </div>
            ),
        },
        {
            title: '项目类型',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            filters: true,
            valueEnum: {
                '研发项目': { text: '研发项目' },
                '工程项目': { text: '工程项目' },
                '服务项目': { text: '服务项目' },
            },
            render: (_, record) => (
                <Tag>{record.type}</Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: true,
            valueEnum: {
                '进行中': { text: '进行中', status: 'Processing' },
                '待启动': { text: '待启动', status: 'Warning' },
                '已完成': { text: '已完成', status: 'Success' },
                '已暂停': { text: '已暂停', status: 'Default' },
            },
            render: (_, record) => {
                const config = statusConfig[record.status];
                return (
                    <Tag color={config.color} icon={config.icon}>
                        {record.status}
                    </Tag>
                );
            },
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            width: 80,
            filters: true,
            valueEnum: {
                high: { text: '紧急' },
                medium: { text: '普通' },
                low: { text: '一般' },
            },
            render: (_, record) => {
                const config = priorityConfig[record.priority];
                return <Tag color={config.color}>{config.label}</Tag>;
            },
        },
        {
            title: '进度',
            dataIndex: 'progress',
            key: 'progress',
            width: 160,
            sorter: true,
            render: (_, record) => (
                <Progress
                    percent={record.progress}
                    size="small"
                    status={record.progress === 100 ? 'success' : 'active'}
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }}
                />
            ),
        },
        {
            title: '项目经理',
            dataIndex: ['manager', 'name'],
            key: 'manager',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                        {record.manager.name.charAt(0)}
                    </Avatar>
                    <Text>{record.manager.name}</Text>
                </Space>
            ),
        },
        {
            title: '所属部门',
            dataIndex: 'department',
            key: 'department',
            width: 100,
            filters: true,
            valueEnum: {
                '研发一部': { text: '研发一部' },
                '研发二部': { text: '研发二部' },
                '工程部': { text: '工程部' },
                '软件部': { text: '软件部' },
                '安防部': { text: '安防部' },
            },
        },
        {
            title: '预算(万)',
            dataIndex: 'budget',
            key: 'budget',
            width: 100,
            sorter: true,
            render: (_, record) => (
                <Text>{(record.budget / 10000).toFixed(0)}</Text>
            ),
        },
        {
            title: '开始日期',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 110,
            sorter: true,
            valueType: 'date',
        },
        {
            title: '结束日期',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 110,
            valueType: 'date',
        },
        {
            title: '操作',
            key: 'action',
            width: 140,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="查看详情">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleView(record)}
                        >
                            详情
                        </Button>
                    </Tooltip>
                    <Dropdown menu={{ items: getMoreActions(record) }}>
                        <Button icon={<MoreOutlined />} size="small" />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    // 表格请求函数
    const fetchProjects = async (params: ProjectQueryParams & { current?: number; keyword?: string }) => {
        const { current, keyword, ...rest } = params;
        const result = await getProjectList({
            ...rest,
            keyword,
            page: current,
            pageSize: params.pageSize,
        });
        return {
            data: result.data,
            total: result.total,
            success: true,
        };
    };

    return (
        <div className="project-list-container">
            {/* 统计卡片区域 */}
            <Row gutter={16} className="stats-row">
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card stat-card-total">
                        <Statistic
                            title="项目总数"
                            value={stats.total}
                            prefix={<ProjectOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card stat-card-progress">
                        <Statistic
                            title="进行中"
                            value={stats.inProgress}
                            prefix={<RocketOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card stat-card-pending">
                        <Statistic
                            title="待启动"
                            value={stats.pending}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card stat-card-budget">
                        <Statistic
                            title="总预算(万)"
                            value={(stats.totalBudget / 10000).toFixed(0)}
                            prefix={<DollarOutlined />}
                            suffix={<Text type="secondary" style={{ fontSize: 14 }}>
                                / 已用 {((stats.usedBudget / stats.totalBudget) * 100 || 0).toFixed(0)}%
                            </Text>}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ProTable 项目列表 */}
            <ProTable<Project>
                actionRef={actionRef}
                columns={columns}
                request={fetchProjects}
                rowKey="id"
                scroll={{ x: 1500 }}
                search={{
                    labelWidth: 'auto',
                    span: { xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6 },
                    defaultCollapsed: false,
                }}
                options={{
                    density: true,
                    fullScreen: true,
                    reload: true,
                    setting: {
                        listsHeight: 400,
                    },
                }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 个项目`,
                }}
                dateFormatter="string"
                headerTitle={
                    <Space>
                        <Badge status="processing" />
                        <span>项目台账</span>
                    </Space>
                }
                toolBarRender={() => [
                    <Button
                        key="export"
                        icon={<ExportOutlined />}
                        onClick={handleExport}
                    >
                        导出
                    </Button>,
                    <Button
                        key="new"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => message.info('新建项目功能开发中')}
                    >
                        新建项目
                    </Button>,
                ]}
                className="project-table"
            />
        </div>
    );
};

export default ProjectList;
