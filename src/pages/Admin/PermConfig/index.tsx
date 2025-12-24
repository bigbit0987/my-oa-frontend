/**
 * PermConfig - 权限配置页面
 * 表单权限配置矩阵
 */
import React, { useState } from 'react';
import { Card, Table, Select, Tag, Space, Button, Typography, Tabs, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SaveOutlined,
    ReloadOutlined,
    LockOutlined,
    EyeOutlined,
    EditOutlined,
} from '@ant-design/icons';
import './PermConfig.css';

const { Title, Text } = Typography;

// 权限类型
type PermissionLevel = 'hidden' | 'readonly' | 'editable';

// 表单字段权限
interface FieldPermission {
    fieldKey: string;
    fieldName: string;
    fieldType: string;
    initiator: PermissionLevel;
    reviewer: PermissionLevel;
    approver: PermissionLevel;
}

// 流程定义
interface ProcessDef {
    key: string;
    name: string;
    fields: FieldPermission[];
}

// Mock 流程表单权限数据
const mockProcesses: ProcessDef[] = [
    {
        key: 'design_input_review',
        name: '设计输入评审',
        fields: [
            { fieldKey: 'projectCode', fieldName: '项目编号', fieldType: 'input', initiator: 'editable', reviewer: 'readonly', approver: 'readonly' },
            { fieldKey: 'projectName', fieldName: '项目名称', fieldType: 'input', initiator: 'editable', reviewer: 'readonly', approver: 'readonly' },
            { fieldKey: 'designContent', fieldName: '设计内容', fieldType: 'textarea', initiator: 'editable', reviewer: 'readonly', approver: 'readonly' },
            { fieldKey: 'reviewOpinion', fieldName: '评审意见', fieldType: 'textarea', initiator: 'hidden', reviewer: 'editable', approver: 'readonly' },
            { fieldKey: 'approvalResult', fieldName: '审批结果', fieldType: 'select', initiator: 'hidden', reviewer: 'hidden', approver: 'editable' },
        ],
    },
    {
        key: 'project_change',
        name: '项目变更申请',
        fields: [
            { fieldKey: 'projectCode', fieldName: '项目编号', fieldType: 'input', initiator: 'editable', reviewer: 'readonly', approver: 'readonly' },
            { fieldKey: 'changeType', fieldName: '变更类型', fieldType: 'select', initiator: 'editable', reviewer: 'readonly', approver: 'readonly' },
            { fieldKey: 'changeReason', fieldName: '变更原因', fieldType: 'textarea', initiator: 'editable', reviewer: 'readonly', approver: 'readonly' },
            { fieldKey: 'impact', fieldName: '影响分析', fieldType: 'textarea', initiator: 'editable', reviewer: 'editable', approver: 'readonly' },
        ],
    },
];

// 权限级别配置
const permissionLevels = [
    { value: 'hidden', label: '隐藏', color: 'default', icon: <LockOutlined /> },
    { value: 'readonly', label: '只读', color: 'blue', icon: <EyeOutlined /> },
    { value: 'editable', label: '可编辑', color: 'green', icon: <EditOutlined /> },
];

const PermConfig: React.FC = () => {
    const [activeProcess, setActiveProcess] = useState(mockProcesses[0].key);
    const [permissions, setPermissions] = useState<Record<string, FieldPermission[]>>(
        Object.fromEntries(mockProcesses.map(p => [p.key, [...p.fields]]))
    );

    // 当前流程（用于未来扩展：显示流程描述等）
    const _currentProcess = mockProcesses.find(p => p.key === activeProcess);
    const currentPermissions = permissions[activeProcess] || [];

    // 更新权限
    const handlePermissionChange = (fieldKey: string, role: string, value: PermissionLevel) => {
        setPermissions(prev => ({
            ...prev,
            [activeProcess]: prev[activeProcess].map(field =>
                field.fieldKey === fieldKey
                    ? { ...field, [role]: value }
                    : field
            ),
        }));
    };

    // 保存配置
    const handleSave = () => {
        console.log('保存权限配置:', permissions[activeProcess]);
        message.success('权限配置已保存');
    };

    // 重置配置
    const handleReset = () => {
        const original = mockProcesses.find(p => p.key === activeProcess);
        if (original) {
            setPermissions(prev => ({
                ...prev,
                [activeProcess]: [...original.fields],
            }));
            message.info('已重置为默认配置');
        }
    };

    // 渲染权限选择器
    const renderPermissionSelect = (fieldKey: string, role: string, value: PermissionLevel) => (
        <Select
            value={value}
            size="small"
            style={{ width: 100 }}
            onChange={(v) => handlePermissionChange(fieldKey, role, v)}
            options={permissionLevels.map(p => ({
                value: p.value,
                label: (
                    <Space>
                        {p.icon}
                        <span>{p.label}</span>
                    </Space>
                ),
            }))}
        />
    );

    // 表格列定义
    const columns: ColumnsType<FieldPermission> = [
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            key: 'fieldName',
            width: 150,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: '字段标识',
            dataIndex: 'fieldKey',
            key: 'fieldKey',
            width: 140,
            render: (text) => <Tag>{text}</Tag>,
        },
        {
            title: '字段类型',
            dataIndex: 'fieldType',
            key: 'fieldType',
            width: 100,
            render: (type) => <Tag color="purple">{type}</Tag>,
        },
        {
            title: '发起人',
            dataIndex: 'initiator',
            key: 'initiator',
            width: 120,
            render: (value, record) => renderPermissionSelect(record.fieldKey, 'initiator', value),
        },
        {
            title: '审核人',
            dataIndex: 'reviewer',
            key: 'reviewer',
            width: 120,
            render: (value, record) => renderPermissionSelect(record.fieldKey, 'reviewer', value),
        },
        {
            title: '审批人',
            dataIndex: 'approver',
            key: 'approver',
            width: 120,
            render: (value, record) => renderPermissionSelect(record.fieldKey, 'approver', value),
        },
    ];

    // Tab 配置
    const tabItems = mockProcesses.map(p => ({
        key: p.key,
        label: p.name,
    }));

    return (
        <div className="perm-config-container">
            <Card className="perm-config-card">
                <div className="perm-config-header">
                    <div>
                        <Title level={4}>表单权限配置</Title>
                        <Text type="secondary">配置不同角色在各节点对表单字段的访问权限</Text>
                    </div>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            重置
                        </Button>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                            保存配置
                        </Button>
                    </Space>
                </div>

                <Tabs
                    activeKey={activeProcess}
                    onChange={setActiveProcess}
                    items={tabItems}
                    className="process-tabs"
                />

                <div className="permission-legend">
                    <Text type="secondary">权限说明：</Text>
                    <Space>
                        {permissionLevels.map(p => (
                            <Tag key={p.value} color={p.color} icon={p.icon}>
                                {p.label}
                            </Tag>
                        ))}
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={currentPermissions}
                    rowKey="fieldKey"
                    pagination={false}
                    bordered
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default PermConfig;
