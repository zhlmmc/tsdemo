import { describe, it, expect } from "vitest";
import { DependencyUtils } from "./dependencyUtils";

describe("DependencyUtils", () => {
  it("should register and resolve a service", () => {
    const mockService = { test: "value" };
    DependencyUtils.register("testService", mockService);

    const resolved = DependencyUtils.resolve<typeof mockService>("testService");
    expect(resolved).toEqual(mockService);
  });

  it("should throw error when resolving non-existent service", () => {
    expect(() => {
      DependencyUtils.resolve("nonExistentService");
    }).toThrow("No implementation found for nonExistentService");
  });

  it("should inject config into target object", () => {
    const target = { name: "test", value: 1 };
    const config = { value: 2 };

    const result = DependencyUtils.injectConfig(target, config);

    expect(result).toEqual({ name: "test", value: 2 });
  });

  it("should mock a service implementation", () => {
    interface TestService {
      getValue(): string;
    }

    const mockImplementation = {
      getValue: () => "mocked value",
    };

    DependencyUtils.mock<TestService>("testService", mockImplementation);

    const resolved = DependencyUtils.resolve<TestService>("testService");
    expect(resolved.getValue()).toBe("mocked value");
  });

  it("should override existing service when registering with same key", () => {
    const service1 = { id: 1 };
    const service2 = { id: 2 };

    DependencyUtils.register("service", service1);
    DependencyUtils.register("service", service2);

    const resolved = DependencyUtils.resolve<typeof service2>("service");
    expect(resolved).toEqual(service2);
  });

  it("should maintain separate services with different keys", () => {
    const service1 = { id: 1 };
    const service2 = { id: 2 };

    DependencyUtils.register("service1", service1);
    DependencyUtils.register("service2", service2);

    const resolved1 = DependencyUtils.resolve<typeof service1>("service1");
    const resolved2 = DependencyUtils.resolve<typeof service2>("service2");

    expect(resolved1).toEqual(service1);
    expect(resolved2).toEqual(service2);
  });

  it("should handle partial config injection", () => {
    const target = { name: "test", age: 20, email: "test@test.com" };
    const partialConfig = { age: 25 };

    const result = DependencyUtils.injectConfig(target, partialConfig);

    expect(result).toEqual({
      name: "test",
      age: 25,
      email: "test@test.com",
    });
  });
});
