import { describe, it, expect } from 'vitest';
import { DependencyUtils } from './dependencyUtils';

describe('DependencyUtils', () => {
  describe('register and resolve', () => {
    it('should register and resolve a service', () => {
      const service = { name: 'test' };
      DependencyUtils.register('testService', service);
      const resolved = DependencyUtils.resolve<typeof service>('testService');
      expect(resolved).toBe(service);
    });

    it('should throw error when resolving non-existent service', () => {
      expect(() => {
        DependencyUtils.resolve('nonExistentService');
      }).toThrow('No implementation found for nonExistentService');
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

    it('should keep target properties when config is empty', () => {
      const target = { name: 'test', value: 1 };
      const config = {};
      const result = DependencyUtils.injectConfig(target, config);
      expect(result).toEqual(target);
    });
  });

  describe('mock', () => {
    it('should register mock implementation', () => {
      interface TestService {
        getValue(): number;
      }
      const mockService: Partial<TestService> = {
        getValue: () => 42
      };
      DependencyUtils.mock<TestService>('testService', mockService);
      const resolved = DependencyUtils.resolve<TestService>('testService');
      expect(resolved.getValue?.()).toBe(42);
    });

    it('should override existing implementation', () => {
      const originalService = { getValue: () => 1 };
      const mockService = { getValue: () => 2 };

      DependencyUtils.register('testService', originalService);
      DependencyUtils.mock('testService', mockService);

      const resolved = DependencyUtils.resolve<typeof mockService>('testService');
      expect(resolved.getValue()).toBe(2);
    });
  });
});
