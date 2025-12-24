/**
 * MyRequest - 我的申请
 * 展示当前用户发起的所有流程申请
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Input, Select, Typography, Badge, Button, Tooltip, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined,
    EyeOutlined,
    PlusOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { getInitiatedTasks } from '@/services/task';
import type { Task } from '@/services/task';
import './MyRequest.css';

const { Title, Text } = Typography;
const { Search } = Input;

// 状态配置
const statusConfig = {
    pending: { color: 'processing', label: '审批中', icon: <SyncOutlined spin /> },
    completed: { color: 'success', label: '已完成', icon: <CheckCircleOutlined /> },
    rejected: { color: 'error', label: '已驳回', icon: <CloseCircleOutlined /> },
};

const MyRequest: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    // 加载数据
    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getInitiatedTasks({
                keyword: searchText,
                page: pagination.current,
                pageSize: pagination.pageSize,
            });
            setTasks(result.data);
            setTotal(result.total);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [pagination, searchText]);

    // 表格列定义
    const columns: ColumnsType<Task> = [
        {
            title: '流程名称',
            dataIndex: 'processName',
            key: 'processName',
            width: 200,
            render: (text, record) => (
                <div className="process-name-cell">
                    <Text strong>{text}</Text>
                    <Text type="secondary" className="task-name">当前节点: {record.taskName}</Text>
                </div>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: 'pending' | 'completed' | 'rejected') => {
                const config = statusConfig[status];
                return (
                    <Tag color={config.color} icon={config.icon}>
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: '进度',
            key: 'progress',
            width: 150,
            render: (_, record) => {
                // Mock 进度计算
                const progress = record.status === 'completed' ? 100 :
                    record.status === 'rejected' ? 0 : 50;
                return (
                    <Progress
                        percent={progress}
                        size="small"
                        status={record.status === 'rejected' ? 'exception' :
                            record.status === 'completed' ? 'success' : 'active'}
                    />
                );
            },
        },
        {
            title: '发起时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            sorter: true,
            render: (time) => new Date(time).toLocaleString('zh-CN'),
        },
        {
            title: '当前处理人',
            dataIndex: 'assignee',
            key: 'assignee',
            width: 100,
            render: (assignee) => assignee?.name || '-',
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="查看详情">
                        <Button type="link" icon={<EyeOutlined />}>
                            查看
                        </Button>
                    </Tooltip>
                    {record.status === 'pending' && (
                        <Tooltip title="催办">
                            <Button type="link" icon={<ClockCircleOutlined />}>
                                催办
                            </Button>
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="my-request-container">
            <Card className="my-request-card">
                <div className="my-request-header">
                    <div className="header-left">
                        <Title level={4}>
                            <Badge count={total} offset={[10, 0]} showZero>
                                我的申请
                            </Badge>
                        </Title>
                    </div>
                    <div className="header-right">
                        <Space>
                            <Search
                                placeholder="搜索流程名称"
                                allowClear
                                onSearch={setSearchText}
                                style={{ width: 240 }}
                                prefix={<SearchOutlined />}
                            />
                            <Select
                                placeholder="流程状态"
                                allowClear
                                style={{ width: 120 }}
                                onChange={setStatusFilter}
                                options={[
                                    { label: '全部', value: '' },
                                    { label: '审批中', value: 'pending' },
                                    { label: '已完成', value: 'completed' },
                                    { label: '已驳回', value: 'rejected' },
                                ]}
                            />
                            <Button type="primary" icon={<PlusOutlined />}>
                                发起申请
                            </Button>
                        </Space>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={tasks}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条申请`,
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                />
            </Card>
        </div>
    );
};

export default MyRequest;
