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

    it('should return default value for missing property', () => {
      const obj = { a: 1 };
      const result = BoundaryUtils.safeGet(obj, 'b' as any, 'default');
      expect(result).toBe('default');
    });

    it('should return property value when exists', () => {
      const obj = { a: 1 };
      const result = BoundaryUtils.safeGet(obj, 'a', 0);
      expect(result).toBe(1);
    });
  });

  describe('coalesce', () => {
    it('should return first non-null value', () => {
      const result = BoundaryUtils.coalesce(null, undefined, 'value', 'other');
      expect(result).toBe('value');
    });

    it('should return null if all values are null/undefined', () => {
      const result = BoundaryUtils.coalesce(null, undefined);
      expect(result).toBeNull();
    });

    it('should handle empty args array', () => {
      const result = BoundaryUtils.coalesce();
      expect(result).toBeNull();
    });

    it('should return first value if non-null', () => {
      const result = BoundaryUtils.coalesce('first', null, 'second');
      expect(result).toBe('first');
    });
  });

  describe('toNumber', () => {
    it('should convert valid number string', () => {
      expect(BoundaryUtils.toNumber('123')).toBe(123);
    });

    it('should convert actual number', () => {
      expect(BoundaryUtils.toNumber(123)).toBe(123);
    });

    it('should return default for invalid number', () => {
      expect(BoundaryUtils.toNumber('abc')).toBe(0);
    });

    it('should return custom default for invalid number', () => {
      expect(BoundaryUtils.toNumber('abc', -1)).toBe(-1);
    });

    it('should handle null', () => {
      expect(BoundaryUtils.toNumber(null)).toBe(0);
    });

    it('should handle undefined', () => {
      expect(BoundaryUtils.toNumber(undefined)).toBe(0);
    });

    it('should handle boolean values', () => {
      expect(BoundaryUtils.toNumber(true)).toBe(1);
      expect(BoundaryUtils.toNumber(false)).toBe(0);
    });
  });
});
