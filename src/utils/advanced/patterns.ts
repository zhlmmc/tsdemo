/**
 * 高级设计模式实现
 */
export class Patterns {
    /**
     * 单例模式
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
    }

    /**
     * 观察者模式
     */
    static Observer = class<T> {
        private observers: ((data: T) => void)[] = [];

        subscribe(fn: (data: T) => void): () => void {
            this.observers.push(fn);
            return () => {
                this.observers = this.observers.filter(observer => observer !== fn);
            };
        }

        notify(data: T): void {
            this.observers.forEach(observer => observer(data));
        }
    }

    /**
     * 工厂模式
     */
    static Factory = class {
        static createProduct(type: string): Product {
            switch (type.toLowerCase()) {
                case 'a':
                    return new ProductA();
                case 'b':
                    return new ProductB();
                default:
                    throw new Error(`Unknown product type: ${type}`);
            }
        }
    }
}

// 将接口和实现类移到Patterns类外部
export interface Product {
    operation(): string;
}

export class ProductA implements Product {
    operation(): string {
        return 'Product A';
    }
}

export class ProductB implements Product {
    operation(): string {
        return 'Product B';
    }
} 