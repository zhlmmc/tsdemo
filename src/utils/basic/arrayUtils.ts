/**
 * 数组操作工具函数集合
 */

export class ArrayUtils {
    /**
     * 数组排序（不修改原数组）
     */
    static sort<T>(arr: T[], compareFunc?: (a: T, b: T) => number): T[] {
        if (!arr || arr.length === 0) return [];
        return [...arr].sort(compareFunc);
    }

    /**
     * 数组去重
     */
    static unique<T>(arr: T[]): T[] {
        if (!arr || arr.length === 0) return [];
        return Array.from(new Set(arr));
    }

    /**
     * 数组过滤
     */
    static filter<T>(arr: T[], predicate: (value: T) => boolean): T[] {
        if (!arr || arr.length === 0) return [];
        return arr.filter(predicate);
    }

    /**
     * 数组分块
     * 将数组按指定大小分割成多个子数组
     */
    static chunk<T>(arr: T[], size: number): T[][] {
        if (!arr || arr.length === 0 || size < 1) return [];
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    }
} 