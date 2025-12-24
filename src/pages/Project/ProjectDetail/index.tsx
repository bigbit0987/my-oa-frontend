/**
 * ProjectDetail - 项目详情大屏
 * 全维度项目档案管理容器，含 Sticky Header 和多标签视图
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Spin, Button, Space, message, Breadcrumb } from 'antd';
import type { TabsProps } from 'antd';
import {
    ArrowLeftOutlined,
    DollarOutlined,
    TeamOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { getProjectDetail } from '@/services/project';
import type { Project } from '@/services/project';
import {
    VisualTimeline,
    ProjectSummary,
    FinanceView,
    TeamView,
    FilesView,
} from '../components';
import './ProjectDetail.css';

const ProjectDetail: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [isSticky, setIsSticky] = useState(false);
    const [activeTab, setActiveTab] = useState('finance');
    const headerRef = useRef<HTMLDivElement>(null);

    // 加载项目详情
    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        getProjectDetail(projectId)
            .then(data => {
                setProject(data);
            })
            .catch(err => {
                message.error('加载项目详情失败');
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [projectId]);

    // 监听滚动实现吸顶效果
    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                const rect = headerRef.current.getBoundingClientRect();
                setIsSticky(rect.top <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 返回列表
    const handleBack = () => {
        navigate('/project/list');
    };

    // Tab 配置
    const tabItems: TabsProps['items'] = [
        {
            key: 'finance',
            label: (
                <span>
                    <DollarOutlined />
                    资金合同
                </span>
            ),
            children: project && <FinanceView project={project} />,
        },
        {
            key: 'team',
            label: (
                <span>
                    <TeamOutlined />
                    团队成员
                </span>
            ),
            children: project && <TeamView project={project} />,
        },
        {
            key: 'files',
            label: (
                <span>
                    <FileTextOutlined />
                    项目文档
                </span>
            ),
            children: project && <FilesView project={project} />,
        },
        {
            key: 'settings',
            label: (
                <span>
                    <SettingOutlined />
                    项目设置
                </span>
            ),
            children: (
                <div className="settings-placeholder">
                    项目设置功能开发中...
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="project-detail-loading">
                <Spin size="large" tip="加载项目详情中..." />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-detail-error">
                <p>项目不存在或已被删除</p>
                <Button type="primary" onClick={handleBack}>
                    返回项目列表
                </Button>
            </div>
        );
    }

    return (
        <div className="project-detail-container">
            {/* 顶部导航 */}
            <div className="detail-header">
                <Space>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                    >
                        返回
                    </Button>
                    <Breadcrumb
                        items={[
                            { title: '项目中心' },
                            { title: '项目台账', href: '/project/list' },
                            { title: project.name },
                        ]}
                    />
                </Space>
            </div>

            {/* Visual Timeline 阶段进度条 */}
            <VisualTimeline phases={project.phases} />

            {/* 项目摘要卡片（可吸顶） */}
            <div ref={headerRef}>
                <ProjectSummary project={project} isSticky={isSticky} />
            </div>

            {/* 多维业务视图 Tab */}
            <div className="detail-tabs-container">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    type="card"
                    size="large"
                    className="detail-tabs"
                />
            </div>
        </div>
    );
};

export default ProjectDetail;
