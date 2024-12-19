/**
 * 性能相关工具类
 */
export class PerformanceUtils {
    private static cache = new Map<string, any>();

    /**
     * 函数缓存装饰器
     */
    static memoize<T>(fn: (...args: any[]) => T, keyGenerator?: (...args: any[]) => string): (...args: any[]) => T {
        return (...args: any[]) => {
            const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
            if (this.cache.has(key)) {
                return this.cache.get(key);
            }
            const result = fn(...args);
            this.cache.set(key, result);
            return result;
        };
    }

    /**
     * 防抖函数
     */
    static debounce<T extends (...args: any[]) => any>(
        fn: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let timeoutId: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    /**
     * 节流函数
     */
    static throttle<T extends (...args: any[]) => any>(
        fn: T,
        limit: number
    ): (...args: Parameters<T>) => void {
        let inThrottle = false;
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }
} 