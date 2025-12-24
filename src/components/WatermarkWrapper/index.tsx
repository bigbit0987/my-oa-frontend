import { Watermark } from 'antd';
import React from 'react';

// 根据 ADR-006 Phase 1 规划，实现全局防泄密水印
export const WatermarkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Watermark
            content="张大工 8888" // 动态获取：姓名 + 手机后4位
            font={{ color: 'rgba(0,0,0,0.05)' }}
            gap={[120, 120]}
        >
            {children}
        </Watermark>
    );
};
