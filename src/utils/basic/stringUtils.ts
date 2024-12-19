/**
 * 字符串处理工具函数集合
 */

export class StringUtils {
    /**
     * 反转字符串
     */
    static reverse(str: string): string {
        if (!str) return '';
        return str.split('').reverse().join('');
    }

    /**
     * 截取字符串，支持负数索引
     */
    static slice(str: string, start: number, end?: number): string {
        if (!str) return '';
        return str.slice(start, end);
    }

    /**
     * 检查字符串是否匹配指定模式
     */
    static matchPattern(str: string, pattern: RegExp): boolean {
        if (!str || !pattern) return false;
        return pattern.test(str);
    }

    /**
     * 将字符串转换为驼峰命名
     */
    static toCamelCase(str: string): string {
        if (!str) return '';
        return str.toLowerCase()
            .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase());
    }
} 