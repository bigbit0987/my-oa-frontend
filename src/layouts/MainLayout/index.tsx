import { ProLayout } from '@ant-design/pro-components';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { WatermarkWrapper } from '@/components/WatermarkWrapper';
import { menuItems } from './_menu';

export default function MainLayout() {
    const location = useLocation();

    return (
        <WatermarkWrapper>
            <ProLayout
                title="OA 项目管理系统"
                layout="mix" // 混合布局模式
                fixedHeader
                route={menuItems.route}
                location={location}
                menuItemRender={(item, dom) => <Link to={item.path || '/'}>{dom}</Link>}
            // 样式 Token 需与 Tailwind 保持感官一致 (已在 App.tsx ConfigProvider 处理)
            >
                <div className="bg-slate-50 min-h-[calc(100vh-64px)] p-6">
                    <Outlet />
                </div>
            </ProLayout>
        </WatermarkWrapper>
    );
}
