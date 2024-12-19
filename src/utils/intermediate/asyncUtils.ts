/**
 * 异步操作工具函数集合
 */
export class AsyncUtils {
    /**
     * 延迟执行
     */
    static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 带重试机制的异步操作
     */
    static async retry<T>(
        fn: () => Promise<T>,
        options: {
            maxAttempts: number;
            delay: number;
            backoff?: number;
        }
    ): Promise<T> {
        let attempts = 0;
        let currentDelay = options.delay;

        while (attempts < options.maxAttempts) {
            try {
                return await fn();
            } catch (error) {
                attempts++;
                if (attempts === options.maxAttempts) {
                    throw error;
                }
                await this.delay(currentDelay);
                if (options.backoff) {
                    currentDelay *= options.backoff;
                }
            }
        }

        throw new Error('Retry failed');
    }

    /**
     * 并发控制
     */
    static async concurrent<T>(
        tasks: (() => Promise<T>)[],
        concurrency: number
    ): Promise<T[]> {
        const results: T[] = [];
        const executing: Promise<void>[] = [];

        for (let i = 0; i < tasks.length; i++) {
            const p = tasks[i]().then(result => {
                results[i] = result;
            });

            executing.push(p);

            if (executing.length >= concurrency) {
                await Promise.race(executing);
                executing.splice(0, executing.length);
            }
        }

        await Promise.all(executing);
        return results;
    }
} 