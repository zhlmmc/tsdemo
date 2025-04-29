import { describe, it, expect, beforeEach } from 'vitest';
import { DependencyUtils } from './dependencyUtils';

interface TestService {
  doSomething(): string;
}

class TestServiceImpl implements TestService {
  doSomething(): string {
    return 'real implementation';
  }
}

interface TestConfig {
  name: string;
  value: number;
}

describe('DependencyUtils', () => {
  beforeEach(() => {
    // Clear container before each test
    (DependencyUtils as any).container = new Map();
  });

  describe('register', () => {
    it('should register a service implementation', () => {
      const service = new TestServiceImpl();
      DependencyUtils.register('testService', service);

      const resolved = DependencyUtils.resolve<TestService>('testService');
      expect(resolved).toBe(service);
    });

    it('should override existing implementation when registering with same key', () => {
      const service1 = new TestServiceImpl();
      const service2 = new TestServiceImpl();

      DependencyUtils.register('testService', service1);
      DependencyUtils.register('testService', service2);

      const resolved = DependencyUtils.resolve<TestService>('testService');
      expect(resolved).toBe(service2);
    });
  });

  describe('resolve', () => {
    it('should resolve registered service', () => {
      const service = new TestServiceImpl();
      DependencyUtils.register('testService', service);

      const resolved = DependencyUtils.resolve<TestService>('testService');
      expect(resolved.doSomething()).toBe('real implementation');
    });

    it('should throw error when resolving unregistered service', () => {
      expect(() => {
        DependencyUtils.resolve('nonExistentService');
      }).toThrow('No implementation found for nonExistentService');
    });
  });

  describe('injectConfig', () => {
    it('should merge config with target object', () => {
      const target: TestConfig = {
        name: 'default',
        value: 0
      };

      const config: Partial<TestConfig> = {
        value: 42
      };

      const result = DependencyUtils.injectConfig(target, config);

      expect(result).toEqual({
        name: 'default',
        value: 42
      });
    });

    it('should not modify original target object', () => {
      const target: TestConfig = {
        name: 'default',
        value: 0
      };

      const config: Partial<TestConfig> = {
        value: 42
      };

      DependencyUtils.injectConfig(target, config);

      expect(target).toEqual({
        name: 'default',
        value: 0
      });
    });
  });

  describe('mock', () => {
    it('should register mock implementation', () => {
      const mockService: Partial<TestService> = {
        doSomething: () => 'mock implementation'
      };

      DependencyUtils.mock<TestService>('testService', mockService);

      const resolved = DependencyUtils.resolve<TestService>('testService');
      expect(resolved.doSomething()).toBe('mock implementation');
    });

    it('should override real implementation with mock', () => {
      const realService = new TestServiceImpl();
      DependencyUtils.register('testService', realService);

      const mockService: Partial<TestService> = {
        doSomething: () => 'mock implementation'
      };
      DependencyUtils.mock<TestService>('testService', mockService);

      const resolved = DependencyUtils.resolve<TestService>('testService');
      expect(resolved.doSomething()).toBe('mock implementation');
    });
  });
});
