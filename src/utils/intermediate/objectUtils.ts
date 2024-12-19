/**
 * 对象处理工具函数集合
 */
export class ObjectUtils {
    /**
     * 深拷贝对象
     */
    static deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime()) as any;
        }

        if (obj instanceof RegExp) {
            return new RegExp(obj) as any;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.deepClone(item)) as any;
        }

        const cloned = {} as T;
        Object.keys(obj as object).forEach(key => {
            cloned[key as keyof T] = this.deepClone((obj as any)[key]);
        });

        return cloned;
    }

    /**
     * 验证对象属性
     * @param obj 要验证的对象
     * @param schema 验证模式
     */
    static validateObject(obj: any, schema: Record<string, {
        type: string;
        required?: boolean;
        pattern?: RegExp;
        min?: number;
        max?: number;
    }>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        Object.keys(schema).forEach(key => {
            const rule = schema[key];
            const value = obj[key];

            // 检查必填属性
            if (rule.required && (value === undefined || value === null)) {
                errors.push(`${key} is required`);
                return;
            }

            if (value === undefined || value === null) {
                return;
            }

            // 检查类型
            if (typeof value !== rule.type) {
                errors.push(`${key} should be of type ${rule.type}`);
            }

            // 检查正则表达式
            if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
                errors.push(`${key} does not match required pattern`);
            }

            // 检查数值范围
            if (rule.type === 'number') {
                if (rule.min !== undefined && value < rule.min) {
                    errors.push(`${key} should be greater than or equal to ${rule.min}`);
                }
                if (rule.max !== undefined && value > rule.max) {
                    errors.push(`${key} should be less than or equal to ${rule.max}`);
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 合并对象（深度合并）
     */
    static merge<T extends object>(target: T, source: Partial<T>): T {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (this.isObject(source[key as keyof T])) {
                    if (!target[key as keyof T]) {
                        Object.assign(target, { [key]: {} });
                    }
                    this.merge(
                        target[key as keyof T] as object, 
                        source[key as keyof T] as object
                    );
                } else {
                    Object.assign(target, { [key]: source[key as keyof T] });
                }
            }
        }
        return target;
    }

    private static isObject(item: any): item is object {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
} 