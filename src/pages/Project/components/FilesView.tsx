/**
 * FilesView - 附件聚合柜
 * 按阶段自动归档的文件管理视图
 */
import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, Select, Typography, Empty, Tooltip, Badge, Collapse } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    FileTextOutlined,
    FilePdfOutlined,
    FileImageOutlined,
    FileExcelOutlined,
    FileWordOutlined,
    FolderOutlined,
    DownloadOutlined,
    EyeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import type { Project, ProjectFile } from '@/services/project';
import './FilesView.css';

const { Text, Title } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

interface FilesViewProps {
    project: Project;
}

// 文件类型图标配置
const fileIconConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    '文档': { icon: <FileTextOutlined />, color: '#1890ff' },
    '设计': { icon: <FileWordOutlined />, color: '#722ed1' },
    'PDF': { icon: <FilePdfOutlined />, color: '#fa541c' },
    '图片': { icon: <FileImageOutlined />, color: '#52c41a' },
    '表格': { icon: <FileExcelOutlined />, color: '#13c2c2' },
    'default': { icon: <FileTextOutlined />, color: '#8c8c8c' },
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FilesView: React.FC<FilesViewProps> = ({ project }) => {
    const [searchText, setSearchText] = useState('');
    const [filterPhase, setFilterPhase] = useState<string | undefined>(undefined);
    const [filterType, setFilterType] = useState<string | undefined>(undefined);

    // 按阶段分组文件
    const filesByPhase: Record<string, ProjectFile[]> = {};
    project.files.forEach(file => {
        if (!filesByPhase[file.phase]) {
            filesByPhase[file.phase] = [];
        }
        filesByPhase[file.phase].push(file);
    });

    // 过滤文件
    const getFilteredFiles = () => {
        return project.files.filter(file => {
            const matchSearch = !searchText || file.name.toLowerCase().includes(searchText.toLowerCase());
            const matchPhase = !filterPhase || file.phase === filterPhase;
            const matchType = !filterType || file.type === filterType;
            return matchSearch && matchPhase && matchType;
        });
    };

    const filteredFiles = getFilteredFiles();

    // 获取文件图标
    const getFileIcon = (type: string) => {
        const config = fileIconConfig[type] || fileIconConfig['default'];
        return <span style={{ color: config.color, fontSize: 18 }}>{config.icon}</span>;
    };

    // 表格列定义
    const columns: ColumnsType<ProjectFile> = [
        {
            title: '文件名',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <Space>
                    {getFileIcon(record.type)}
                    <Text strong className="file-name">{name}</Text>
                </Space>
            ),
        },
        {
            title: '所属阶段',
            dataIndex: 'phase',
            key: 'phase',
            width: 120,
            render: (phase) => <Tag color="blue">{phase}</Tag>,
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (type) => <Tag>{type}</Tag>,
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            width: 100,
            render: (size) => <Text type="secondary">{formatFileSize(size)}</Text>,
        },
        {
            title: '上传时间',
            dataIndex: 'uploadTime',
            key: 'uploadTime',
            width: 110,
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: () => (
                <Space>
                    <Tooltip title="预览">
                        <Button type="text" icon={<EyeOutlined />} size="small" />
                    </Tooltip>
                    <Tooltip title="下载">
                        <Button type="text" icon={<DownloadOutlined />} size="small" />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // 获取阶段列表（用于筛选）
    const phases = Object.keys(filesByPhase);
    const fileTypes = [...new Set(project.files.map(f => f.type))];

    // 渲染按阶段分组的折叠面板
    const renderPhaseGroups = () => {
        return (
            <Collapse
                defaultActiveKey={phases.slice(0, 2)}
                className="phase-collapse"
                expandIconPosition="end"
            >
                {phases.map(phase => (
                    <Panel
                        key={phase}
                        header={
                            <div className="phase-header">
                                <FolderOutlined />
                                <span>{phase}</span>
                                <Badge count={filesByPhase[phase].length} style={{ backgroundColor: '#1890ff' }} />
                            </div>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={filesByPhase[phase]}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Panel>
                ))}
            </Collapse>
        );
    };

    return (
        <div className="files-view">
            {/* 顶部统计和筛选 */}
            <Card className="files-header-card">
                <div className="files-header">
                    <div className="files-stats">
                        <Title level={5}>
                            <FileTextOutlined /> 项目文档
                        </Title>
                        <Space size="large">
                            <Text>
                                共 <Text strong style={{ color: '#1890ff' }}>{project.fileCount}</Text> 个文件
                            </Text>
                            <Text type="secondary">
                                {phases.length} 个阶段
                            </Text>
                        </Space>
                    </div>
                    <div className="files-filter">
                        <Space>
                            <Search
                                placeholder="搜索文件名"
                                allowClear
                                onSearch={setSearchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 200 }}
                                prefix={<SearchOutlined />}
                            />
                            <Select
                                placeholder="所属阶段"
                                allowClear
                                style={{ width: 120 }}
                                onChange={setFilterPhase}
                                options={phases.map(p => ({ label: p, value: p }))}
                            />
                            <Select
                                placeholder="文件类型"
                                allowClear
                                style={{ width: 100 }}
                                onChange={setFilterType}
                                options={fileTypes.map(t => ({ label: t, value: t }))}
                            />
                        </Space>
                    </div>
                </div>
            </Card>

            {/* 文件内容 */}
            <Card className="files-content-card">
                {project.files.length > 0 ? (
                    filterPhase || filterType || searchText ? (
                        // 有筛选条件时显示列表视图
                        <Table
                            columns={columns}
                            dataSource={filteredFiles}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    ) : (
                        // 无筛选条件时按阶段分组显示
                        renderPhaseGroups()
                    )
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无项目文档"
                    />
                )}
            </Card>
        </div>
    );
};

export default FilesView;
