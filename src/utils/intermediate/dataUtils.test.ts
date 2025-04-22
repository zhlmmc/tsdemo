import { describe, it, expect } from 'vitest';
import { DataUtils } from './dataUtils';

describe('DataUtils', () => {
  describe('formatDate', () => {
    it('should format date correctly with full format', () => {
      const date = new Date(2025, 3, 15, 14, 30, 45);
      const result = DataUtils.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
      expect(result).toBe('2025-04-15 14:30:45');
    });

    it('should format date with partial format', () => {
      const date = new Date(2025, 3, 15);
      const result = DataUtils.formatDate(date, 'yyyy/MM/dd');
      expect(result).toBe('2025/04/15');
    });

    it('should handle single digit months and days', () => {
      const date = new Date(2025, 0, 5, 9, 5, 5);
      const result = DataUtils.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
      expect(result).toBe('2025-01-05 09:05:05');
    });
  });

  describe('convert', () => {
    it('should convert to number', () => {
      expect(DataUtils.convert<number>('123', 'number')).toBe(123);
      expect(DataUtils.convert<number>(true, 'number')).toBe(1);
      expect(DataUtils.convert<number>(false, 'number')).toBe(0);
    });

    it('should convert to string', () => {
      expect(DataUtils.convert<string>(123, 'string')).toBe('123');
      expect(DataUtils.convert<string>(true, 'string')).toBe('true');
      expect(DataUtils.convert<string>(null, 'string')).toBe('null');
    });

    it('should convert to boolean', () => {
      expect(DataUtils.convert<boolean>(1, 'boolean')).toBe(true);
      expect(DataUtils.convert<boolean>(0, 'boolean')).toBe(false);
      expect(DataUtils.convert<boolean>('', 'boolean')).toBe(false);
      expect(DataUtils.convert<boolean>('true', 'boolean')).toBe(true);
    });

    it('should convert to date', () => {
      const dateStr = '2025-04-15T12:00:00Z';
      const result = DataUtils.convert<Date>(dateStr, 'date');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2025-04-15T12:00:00.000Z');
    });

    it('should throw error for unsupported type', () => {
      expect(() => {
        // @ts-expect-error Testing invalid type
        DataUtils.convert('test', 'invalid');
      }).toThrow('Unsupported type: invalid');
    });
  });

  describe('safeParseJSON', () => {
    it('should parse valid JSON string', () => {
      const jsonStr = '{"name":"test","value":123}';
      const defaultValue = { name: '', value: 0 };
      const result = DataUtils.safeParseJSON(jsonStr, defaultValue);
      expect(result).toEqual({ name: 'test', value: 123 });
    });

    it('should return default value for invalid JSON', () => {
      const invalidJson = '{invalid json}';
      const defaultValue = { name: 'default', value: 0 };
      const result = DataUtils.safeParseJSON(invalidJson, defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should handle empty string', () => {
      const defaultValue = [];
      const result = DataUtils.safeParseJSON('', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should handle null and undefined values in JSON', () => {
      const jsonStr = '{"name":null,"value":undefined}';
      const defaultValue = { name: 'default', value: 0 };
      const result = DataUtils.safeParseJSON(jsonStr, defaultValue);
      expect(result).toEqual(defaultValue);
    });
  });
});
