/**
 * FormilyRenderer - Formily 表单渲染引擎
 * 支持从 JSON Schema 动态渲染表单
 * - 自动注册 AntD 组件库
 * - 支持 readPretty 只读模式
 * - 支持表单验证与提交
 */
import React, { useMemo, useEffect } from 'react';
import { createForm } from '@formily/core';
import type { Form, IFormProps } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import {
    FormItem,
    FormLayout,
    FormGrid,
    Input,
    Select,
    DatePicker,
    NumberPicker,
    Checkbox,
    Radio,
    Switch,
    Upload,
    ArrayTable,
    ArrayCards,
    Cascader,
    TreeSelect,
    TimePicker,
    Transfer,
    Password,
    FormTab,
    FormCollapse,
    FormButtonGroup,
    Submit,
    Reset,
    Space,
} from '@formily/antd-v5';
import { Card, Spin, Empty, Alert } from 'antd';
import type { ISchema } from '@formily/react';
import './FormilyRenderer.css';

// 创建 SchemaField，注册所有可用组件
const SchemaField = createSchemaField({
    components: {
        FormItem,
        FormLayout,
        FormGrid,
        Input,
        'Input.TextArea': Input.TextArea,
        Select,
        DatePicker,
        'DatePicker.RangePicker': DatePicker.RangePicker,
        NumberPicker,
        Checkbox,
        'Checkbox.Group': Checkbox.Group,
        Radio,
        'Radio.Group': Radio.Group,
        Switch,
        Upload,
        ArrayTable,
        ArrayCards,
        Cascader,
        TreeSelect,
        TimePicker,
        Transfer,
        Password,
        FormTab,
        'FormTab.TabPane': FormTab.TabPane,
        FormCollapse,
        'FormCollapse.CollapsePanel': FormCollapse.CollapsePanel,
        FormButtonGroup,
        Submit,
        Reset,
        Space,
        Card,
    },
});

// 表单模式
export type FormPattern = 'editable' | 'readPretty' | 'disabled';

// 组件属性
export interface FormilyRendererProps {
    /** JSON Schema 定义 */
    schema: ISchema;
    /** 表单初始值 */
    initialValues?: Record<string, unknown>;
    /** 表单模式: editable | readPretty | disabled */
    pattern?: FormPattern;
    /** 表单实例 (外部控制) */
    form?: Form;
    /** 表单配置 */
    formProps?: IFormProps;
    /** 加载中状态 */
    loading?: boolean;
    /** 错误信息 */
    error?: string | null;
    /** 值变化回调 */
    onValuesChange?: (values: Record<string, unknown>) => void;
    /** 表单提交回调 */
    onSubmit?: (values: Record<string, unknown>) => void;
    /** 是否显示提交按钮 */
    showSubmit?: boolean;
    /** 提交按钮文字 */
    submitText?: string;
    /** 类名 */
    className?: string;
}

const FormilyRenderer: React.FC<FormilyRendererProps> = ({
    schema,
    initialValues = {},
    pattern = 'editable',
    form: externalForm,
    formProps = {},
    loading = false,
    error = null,
    onValuesChange,
    onSubmit,
    showSubmit = false,
    submitText = '提交',
    className = '',
}) => {
    // 创建或使用外部传入的表单实例
    const form = useMemo(() => {
        if (externalForm) return externalForm;

        return createForm({
            initialValues,
            ...formProps,
        });
    }, [externalForm, formProps]);

    // 设置表单模式
    useEffect(() => {
        if (pattern === 'readPretty') {
            form.setPattern('readPretty');
        } else if (pattern === 'disabled') {
            form.setPattern('disabled');
        } else {
            form.setPattern('editable');
        }
    }, [form, pattern]);

    // 监听值变化
    useEffect(() => {
        if (!onValuesChange) return;

        const dispose = form.subscribe(({ type }) => {
            if (type === 'ON_FORM_VALUES_CHANGE') {
                onValuesChange(form.values);
            }
        });

        return () => { dispose; };
    }, [form, onValuesChange]);

    // 处理提交
    const handleSubmit = async () => {
        try {
            await form.validate();
            const values = form.values;
            onSubmit?.(values);
        } catch (err) {
            console.error('表单验证失败:', err);
        }
    };

    // 加载状态
    if (loading) {
        return (
            <div className="formily-loading">
                <Spin size="large" tip="加载表单中..." />
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <Alert
                type="error"
                message="表单加载失败"
                description={error}
                showIcon
            />
        );
    }

    // Schema 为空
    if (!schema || Object.keys(schema).length === 0) {
        return <Empty description="暂无表单配置" />;
    }

    return (
        <div className={`formily-renderer ${className}`}>
            <FormProvider form={form}>
                <FormLayout
                    layout="vertical"
                    labelCol={6}
                    wrapperCol={18}
                    labelAlign="left"
                    size="default"
                >
                    <SchemaField schema={schema} />

                    {showSubmit && pattern === 'editable' && (
                        <FormButtonGroup.Sticky align="center">
                            <Submit onClick={handleSubmit}>{submitText}</Submit>
                            <Reset>重置</Reset>
                        </FormButtonGroup.Sticky>
                    )}
                </FormLayout>
            </FormProvider>
        </div>
    );
};

export default FormilyRenderer;
