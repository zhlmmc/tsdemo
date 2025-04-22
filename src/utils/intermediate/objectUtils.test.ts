import { describe, it, expect } from 'vitest';
import { ObjectUtils } from './objectUtils';

describe('ObjectUtils', () => {
  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(ObjectUtils.deepClone(42)).toBe(42);
      expect(ObjectUtils.deepClone('test')).toBe('test');
      expect(ObjectUtils.deepClone(true)).toBe(true);
      expect(ObjectUtils.deepClone(null)).toBe(null);
      expect(ObjectUtils.deepClone(undefined)).toBe(undefined);
    });

    it('should clone Date objects', () => {
      const date = new Date();
      const cloned = ObjectUtils.deepClone(date);
      expect(cloned).toBeInstanceOf(Date);
      expect(cloned.getTime()).toBe(date.getTime());
    });

    it('should clone RegExp objects', () => {
      const regex = /test/gi;
      const cloned = ObjectUtils.deepClone(regex);
      expect(cloned).toBeInstanceOf(RegExp);
      expect(cloned.source).toBe(regex.source);
      expect(cloned.flags).toBe(regex.flags);
    });

    it('should clone arrays', () => {
      const arr = [1, 'test', { a: 1 }];
      const cloned = ObjectUtils.deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone nested objects', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3
          }
        }
      };
      const cloned = ObjectUtils.deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
      expect(cloned.b.d).not.toBe(obj.b.d);
    });
  });

  describe('validateObject', () => {
    it('should validate required fields', () => {
      const schema = {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true }
      };

      const validObj = { name: 'John', age: 30 };
      expect(ObjectUtils.validateObject(validObj, schema).isValid).toBe(true);

      const invalidObj = { name: 'John' };
      const result = ObjectUtils.validateObject(invalidObj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('age is required');
    });

    it('should validate types', () => {
      const schema = {
        name: { type: 'string' },
        age: { type: 'number' }
      };

      const invalidObj = { name: 42, age: 'thirty' };
      const result = ObjectUtils.validateObject(invalidObj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('name should be of type string');
      expect(result.errors).toContain('age should be of type number');
    });

    it('should validate patterns', () => {
      const schema = {
        email: { type: 'string', pattern: /^[^@]+@[^@]+\.[^@]+$/ }
      };

      const validObj = { email: 'test@example.com' };
      expect(ObjectUtils.validateObject(validObj, schema).isValid).toBe(true);

      const invalidObj = { email: 'invalid-email' };
      const result = ObjectUtils.validateObject(invalidObj, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('email does not match required pattern');
    });

    it('should validate number ranges', () => {
      const schema = {
        age: { type: 'number', min: 0, max: 120 }
      };

      expect(ObjectUtils.validateObject({ age: 30 }, schema).isValid).toBe(true);

      const result1 = ObjectUtils.validateObject({ age: -1 }, schema);
      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('age should be greater than or equal to 0');

      const result2 = ObjectUtils.validateObject({ age: 121 }, schema);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('age should be less than or equal to 120');
    });
  });

  describe('merge', () => {
    it('should merge shallow objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = ObjectUtils.merge(target, source);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
      expect(result).toBe(target);
    });

    it('should merge nested objects', () => {
      const target = { a: 1, b: { c: 2, d: 3 } };
      const source = { b: { d: 4, e: 5 } };
      const result = ObjectUtils.merge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 4, e: 5 } });
      expect(result.b).toBe(target.b);
    });

    it('should handle empty objects', () => {
      const target = { a: 1 };
      const source = {};
      const result = ObjectUtils.merge(target, source);
      expect(result).toEqual({ a: 1 });
      expect(result).toBe(target);
    });

    it('should create nested objects if they do not exist', () => {
      const target = { a: 1 };
      const source = { b: { c: 2 } };
      const result = ObjectUtils.merge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2 } });
    });
  });
});
