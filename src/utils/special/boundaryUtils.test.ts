import { describe, it, expect } from 'vitest';
import { BoundaryUtils } from './boundaryUtils';

describe('BoundaryUtils', () => {
  describe('safeGet', () => {
    it('should return default value for null object', () => {
      const result = BoundaryUtils.safeGet(null, 'prop' as any, 'default');
      expect(result).toBe('default');
    });

    it('should return default value for undefined object', () => {
      const result = BoundaryUtils.safeGet(undefined, 'prop' as any, 'default');
      expect(result).toBe('default');
    });

    it('should return default value for undefined property', () => {
      const obj = { a: 1 };
      const result = BoundaryUtils.safeGet(obj, 'b' as any, 'default');
      expect(result).toBe('default');
    });

    it('should return property value when exists', () => {
      const obj = { name: 'test' };
      const result = BoundaryUtils.safeGet(obj, 'name', 'default');
      expect(result).toBe('test');
    });
  });

  describe('coalesce', () => {
    it('should return first non-null value', () => {
      const result = BoundaryUtils.coalesce(null, undefined, 'test', 'other');
      expect(result).toBe('test');
    });

    it('should return null if all values are null/undefined', () => {
      const result = BoundaryUtils.coalesce(null, undefined);
      expect(result).toBeNull();
    });

    it('should return first defined value', () => {
      const result = BoundaryUtils.coalesce(undefined, 42, null);
      expect(result).toBe(42);
    });

    it('should handle empty args', () => {
      const result = BoundaryUtils.coalesce();
      expect(result).toBeNull();
    });
  });

  describe('toNumber', () => {
    it('should convert string number to number', () => {
      const result = BoundaryUtils.toNumber('42');
      expect(result).toBe(42);
    });

    it('should return default value for invalid number', () => {
      const result = BoundaryUtils.toNumber('invalid');
      expect(result).toBe(0);
    });

    it('should return custom default value for invalid number', () => {
      const result = BoundaryUtils.toNumber('invalid', -1);
      expect(result).toBe(-1);
    });

    it('should handle actual numbers', () => {
      const result = BoundaryUtils.toNumber(42);
      expect(result).toBe(42);
    });

    it('should handle null', () => {
      const result = BoundaryUtils.toNumber(null);
      expect(result).toBe(0);
    });

    it('should handle undefined', () => {
      const result = BoundaryUtils.toNumber(undefined);
      expect(result).toBe(0);
    });

    it('should handle boolean values', () => {
      expect(BoundaryUtils.toNumber(true)).toBe(1);
      expect(BoundaryUtils.toNumber(false)).toBe(0);
    });
  });
});
