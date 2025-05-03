import { describe, it, expect } from "vitest";
import { DataUtils } from "./dataUtils";

describe("DataUtils", () => {
  describe("formatDate", () => {
    it("should format date correctly with full format", () => {
      const date = new Date(2025, 4, 15, 9, 30, 45);
      const result = DataUtils.formatDate(date, "yyyy-MM-dd HH:mm:ss");
      expect(result).toBe("2025-05-15 09:30:45");
    });

    it("should format date with partial format", () => {
      const date = new Date(2025, 4, 15);
      const result = DataUtils.formatDate(date, "yyyy/MM/dd");
      expect(result).toBe("2025/05/15");
    });

    it("should handle single digit months and days", () => {
      const date = new Date(2025, 0, 5);
      const result = DataUtils.formatDate(date, "yyyy-MM-dd");
      expect(result).toBe("2025-01-05");
    });
  });

  describe("convert", () => {
    it("should convert to number", () => {
      expect(DataUtils.convert<number>("123", "number")).toBe(123);
      expect(DataUtils.convert<number>("12.34", "number")).toBe(12.34);
    });

    it("should convert to string", () => {
      expect(DataUtils.convert<string>(123, "string")).toBe("123");
      expect(DataUtils.convert<string>(true, "string")).toBe("true");
    });

    it("should convert to boolean", () => {
      expect(DataUtils.convert<boolean>(1, "boolean")).toBe(true);
      expect(DataUtils.convert<boolean>(0, "boolean")).toBe(false);
      expect(DataUtils.convert<boolean>("", "boolean")).toBe(false);
      expect(DataUtils.convert<boolean>("true", "boolean")).toBe(true);
    });

    it("should convert to date", () => {
      const dateStr = "2025-05-15T12:00:00.000Z";
      const result = DataUtils.convert<Date>(dateStr, "date");
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(dateStr);
    });

    it("should throw error for unsupported type", () => {
      // @ts-expect-error Testing invalid type
      expect(() => DataUtils.convert("test", "invalid")).toThrow(
        "Unsupported type: invalid",
      );
    });
  });

  describe("safeParseJSON", () => {
    it("should parse valid JSON string", () => {
      const json = '{"name":"test","value":123}';
      const result = DataUtils.safeParseJSON(json, null);
      expect(result).toEqual({ name: "test", value: 123 });
    });

    it("should return default value for invalid JSON", () => {
      const invalidJson = "{invalid json}";
      const defaultValue = { name: "default" };
      const result = DataUtils.safeParseJSON(invalidJson, defaultValue);
      expect(result).toBe(defaultValue);
    });

    it("should parse JSON array", () => {
      const json = "[1,2,3]";
      const result = DataUtils.safeParseJSON<number[]>(json, []);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle empty string", () => {
      const defaultValue = { empty: true };
      const result = DataUtils.safeParseJSON("", defaultValue);
      expect(result).toBe(defaultValue);
    });
  });
});
