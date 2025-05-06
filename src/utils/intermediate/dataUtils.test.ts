import { describe, it, expect } from "vitest";
import { DataUtils } from "./dataUtils";

describe("DataUtils", () => {
  describe("formatDate", () => {
    it("should format date correctly with full format", () => {
      const date = new Date(2025, 4, 15, 9, 30, 45);
      const result = DataUtils.formatDate(date, "yyyy-MM-dd HH:mm:ss");
      expect(result).toBe("2025-05-15 09:30:45");
    });

    it("should format date correctly with partial format", () => {
      const date = new Date(2025, 4, 15);
      const result = DataUtils.formatDate(date, "yyyy/MM/dd");
      expect(result).toBe("2025/05/15");
    });

    it("should handle single digit month/day/hour/minute/second", () => {
      const date = new Date(2025, 0, 5, 1, 5, 9);
      const result = DataUtils.formatDate(date, "yyyy-MM-dd HH:mm:ss");
      expect(result).toBe("2025-01-05 01:05:09");
    });
  });

  describe("convert", () => {
    it("should convert to number", () => {
      expect(DataUtils.convert<number>("123", "number")).toBe(123);
      expect(DataUtils.convert<number>(true, "number")).toBe(1);
      expect(DataUtils.convert<number>(false, "number")).toBe(0);
    });

    it("should convert to string", () => {
      expect(DataUtils.convert<string>(123, "string")).toBe("123");
      expect(DataUtils.convert<string>(true, "string")).toBe("true");
      expect(DataUtils.convert<string>(new Date(2025, 0, 1), "string")).toMatch(/2025/);
    });

    it("should convert to boolean", () => {
      expect(DataUtils.convert<boolean>(1, "boolean")).toBe(true);
      expect(DataUtils.convert<boolean>(0, "boolean")).toBe(false);
      expect(DataUtils.convert<boolean>("", "boolean")).toBe(false);
      expect(DataUtils.convert<boolean>("true", "boolean")).toBe(true);
    });

    it("should convert to date", () => {
      const dateStr = "2025-05-15";
      const result = DataUtils.convert<Date>(dateStr, "date");
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
    });

    it("should throw error for unsupported type", () => {
      // @ts-expect-error Testing invalid type
      expect(() => DataUtils.convert("test", "invalid")).toThrow("Unsupported type: invalid");
    });
  });

  describe("safeParseJSON", () => {
    it("should parse valid JSON string", () => {
      const jsonStr = '{"name":"test","value":123}';
      const result = DataUtils.safeParseJSON(jsonStr, null);
      expect(result).toEqual({name: "test", value: 123});
    });

    it("should return default value for invalid JSON", () => {
      const invalidJson = "{invalid json}";
      const defaultValue = {error: true};
      const result = DataUtils.safeParseJSON(invalidJson, defaultValue);
      expect(result).toBe(defaultValue);
    });

    it("should parse JSON arrays", () => {
      const jsonArray = '[1,2,3]';
      const result = DataUtils.safeParseJSON(jsonArray, []);
      expect(result).toEqual([1,2,3]);
    });

    it("should handle empty string", () => {
      const defaultValue = {empty: true};
      const result = DataUtils.safeParseJSON("", defaultValue);
      expect(result).toBe(defaultValue);
    });
  });
});
