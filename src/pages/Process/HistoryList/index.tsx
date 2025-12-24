/**
 * HistoryList - 已办历史列表
 * 展示用户已处理完成的任务
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Input, Select, Typography, Avatar, Badge, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined,
    EyeOutlined,
    UserOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import { getDoneTasks } from '@/services/task';
import type { Task } from '@/services/task';
import './HistoryList.css';

const { Title, Text } = Typography;
const { Search } = Input;

const statusConfig = {
    completed: { color: 'success', label: '已通过', icon: <CheckCircleOutlined /> },
    rejected: { color: 'error', label: '已驳回', icon: <CloseCircleOutlined /> },
};

const HistoryList: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    // 加载数据
    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getDoneTasks({
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
                    <Text type="secondary" className="task-name">{record.taskName}</Text>
                </div>
            ),
        },
        {
            title: '发起人',
            dataIndex: 'initiator',
            key: 'initiator',
            width: 120,
            render: (initiator) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <Text>{initiator.name}</Text>
                </Space>
            ),
        },
        {
            title: '处理结果',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: 'completed' | 'rejected') => {
                const config = statusConfig[status] || statusConfig.completed;
                return (
                    <Tag color={config.color} icon={config.icon}>
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            sorter: true,
            render: (time) => new Date(time).toLocaleString('zh-CN'),
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            render: () => (
                <Tooltip title="查看详情">
                    <Button type="link" icon={<EyeOutlined />}>
                        查看
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="history-list-container">
            <Card className="history-list-card">
                <div className="history-list-header">
                    <div className="header-left">
                        <Title level={4}>
                            <Badge count={total} offset={[10, 0]} showZero>
                                已办历史
                            </Badge>
                        </Title>
                    </div>
                    <div className="header-right">
                        <Space>
                            <Search
                                placeholder="搜索流程名称、发起人"
                                allowClear
                                onSearch={setSearchText}
                                style={{ width: 280 }}
                                prefix={<SearchOutlined />}
                            />
                            <Select
                                placeholder="处理结果"
                                allowClear
                                style={{ width: 120 }}
                                options={[
                                    { label: '全部', value: '' },
                                    { label: '已通过', value: 'completed' },
                                    { label: '已驳回', value: 'rejected' },
                                ]}
                            />
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
                        showTotal: (total) => `共 ${total} 条记录`,
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                />
            </Card>
        </div>
    );
};

export default HistoryList;
