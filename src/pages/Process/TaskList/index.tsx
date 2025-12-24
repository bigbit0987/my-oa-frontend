/**
 * TaskList - 待办任务列表页面
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Tag, Button, Space, Input, Select, Badge, Typography, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined,
    EyeOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './TaskList.css';

const { Title, Text } = Typography;
const { Search } = Input;

// 任务数据类型
interface TaskItem {
    id: string;
    processInstanceId: string;
    processName: string;
    taskName: string;
    createTime: string;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
    initiator: {
        name: string;
        avatar?: string;
    };
}

// Mock 数据
const mockTasks: TaskItem[] = [
    {
        id: 'task-001',
        processInstanceId: 'proc-001',
        processName: '设计输入评审',
        taskName: '技术负责人审核',
        createTime: '2024-12-24T10:00:00',
        dueDate: '2024-12-26T18:00:00',
        priority: 'high',
        initiator: { name: '王五' },
    },
    {
        id: 'task-002',
        processInstanceId: 'proc-002',
        processName: '采购合同审批',
        taskName: '部门负责人审批',
        createTime: '2024-12-23T14:30:00',
        dueDate: '2024-12-27T18:00:00',
        priority: 'medium',
        initiator: { name: '李四' },
    },
    {
        id: 'task-003',
        processInstanceId: 'proc-003',
        processName: '项目变更申请',
        taskName: '总工审批',
        createTime: '2024-12-22T09:00:00',
        priority: 'low',
        initiator: { name: '赵六' },
    },
];

const priorityConfig = {
    high: { color: 'red', label: '紧急' },
    medium: { color: 'orange', label: '普通' },
    low: { color: 'green', label: '一般' },
};

const TaskList: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [searchText, setSearchText] = useState('');

    // 加载数据
    useEffect(() => {
        setLoading(true);
        // 模拟 API 调用
        setTimeout(() => {
            setTasks(mockTasks);
            setLoading(false);
        }, 500);
    }, []);

    // 计算剩余时间
    const getRemainingTime = (dueDate?: string): React.ReactNode => {
        if (!dueDate) return <Text type="secondary">-</Text>;

        const now = new Date();
        const due = new Date(dueDate);
        const diffMs = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return <Text type="danger">已逾期 {Math.abs(diffDays)} 天</Text>;
        } else if (diffDays === 0) {
            return <Text type="warning">今天截止</Text>;
        } else if (diffDays <= 3) {
            return <Text type="warning">{diffDays} 天后截止</Text>;
        }
        return <Text type="secondary">{diffDays} 天后截止</Text>;
    };

    // 处理任务
    const handleTask = (taskId: string) => {
        navigate(`/process/task/${taskId}`);
    };

    // 表格列定义
    const columns: ColumnsType<TaskItem> = [
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
                    <Avatar size="small" icon={<UserOutlined />} src={initiator.avatar} />
                    <Text>{initiator.name}</Text>
                </Space>
            ),
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            width: 100,
            filters: [
                { text: '紧急', value: 'high' },
                { text: '普通', value: 'medium' },
                { text: '一般', value: 'low' },
            ],
            onFilter: (value, record) => record.priority === value,
            render: (priority: 'high' | 'medium' | 'low') => (
                <Tag color={priorityConfig[priority].color}>
                    {priorityConfig[priority].label}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
            render: (time) => new Date(time).toLocaleString('zh-CN'),
        },
        {
            title: '截止时间',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 140,
            render: (dueDate) => getRemainingTime(dueDate),
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleTask(record.id)}
                >
                    办理
                </Button>
            ),
        },
    ];

    // 过滤任务
    const filteredTasks = tasks.filter(task =>
        task.processName.includes(searchText) ||
        task.taskName.includes(searchText) ||
        task.initiator.name.includes(searchText)
    );

    return (
        <div className="task-list-container">
            <Card className="task-list-card">
                <div className="task-list-header">
                    <div className="header-left">
                        <Title level={4}>
                            <Badge count={tasks.length} offset={[10, 0]}>
                                待办任务
                            </Badge>
                        </Title>
                    </div>
                    <div className="header-right">
                        <Space>
                            <Search
                                placeholder="搜索流程名称、任务、发起人"
                                allowClear
                                onSearch={setSearchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 280 }}
                                prefix={<SearchOutlined />}
                            />
                            <Select
                                placeholder="流程类型"
                                allowClear
                                style={{ width: 140 }}
                                options={[
                                    { label: '全部类型', value: '' },
                                    { label: '评审流程', value: 'review' },
                                    { label: '审批流程', value: 'approval' },
                                    { label: '变更流程', value: 'change' },
                                ]}
                            />
                        </Space>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredTasks}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        total: filteredTasks.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条待办`,
                    }}
                    scroll={{ x: 900 }}
                    className="task-table"
                />
            </Card>
        </div>
    );
};

export default TaskList;
