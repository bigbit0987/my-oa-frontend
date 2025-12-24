/**
 * UserManage - 用户管理页面
 */
import React, { useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Tag, Space, Avatar, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    LockOutlined,
} from '@ant-design/icons';
import './UserManage.css';

// 用户类型
interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    role: string;
    status: 'active' | 'disabled';
    createTime: string;
}

// Mock 用户数据
const mockUsers: User[] = [
    {
        id: 'user-001',
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        department: '技术部',
        role: '系统管理员',
        status: 'active',
        createTime: '2024-01-01T00:00:00',
    },
    {
        id: 'user-002',
        username: 'zhangsan',
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        department: '研发部',
        role: '项目经理',
        status: 'active',
        createTime: '2024-02-15T00:00:00',
    },
    {
        id: 'user-003',
        username: 'lisi',
        name: '李四',
        email: 'lisi@example.com',
        phone: '13800138002',
        department: '采购部',
        role: '普通用户',
        status: 'active',
        createTime: '2024-03-20T00:00:00',
    },
    {
        id: 'user-004',
        username: 'wangwu',
        name: '王五',
        email: 'wangwu@example.com',
        phone: '13800138003',
        department: '财务部',
        role: '部门负责人',
        status: 'disabled',
        createTime: '2024-04-10T00:00:00',
    },
];

const UserManage: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();

    // 打开新增/编辑弹窗
    const handleOpenModal = (user?: User) => {
        setEditingUser(user || null);
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    };

    // 保存用户
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('保存用户:', values);
            message.success(editingUser ? '用户更新成功' : '用户创建成功');
            setModalVisible(false);
        } catch {
            // 表单验证失败
        }
    };

    // 删除用户
    const handleDelete = (user: User) => {
        console.log('删除用户:', user.id);
        message.success('用户已删除');
    };

    // 重置密码
    const handleResetPassword = (user: User) => {
        console.log('重置密码:', user.id);
        message.success(`已重置 ${user.name} 的密码`);
    };

    // 表格列定义
    const columns: ProColumns<User>[] = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    {record.username}
                </Space>
            ),
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: 180,
            copyable: true,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
        },
        {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
            width: 100,
            filters: true,
            valueEnum: {
                '技术部': { text: '技术部' },
                '研发部': { text: '研发部' },
                '采购部': { text: '采购部' },
                '财务部': { text: '财务部' },
            },
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role) => <Tag color="blue">{role}</Tag>,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            valueEnum: {
                active: { text: '正常', status: 'Success' },
                disabled: { text: '禁用', status: 'Error' },
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            valueType: 'dateTime',
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<LockOutlined />}
                        onClick={() => handleResetPassword(record)}
                    >
                        重置密码
                    </Button>
                    <Popconfirm
                        title="确定要删除此用户吗？"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="user-manage-container">
            <ProTable<User>
                columns={columns}
                dataSource={mockUsers}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                }}
                options={{
                    density: true,
                    fullScreen: true,
                    reload: true,
                }}
                pagination={{
                    pageSize: 10,
                    showQuickJumper: true,
                }}
                headerTitle="用户管理"
                toolBarRender={() => [
                    <Button
                        key="add"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenModal()}
                    >
                        新增用户
                    </Button>,
                ]}
            />

            {/* 新增/编辑弹窗 */}
            <Modal
                title={editingUser ? '编辑用户' : '新增用户'}
                open={modalVisible}
                onOk={handleSave}
                onCancel={() => setModalVisible(false)}
                width={520}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input placeholder="请输入用户名" disabled={!!editingUser} />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                    >
                        <Input placeholder="请输入姓名" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱' },
                        ]}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>
                    <Form.Item name="phone" label="手机号">
                        <Input placeholder="请输入手机号" />
                    </Form.Item>
                    <Form.Item name="department" label="部门">
                        <Select
                            placeholder="请选择部门"
                            options={[
                                { label: '技术部', value: '技术部' },
                                { label: '研发部', value: '研发部' },
                                { label: '采购部', value: '采购部' },
                                { label: '财务部', value: '财务部' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="role" label="角色">
                        <Select
                            placeholder="请选择角色"
                            options={[
                                { label: '系统管理员', value: '系统管理员' },
                                { label: '项目经理', value: '项目经理' },
                                { label: '部门负责人', value: '部门负责人' },
                                { label: '普通用户', value: '普通用户' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="status" label="状态">
                        <Select
                            placeholder="请选择状态"
                            options={[
                                { label: '正常', value: 'active' },
                                { label: '禁用', value: 'disabled' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManage;
