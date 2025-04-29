/**
 * Dependency Injection Utility Class
 */
export class DependencyUtils {
  private static container = new Map<string, any>();

  /**
   * Register Service
   */
  static register(key: string, implementation: any): void {
    this.container.set(key, implementation);
  }

  /**
   * Get Service
   */
  static resolve<T>(key: string): T {
    const implementation = this.container.get(key);
    if (!implementation) {
      throw new Error(`No implementation found for ${key}`);
    }
    return implementation;
  }

  /**
   * Configuration Injection
   */
  static injectConfig<T extends object>(target: T, config: Partial<T>): T {
    return { ...target, ...config };
  }

  /**
   * Service Mocking
   */
  static mock<T>(key: string, mockImplementation: Partial<T>): void {
    this.register(key, mockImplementation);
  }
}
