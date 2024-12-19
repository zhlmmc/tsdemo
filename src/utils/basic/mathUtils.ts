/**
 * 基础数学运算函数集合
 */

export class MathUtils {
    /**
     * 计算两个数的和
     */
    static add(a: number, b: number): number {
        return a + b;
    }

    /**
     * 计算数组的总和
     */
    static sum(numbers: number[]): number {
        if (!numbers || numbers.length === 0) {
            return 0;
        }
        return numbers.reduce((acc, curr) => acc + curr, 0);
    }

    /**
     * 计算数组的平均值
     */
    static average(numbers: number[]): number {
        if (!numbers || numbers.length === 0) {
            return 0;
        }
        return this.sum(numbers) / numbers.length;
    }

    /**
     * 找出数组中的最大值
     */
    static findMax(numbers: number[]): number | null {
        if (!numbers || numbers.length === 0) {
            return null;
        }
        return Math.max(...numbers);
    }

    /**
     * 找出数组中的最小值
     */
    static findMin(numbers: number[]): number | null {
        if (!numbers || numbers.length === 0) {
            return null;
        }
        return Math.min(...numbers);
    }
} 