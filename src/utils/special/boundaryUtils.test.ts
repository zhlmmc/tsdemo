import { describe, it, expect } from 'vitest';
import { BoundaryUtils } from './boundaryUtils';

describe('BoundaryUtils', () => {
  describe('safeGet', () => {
    it('should return default value when object is null', () => {
      const defaultValue = 'default';
      const result = BoundaryUtils.safeGet(null, 'prop' as any, defaultValue);
      expect(result).toBe(defaultValue);
    });

    it('should return default value when object is undefined', () => {
      const defaultValue = 'default';
      const result = BoundaryUtils.safeGet(undefined, 'prop' as any, defaultValue);
      expect(result).toBe(defaultValue);
    });

    it('should return property value when it exists', () => {
      const obj = { name: 'test' };
      const result = BoundaryUtils.safeGet(obj, 'name', 'default');
      expect(result).toBe('test');
    });

    it('should return default value when property is undefined', () => {
      const obj = { name: undefined };
      const result = BoundaryUtils.safeGet(obj, 'name', 'default');
      expect(result).toBe('default');
    });

    it('should return default value when property is null', () => {
      const obj = { name: null };
      const result = BoundaryUtils.safeGet(obj, 'name', 'default');
      expect(result).toBe('default');
    });
  });

  describe('coalesce', () => {
    it('should return first non-null/undefined value', () => {
      const result = BoundaryUtils.coalesce(null, undefined, 'test', 'other');
      expect(result).toBe('test');
    });

    it('should return null when all values are null/undefined', () => {
      const result = BoundaryUtils.coalesce(null, undefined);
      expect(result).toBeNull();
    });

    it('should return first value when it is not null/undefined', () => {
      const result = BoundaryUtils.coalesce('first', null, 'second');
      expect(result).toBe('first');
    });

    it('should handle empty args array', () => {
      const result = BoundaryUtils.coalesce();
      expect(result).toBeNull();
    });
  });

  describe('toNumber', () => {
    it('should convert string number to number', () => {
      expect(BoundaryUtils.toNumber('123')).toBe(123);
    });

    it('should return default value for invalid number string', () => {
      expect(BoundaryUtils.toNumber('abc')).toBe(0);
    });

    it('should return default value for null', () => {
      expect(BoundaryUtils.toNumber(null)).toBe(0);
    });

    it('should return default value for undefined', () => {
      expect(BoundaryUtils.toNumber(undefined)).toBe(0);
    });

    it('should use provided default value', () => {
      expect(BoundaryUtils.toNumber('abc', -1)).toBe(-1);
    });

    it('should handle boolean values', () => {
      expect(BoundaryUtils.toNumber(true)).toBe(1);
      expect(BoundaryUtils.toNumber(false)).toBe(0);
    });

    it('should handle existing numbers', () => {
      expect(BoundaryUtils.toNumber(123)).toBe(123);
      expect(BoundaryUtils.toNumber(-123)).toBe(-123);
      expect(BoundaryUtils.toNumber(0)).toBe(0);
    });
  });
});
