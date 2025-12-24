import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff', // 文档定义的科技蓝
          borderRadius: 8,         // Bento 布局建议圆角
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
