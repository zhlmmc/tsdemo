/**
 * Collection of string manipulation utility functions
 */

export class StringUtils {
  /**
   * Reverse a string
   */
  static reverse(str: string): string {
    if (!str) return "";
    return str.split("").reverse().join("");
  }

  /**
   * Slice a string, supports negative indices
   */
  static slice(str: string, start: number, end?: number): string {
    if (!str) return "";
    return str.slice(start, end);
  }

  /**
   * Check if a string matches a specified pattern
   */
  static matchPattern(str: string, pattern: RegExp): boolean {
    if (!str || !pattern) return false;
    return pattern.test(str);
  }

  /**
   * Convert a string to camel case
   */
  static toCamelCase(str: string): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase());
  }
}
