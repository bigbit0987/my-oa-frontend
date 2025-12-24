/**
 * Schema 服务 - 双模式加载策略
 * 支持本地 Mock 和远程 API 两种数据源
 */

// 定义 Schema 类型
export interface SchemaConfig {
    type: 'local' | 'remote';
    baseUrl?: string;
}

// 默认配置：开发环境使用本地 Mock
const defaultConfig: SchemaConfig = {
    type: import.meta.env.DEV ? 'local' : 'remote',
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
};

// Schema 加载服务
class SchemaService {
    private config: SchemaConfig;
    private cache: Map<string, unknown> = new Map();

    constructor(config: SchemaConfig = defaultConfig) {
        this.config = config;
    }

    /**
     * 加载 Schema 数据
     * @param schemaName Schema 名称 (与 mocks/ 目录下的文件名对应)
     */
    async load<T>(schemaName: string): Promise<T> {
        // 检查缓存
        if (this.cache.has(schemaName)) {
            return this.cache.get(schemaName) as T;
        }

        let data: T;

        if (this.config.type === 'local') {
            // 本地模式：从 mocks 目录加载
            try {
                const module = await import(`../mocks/${schemaName}.json`);
                data = module.default as T;
            } catch {
                console.warn(`[Schema] 本地文件 mocks/${schemaName}.json 不存在，尝试远程加载...`);
                data = await this.loadRemote<T>(schemaName);
            }
        } else {
            // 远程模式：从 API 加载
            data = await this.loadRemote<T>(schemaName);
        }

        // 缓存结果
        this.cache.set(schemaName, data);
        return data;
    }

    /**
     * 远程加载 Schema
     */
    private async loadRemote<T>(schemaName: string): Promise<T> {
        const response = await fetch(`${this.config.baseUrl}/schema/${schemaName}`);
        if (!response.ok) {
            throw new Error(`[Schema] 加载失败: ${schemaName}`);
        }
        return response.json();
    }

    /**
     * 清除缓存
     */
    clearCache(schemaName?: string) {
        if (schemaName) {
            this.cache.delete(schemaName);
        } else {
            this.cache.clear();
        }
    }

    /**
     * 切换配置模式
     */
    setConfig(config: Partial<SchemaConfig>) {
        this.config = { ...this.config, ...config };
        this.cache.clear(); // 切换模式时清空缓存
    }
}

// 导出单例
export const schemaService = new SchemaService();
export default schemaService;
