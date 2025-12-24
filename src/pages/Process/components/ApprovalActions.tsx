/**
 * ApprovalActions - 审批操作组件
 * 支持：同意、驳回、转办、加签
 * 包含常用审批意见模板
 */
import React, { useState } from 'react';
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    Radio,
    Space,
    Tag,
    message,
    Popconfirm,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SendOutlined,
    UserAddOutlined,
    RollbackOutlined,
} from '@ant-design/icons';
import './ApprovalActions.css';

const { TextArea } = Input;
const { Option } = Select;

// 审批动作类型
export type ActionType = 'approve' | 'reject' | 'forward' | 'countersign' | 'withdraw';

// 审批参数
export interface ApprovalParams {
    action: ActionType;
    comment: string;
    targetUsers?: string[];  // 转办/加签目标用户
    rejectToNode?: string;   // 驳回到指定节点
}

// 用户信息 (用于转办/加签)
export interface UserOption {
    id: string;
    name: string;
    department?: string;
}

// 节点信息 (用于驳回)
export interface NodeOption {
    id: string;
    name: string;
}

interface ApprovalActionsProps {
    /** 当前任务 ID */
    taskId: string;
    /** 可转办/加签的用户列表 */
    userOptions?: UserOption[];
    /** 可驳回的节点列表 */
    nodeOptions?: NodeOption[];
    /** 是否允许撤回 */
    allowWithdraw?: boolean;
    /** 提交回调 */
    onSubmit: (params: ApprovalParams) => Promise<void>;
    /** 加载状态 */
    loading?: boolean;
    /** 是否固定在底部 */
    sticky?: boolean;
}

// 常用审批意见模板
const commentTemplates = [
    { label: '同意', value: '同意', type: 'approve' },
    { label: '已审核，同意', value: '已审核，同意。', type: 'approve' },
    { label: '情况属实，同意办理', value: '情况属实，同意办理。', type: 'approve' },
    { label: '符合规定，同意', value: '符合规定，同意。', type: 'approve' },
    { label: '不同意', value: '不同意', type: 'reject' },
    { label: '请补充材料', value: '材料不完整，请补充后重新提交。', type: 'reject' },
    { label: '请修改后重新提交', value: '存在问题，请修改后重新提交。', type: 'reject' },
];

