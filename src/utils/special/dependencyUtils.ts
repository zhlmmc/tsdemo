/**
 * 依赖注入工具类
 */
export class DependencyUtils {
    private static container = new Map<string, any>();

    /**
     * 注册服务
     */
    static register(key: string, implementation: any): void {
        this.container.set(key, implementation);
    }

    /**
     * 获取服务
     */
    static resolve<T>(key: string): T {
        const implementation = this.container.get(key);
        if (!implementation) {
            throw new Error(`No implementation found for ${key}`);
        }
        return implementation;
    }

    /**
     * 配置注入
     */
    static injectConfig<T extends object>(target: T, config: Partial<T>): T {
        return { ...target, ...config };
    }

    /**
     * 服务模拟
     */
    static mock<T>(key: string, mockImplementation: Partial<T>): void {
        this.register(key, mockImplementation);
    }
} 