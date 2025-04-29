/**
 * Collection of array manipulation utility functions
 */

export class ArrayUtils {
  /**
   * Sort an array (does not modify the original array)
   */
  static sort<T>(arr: T[], compareFunc?: (a: T, b: T) => number): T[] {
    if (!arr || arr.length === 0) return [];
    return [...arr].sort(compareFunc);
  }

  /**
   * Remove duplicates from an array
   */
  static unique<T>(arr: T[]): T[] {
    if (!arr || arr.length === 0) return [];
    return Array.from(new Set(arr));
  }

  /**
   * Filter an array
   */
  static filter<T>(arr: T[], predicate: (value: T) => boolean): T[] {
    if (!arr || arr.length === 0) return [];
    return arr.filter(predicate);
  }

  /**
   * Split an array into chunks
   * Divides an array into subarrays of specified size
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
