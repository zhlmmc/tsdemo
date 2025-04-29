/**
 * Boundary condition handling utility class
 */
export class BoundaryUtils {
  /**
   * Safe object property access
   */
  static safeGet<T, K extends keyof T>(
    obj: T | null | undefined,
    key: K,
    defaultValue: T[K],
  ): T[K] {
    if (!obj) return defaultValue;
    return obj[key] ?? defaultValue;
  }

  /**
   * Null coalescing
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
   * Safe number conversion
   */
  static toNumber(value: any, defaultValue: number = 0): number {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }
}
