/**
 * TaskHandle - 三段式任务办理页面
 * 布局: 左侧表单(80%) + 右侧时间线(20%) + 底部吸底操作栏
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, Alert, Breadcrumb, message } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { ISchema } from '@formily/react';
import {
    FormilyRenderer,
    ProcessTimeline,
    ProcessDiagram,
    ApprovalActions,
} from '../components';
import type { ApprovalRecord, ProcessNode, ApprovalParams, UserOption, NodeOption } from '../components';
import schemaService from '@/services/schema';
import './TaskHandle.css';

const { Title, Text } = Typography;

// 任务数据类型
interface TaskData {
    taskInfo: {
        id: string;
        processInstanceId: string;
        processName: string;
        taskName: string;
        taskDefinitionKey: string;
        createTime: string;
        dueDate?: string;
        assignee: {
            id: string;
            name: string;
            department?: string;
        };
    };
    formSchema: ISchema;
    processNodes: ProcessNode[];
    approvalRecords: ApprovalRecord[];
    userOptions: UserOption[];
    nodeOptions: NodeOption[];
}

const TaskHandle: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TaskData | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 加载任务数据
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                // 使用 Mock 数据 (后续替换为真实 API)
                const result = await schemaService.load<TaskData>('taskHandle');
                setData(result);
            } catch (err) {
                setError('加载任务数据失败，请稍后重试');
                console.error('加载任务失败:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [taskId]);

    // 处理审批提交
    const handleApprovalSubmit = async (params: ApprovalParams) => {
        setSubmitting(true);

        try {
            // TODO: 调用真实 API
            console.log('审批参数:', params);

            // 模拟 API 调用
            await new Promise(resolve => setTimeout(resolve, 1000));

            message.success('操作成功');
            navigate('/process/todo');
        } catch (err) {
            throw new Error('操作失败，请重试');
        } finally {
            setSubmitting(false);
        }
    };

    // 返回上一页
    const goBack = () => {
        navigate(-1);
    };

    // 加载状态
    if (loading) {
        return (
            <div className="task-handle-loading">
                <Spin size="large" tip="加载任务中..." />
            </div>
        );
    }

    // 错误状态
    if (error || !data) {
        return (
            <Alert
                type="error"
                message="加载失败"
                description={error || '未找到任务数据'}
                showIcon
                action={
                    <a onClick={goBack}>返回列表</a>
                }
            />
        );
    }

    const { taskInfo, formSchema, processNodes, approvalRecords, userOptions, nodeOptions } = data;

    return (
        <div className="task-handle-container">
            {/* 顶部导航 */}
            <div className="task-handle-header">
                <Breadcrumb
                    items={[
                        { href: '/dashboard', title: <><HomeOutlined /> 首页</> },
                        { href: '/process/todo', title: '待办任务' },
                        { title: taskInfo.taskName },
                    ]}
                />
                <div className="header-info">
                    <a onClick={goBack} className="back-link">
                        <ArrowLeftOutlined /> 返回
                    </a>
                    <Title level={4} className="task-title">
                        {taskInfo.processName} - {taskInfo.taskName}
                    </Title>
                    <Text type="secondary">
                        任务创建时间: {new Date(taskInfo.createTime).toLocaleString('zh-CN')}
                    </Text>
                </div>
            </div>

            {/* 流程进度图 */}
            <Card className="process-diagram-card" size="small">
                <ProcessDiagram
                    nodes={processNodes}
                    activeNodeId={taskInfo.taskDefinitionKey}
                    simplified
                />
            </Card>

            {/* 主体内容区 - 三段式布局 */}
            <div className="task-handle-body">
                {/* 左侧: 表单区域 (80%) */}
                <div className="form-section">
                    <Card title="表单内容" className="form-card">
                        <FormilyRenderer
                            schema={formSchema}
                            pattern="editable"
                            showSubmit={false}
                        />
                    </Card>
                </div>

                {/* 右侧: 时间线 (20%) */}
                <div className="timeline-section">
                    <Card title="审批记录" className="timeline-card" size="small">
                        <ProcessTimeline
                            records={approvalRecords}
                            showDetail
                        />
                    </Card>
                </div>
            </div>

            {/* 底部: 吸底操作栏 */}
            <ApprovalActions
                taskId={taskInfo.id}
                userOptions={userOptions}
                nodeOptions={nodeOptions}
                onSubmit={handleApprovalSubmit}
                loading={submitting}
                sticky
            />
        </div>
    );
};

export default TaskHandle;