const ApprovalActions: React.FC<ApprovalActionsProps> = ({
    taskId: _taskId,
    userOptions = [],
    nodeOptions = [],
    allowWithdraw = false,
    onSubmit,
    loading = false,
    sticky = true,
}) => {
    // 预留 _taskId 用于后续 API 调用
    void _taskId;

    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 打开操作弹窗
    const openModal = (action: ActionType) => {
        setCurrentAction(action);
        setModalVisible(true);
        form.resetFields();

        // 设置默认意见
        if (action === 'approve') {
            form.setFieldValue('comment', '同意');
        }
    };

    // 关闭弹窗
    const closeModal = () => {
        setModalVisible(false);
        setCurrentAction(null);
        form.resetFields();
    };

    // 使用模板意见
    const useTemplate = (template: string) => {
        form.setFieldValue('comment', template);
    };

    // 提交审批
    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();

            setSubmitting(true);

            await onSubmit({
                action: currentAction!,
                comment: values.comment,
                targetUsers: values.targetUsers,
                rejectToNode: values.rejectToNode,
            });

            message.success(getSuccessMessage(currentAction!));
            closeModal();
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // 获取成功消息
    const getSuccessMessage = (action: ActionType): string => {
        const messages: Record<ActionType, string> = {
            approve: '审批通过成功',
            reject: '已驳回',
            forward: '转办成功',
            countersign: '加签成功',
            withdraw: '已撤回',
        };
        return messages[action];
    };

    // 获取弹窗标题
    const getModalTitle = (): string => {
        const titles: Record<ActionType, string> = {
            approve: '审批通过',
            reject: '驳回申请',
            forward: '转办任务',
            countersign: '加签审批',
            withdraw: '撤回申请',
        };
        return titles[currentAction!] || '审批操作';
    };

    // 渲染弹窗内容
    const renderModalContent = () => {
        const isApproveOrReject = currentAction === 'approve' || currentAction === 'reject';
        const needsUserSelect = currentAction === 'forward' || currentAction === 'countersign';
        const needsNodeSelect = currentAction === 'reject';

        // 筛选对应类型的模板
        const filteredTemplates = commentTemplates.filter(
            t => t.type === currentAction || (currentAction === 'forward' && t.type === 'approve')
        );

        return (
            <Form form={form} layout="vertical">
                {/* 常用意见模板 */}
                {isApproveOrReject && filteredTemplates.length > 0 && (
                    <Form.Item label="常用意见">
                        <Space wrap>
                            {filteredTemplates.map((t, i) => (
                                <Tag
                                    key={i}
                                    className="template-tag"
                                    onClick={() => useTemplate(t.value)}
                                >
                                    {t.label}
                                </Tag>
                            ))}
                        </Space>
                    </Form.Item>
                )}

                {/* 审批意见 */}
                <Form.Item
                    name="comment"
                    label="审批意见"
                    rules={[
                        { required: true, message: '请输入审批意见' },
                        { min: 2, message: '审批意见至少2个字符' },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="请输入审批意见..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                {/* 驳回到指定节点 */}
                {needsNodeSelect && nodeOptions.length > 0 && (
                    <Form.Item
                        name="rejectToNode"
                        label="驳回至"
                        rules={[{ required: true, message: '请选择驳回节点' }]}
                    >
                        <Radio.Group className="reject-node-group">
                            <Space direction="vertical">
                                {nodeOptions.map(node => (
                                    <Radio key={node.id} value={node.id}>
                                        {node.name}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                )}

                {/* 选择转办/加签用户 */}
                {needsUserSelect && (
                    <Form.Item
                        name="targetUsers"
                        label={currentAction === 'forward' ? '转办给' : '加签审批人'}
                        rules={[{ required: true, message: '请选择用户' }]}
                    >
                        <Select
                            mode={currentAction === 'countersign' ? 'multiple' : undefined}
                            placeholder="请选择用户"
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {userOptions.map(user => (
                                <Option key={user.id} value={user.id}>
                                    {user.name}
                                    {user.department && <span className="user-dept"> - {user.department}</span>}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Form>
        );
    };

    return (
        <>
            <div className={`approval-actions ${sticky ? 'sticky' : ''}`}>
                <div className="actions-left">
                    {/* 同意 */}
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => openModal('approve')}
                        loading={loading}
                        className="action-btn approve"
                    >
                        同意
                    </Button>

                    {/* 驳回 */}
                    <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => openModal('reject')}
                        loading={loading}
                        className="action-btn reject"
                    >
                        驳回
                    </Button>
                </div>

                <div className="actions-right">
                    {/* 转办 */}
                    <Button
                        icon={<SendOutlined />}
                        onClick={() => openModal('forward')}
                        loading={loading}
                        className="action-btn"
                    >
                        转办
                    </Button>

                    {/* 加签 */}
                    <Button
                        icon={<UserAddOutlined />}
                        onClick={() => openModal('countersign')}
                        loading={loading}
                        className="action-btn"
                    >
                        加签
                    </Button>

                    {/* 撤回 */}
                    {allowWithdraw && (
                        <Popconfirm
                            title="确认撤回"
                            description="撤回后需要重新提交申请，确定要撤回吗？"
                            onConfirm={() => onSubmit({ action: 'withdraw', comment: '申请人撤回' })}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button
                                icon={<RollbackOutlined />}
                                loading={loading}
                                className="action-btn"
                            >
                                撤回
                            </Button>
                        </Popconfirm>
                    )}
                </div>
            </div>

            {/* 操作弹窗 */}
            <Modal
                title={getModalTitle()}
                open={modalVisible}
                onCancel={closeModal}
                onOk={handleSubmit}
                okText="确认提交"
                cancelText="取消"
                confirmLoading={submitting}
                destroyOnClose
                width={520}
            >
                {renderModalContent()}
            </Modal>
        </>
    );
};

export default ApprovalActions;
