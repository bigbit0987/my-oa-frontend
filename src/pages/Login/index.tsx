/**
 * Login - 登录页面
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Card, Typography, Space, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { login } from '@/services/auth';
import { useUserStore } from '@/stores/userStore';
import './Login.css';

const { Title, Text, Link } = Typography;

interface LoginFormValues {
    username: string;
    password: string;
    remember: boolean;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const setUser = useUserStore(state => state.setUser);

    const handleSubmit = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const result = await login({
                username: values.username,
                password: values.password,
            });

            // 保存用户信息和 Token
            setUser({
                token: result.token,
                name: result.user.name,
                avatar: result.user.avatar,
                roles: result.user.roles,
            });

            message.success(`欢迎回来，${result.user.name}！`);
            navigate('/dashboard');
        } catch (error) {
            message.error((error as Error).message || '登录失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="login-card" bordered={false}>
            {/* Logo 和标题 */}
            <div className="login-header">
                <div className="login-logo">
                    <SafetyOutlined />
                </div>
                <Title level={3} className="login-title">OA 项目管理系统</Title>
                <Text type="secondary">企业级项目管理与流程审批平台</Text>
            </div>

            <Divider />

            {/* 登录表单 */}
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                size="large"
                className="login-form"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="用户名"
                        autoComplete="username"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="密码"
                        autoComplete="current-password"
                    />
                </Form.Item>

                <Form.Item>
                    <div className="login-options">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>
                        <Link href="#">忘记密码?</Link>
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        className="login-button"
                    >
                        登录
                    </Button>
                </Form.Item>
            </Form>

            {/* 提示信息 */}
            <div className="login-tips">
                <Text type="secondary">
                    演示账号：admin / admin123
                </Text>
            </div>
        </Card>
    );
};

export default Login;
