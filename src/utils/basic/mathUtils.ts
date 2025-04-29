/**
 * Collection of basic mathematical operation functions
 */

export class MathUtils {
  /**
   * Calculate the sum of two numbers
   */
  static add(a: number, b: number): number {
    return a + b;
  }

  /**
   * Calculate the sum of an array of numbers
   */
  static sum(numbers: number[]): number {
    if (!numbers || numbers.length === 0) {
      return 0;
    }
    return numbers.reduce((acc, curr) => acc + curr, 0);
  }

  /**
   * Calculate the average of an array of numbers
   */
  static average(numbers: number[]): number {
    if (!numbers || numbers.length === 0) {
      return 0;
    }
    return this.sum(numbers) / numbers.length;
  }

  /**
   * Find the maximum value in an array
   */
  static findMax(numbers: number[]): number | null {
    if (!numbers || numbers.length === 0) {
      return null;
    }
    return Math.max(...numbers);
  }

  /**
   * Find the minimum value in an array
   */
  static findMin(numbers: number[]): number | null {
    if (!numbers || numbers.length === 0) {
      return null;
    }
    return Math.min(...numbers);
  }
}
