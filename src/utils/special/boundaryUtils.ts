/**
 * 边界条件处理工具类
 */
export class BoundaryUtils {
    /**
     * 安全访问对象属性
     */
    static safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue: T[K]): T[K] {
        if (!obj) return defaultValue;
        return obj[key] ?? defaultValue;
    }

    /**
     * 空值合并
     */
    static coalesce<T>(...args: (T | null | undefined)[]): T | null {
        for (const arg of args) {
            if (arg !== null && arg !== undefined) {
                return arg;
            }
        }
        return null;
    }

    /**
     * 安全数字转换
     */
    static toNumber(value: any, defaultValue: number = 0): number {
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
    }
} 