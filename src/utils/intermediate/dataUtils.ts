/**
 * 数据转换工具函数集合
 */
export class DataUtils {
    /**
     * 日期格式化
     */
    static formatDate(date: Date, format: string): string {
        const map: Record<string, number | string> = {
            'yyyy': date.getFullYear(),
            'MM': String(date.getMonth() + 1).padStart(2, '0'),
            'dd': String(date.getDate()).padStart(2, '0'),
            'HH': String(date.getHours()).padStart(2, '0'),
            'mm': String(date.getMinutes()).padStart(2, '0'),
            'ss': String(date.getSeconds()).padStart(2, '0')
        };

        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, matched => String(map[matched]));
    }

    /**
     * 数据类型转换
     */
    static convert<T>(
        value: any,
        type: 'number' | 'string' | 'boolean' | 'date'
    ): T {
        switch (type) {
            case 'number':
                return Number(value) as T;
            case 'string':
                return String(value) as T;
            case 'boolean':
                return Boolean(value) as T;
            case 'date':
                return new Date(value) as T;
            default:
                throw new Error(`Unsupported type: ${type}`);
        }
    }

    /**
     * JSON字符串安全解析
     */
    static safeParseJSON<T>(json: string, defaultValue: T): T {
        try {
            return JSON.parse(json) as T;
        } catch {
            return defaultValue;
        }
    }
} 