/**
 * AuthLayout - 登录页布局
 * 无侧边栏的全屏布局，用于登录、注册等认证相关页面
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import './AuthLayout.css';

const AuthLayout: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 8,
                },
            }}
        >
            <div className="auth-layout">
                {/* 背景装饰 */}
                <div className="auth-background">
                    <div className="bg-shape bg-shape-1" />
                    <div className="bg-shape bg-shape-2" />
                    <div className="bg-shape bg-shape-3" />
                </div>

                {/* 内容区域 */}
                <div className="auth-content">
                    <Outlet />
                </div>

                {/* 底部版权信息 */}
                <footer className="auth-footer">
                    <span>© 2024 OA Project Management System. All rights reserved.</span>
                </footer>
            </div>
        </ConfigProvider>
    );
};

export default AuthLayout;
