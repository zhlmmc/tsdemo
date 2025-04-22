import { describe, it, expect, beforeEach } from 'vitest';
import { DependencyUtils } from './dependencyUtils';

describe('DependencyUtils', () => {
  beforeEach(() => {
    // Clear container before each test
    (DependencyUtils as any).container = new Map();
  });

  describe('register', () => {
    it('should register implementation for a key', () => {
      const testService = { test: 'service' };
      DependencyUtils.register('testKey', testService);
      expect((DependencyUtils as any).container.get('testKey')).toBe(testService);
    });
  });

  describe('resolve', () => {
    it('should resolve registered implementation', () => {
      const testService = { test: 'service' };
      DependencyUtils.register('testKey', testService);
      const resolved = DependencyUtils.resolve<typeof testService>('testKey');
      expect(resolved).toBe(testService);
    });

    it('should throw error when implementation not found', () => {
      expect(() => DependencyUtils.resolve('nonexistentKey')).toThrow('No implementation found for nonexistentKey');
    });
  });

  describe('injectConfig', () => {
    it('should merge target with config', () => {
      const target = { a: 1, b: 2 };
      const config = { b: 3, c: 4 };
      const result = DependencyUtils.injectConfig(target, config);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should handle empty config', () => {
      const target = { a: 1, b: 2 };
      const result = DependencyUtils.injectConfig(target, {});
      expect(result).toEqual(target);
    });

    it('should handle empty target', () => {
      const config = { a: 1, b: 2 };
      const result = DependencyUtils.injectConfig({}, config);
      expect(result).toEqual(config);
    });
  });

  describe('mock', () => {
    it('should register mock implementation', () => {
      interface TestService {
        method(): string;
      }
      const mockService: Partial<TestService> = {
        method: () => 'mocked'
      };
      DependencyUtils.mock<TestService>('testService', mockService);
      const resolved = DependencyUtils.resolve<TestService>('testService');
      expect(resolved.method?.()).toBe('mocked');
    });

    it('should override existing implementation', () => {
      const originalService = { method: () => 'original' };
      const mockService = { method: () => 'mocked' };

      DependencyUtils.register('testService', originalService);
      DependencyUtils.mock('testService', mockService);

      const resolved = DependencyUtils.resolve<typeof mockService>('testService');
      expect(resolved.method()).toBe('mocked');
    });
  });
});
