/**
 * 复杂状态管理工具类
 */
export class StateUtils {
    private static states = new Map<string, any>();
    private static history = new Map<string, any[]>();
    private static subscribers = new Map<string, Set<(state: any) => void>>();

    /**
     * 状态管理
     */
    static setState<T>(key: string, value: T, options: { keepHistory?: boolean } = {}): void {
        const oldValue = this.states.get(key);
        this.states.set(key, value);

        if (options.keepHistory) {
            if (!this.history.has(key)) {
                this.history.set(key, []);
            }
            this.history.get(key)!.push(oldValue);
        }

        this.subscribers.get(key)?.forEach(subscriber => subscriber(value));
    }

    static getState<T>(key: string): T | undefined {
        return this.states.get(key);
    }

    static subscribe(key: string, subscriber: (state: any) => void): () => void {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key)!.add(subscriber);
        return () => this.subscribers.get(key)?.delete(subscriber);
    }

    static undo(key: string): boolean {
        const history = this.history.get(key);
        if (!history?.length) return false;

        const previousState = history.pop();
        this.states.set(key, previousState);
        this.subscribers.get(key)?.forEach(subscriber => subscriber(previousState));
        return true;
    }
} 