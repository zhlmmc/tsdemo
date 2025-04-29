/**
 * Advanced design pattern implementations
 */
export class Patterns {
  /**
   * Singleton pattern
   */
  static Singleton = class {
    private static instance: any;
    protected constructor() {}

    static getInstance(): any {
      if (!this.instance) {
        this.instance = new this();
      }
      return this.instance;
    }
  };

  /**
   * Observer pattern
   */
  static Observer = class<T> {
    private observers: ((data: T) => void)[] = [];

    subscribe(fn: (data: T) => void): () => void {
      this.observers.push(fn);
      return () => {
        this.observers = this.observers.filter((observer) => observer !== fn);
      };
    }

    notify(data: T): void {
      this.observers.forEach((observer) => observer(data));
    }
  };

  /**
   * Factory pattern
   */
  static Factory = class {
    static createProduct(type: string): Product {
      switch (type.toLowerCase()) {
        case "a":
          return new ProductA();
        case "b":
          return new ProductB();
        default:
          throw new Error(`Unknown product type: ${type}`);
      }
    }
  };
}

// Move interfaces and implementation classes outside the Patterns class
export interface Product {
  operation(): string;
}

export class ProductA implements Product {
  operation(): string {
    return "Product A";
  }
}

export class ProductB implements Product {
  operation(): string {
    return "Product B";
  }
}
