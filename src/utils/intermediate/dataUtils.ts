/**
 * Collection of data conversion utility functions
 */
export class DataUtils {
  /**
   * Date formatting
   */
  static formatDate(date: Date, format: string): string {
    const map: Record<string, number | string> = {
      yyyy: date.getFullYear(),
      MM: String(date.getMonth() + 1).padStart(2, "0"),
      dd: String(date.getDate()).padStart(2, "0"),
      HH: String(date.getHours()).padStart(2, "0"),
      mm: String(date.getMinutes()).padStart(2, "0"),
      ss: String(date.getSeconds()).padStart(2, "0"),
    };

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (matched) =>
      String(map[matched]),
    );
  }

  /**
   * Data type conversion
   */
  static convert<T>(
    value: any,
    type: "number" | "string" | "boolean" | "date",
  ): T {
    switch (type) {
      case "number":
        return Number(value) as T;
      case "string":
        return String(value) as T;
      case "boolean":
        return Boolean(value) as T;
      case "date":
        return new Date(value) as T;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  /**
   * Safe JSON string parsing
   */
  static safeParseJSON<T>(json: string, defaultValue: T): T {
    try {
      return JSON.parse(json) as T;
    } catch {
      return defaultValue;
    }
  }
}
