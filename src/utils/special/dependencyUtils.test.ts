import { describe, it, expect, vi } from 'vitest';
import { DependencyUtils } from './dependencyUtils';

describe('DependencyUtils', () => {
  describe('register and resolve', () => {
    it('should register and resolve a service', () => {
      const mockService = { name: 'test' };
      DependencyUtils.register('testService', mockService);

      const resolved = DependencyUtils.resolve<typeof mockService>('testService');
      expect(resolved).toBe(mockService);
    });

    it('should throw error when resolving non-existent service', () => {
      expect(() => DependencyUtils.resolve('nonExistent')).toThrow('No implementation found for nonExistent');
    });
  });

  describe('injectConfig', () => {
    it('should merge target and config objects', () => {
      const target = { name: 'test', value: 1 };
      const config = { value: 2, extra: true };

      const result = DependencyUtils.injectConfig(target, config);

      expect(result).toEqual({
        name: 'test',
        value: 2,
        extra: true
      });
    });

    it('should handle empty config object', () => {
      const target = { name: 'test', value: 1 };
      const config = {};

      const result = DependencyUtils.injectConfig(target, config);

      expect(result).toEqual(target);
    });

    it('should not modify original target object', () => {
      const target = { name: 'test', value: 1 };
      const config = { value: 2 };

      DependencyUtils.injectConfig(target, config);

      expect(target).toEqual({ name: 'test', value: 1 });
    });
  });

  describe('mock', () => {
    it('should register mock implementation', () => {
      const mockImpl = { mockMethod: vi.fn() };
      DependencyUtils.mock('mockService', mockImpl);

      const resolved = DependencyUtils.resolve<typeof mockImpl>('mockService');
      expect(resolved).toBe(mockImpl);
    });

    it('should override existing implementation', () => {
      const originalImpl = { method: () => 'original' };
      const mockImpl = { method: () => 'mocked' };

      DependencyUtils.register('service', originalImpl);
      DependencyUtils.mock('service', mockImpl);

      const resolved = DependencyUtils.resolve<typeof mockImpl>('service');
      expect(resolved.method()).toBe('mocked');
    });
  });
});
