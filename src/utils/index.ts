/**
 * 通用工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, format: 'date' | 'datetime' | 'time' = 'datetime'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        return '-';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    switch (format) {
        case 'date':
            return `${year}-${month}-${day}`;
        case 'time':
            return `${hours}:${minutes}:${seconds}`;
        case 'datetime':
        default:
            return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化金额
 */
export function formatMoney(amount: number, options?: {
    unit?: '元' | '万' | '亿';
    decimals?: number;
    showUnit?: boolean;
}): string {
    const { unit = '元', decimals = 2, showUnit = true } = options || {};

    let value = amount;
    if (unit === '万') {
        value = amount / 10000;
    } else if (unit === '亿') {
        value = amount / 100000000;
    }

    const formatted = value.toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return showUnit ? `${formatted}${unit}` : formatted;
}

/**
 * 计算剩余天数
 */
export function getRemainingDays(endDate: string | Date): number {
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (this: unknown, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: unknown[]) => void>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return function (this: unknown, ...args: Parameters<T>) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as T;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item)) as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * 生成唯一 ID
 */
export function generateId(prefix: string = 'id'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 下载文件
 */
export function downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    }
}

/**
 * 检查是否为空值
 */
export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
}

/**
 * 树形数据扁平化
 */
export function flattenTree<T extends { children?: T[] }>(
    tree: T[],
    childrenKey: keyof T = 'children' as keyof T
): Omit<T, 'children'>[] {
    const result: Omit<T, 'children'>[] = [];

    function traverse(nodes: T[]) {
        for (const node of nodes) {
            const { [childrenKey]: children, ...rest } = node;
            result.push(rest as Omit<T, 'children'>);
            if (children && Array.isArray(children)) {
                traverse(children as T[]);
            }
        }
    }

    traverse(tree);
    return result;
}
