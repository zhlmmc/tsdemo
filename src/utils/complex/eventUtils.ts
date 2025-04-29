/**
 * Complex Event Handling Utility Class
 */
export class EventUtils {
  private static eventMap = new Map<string, Set<(...args: any[]) => void>>();

  /**
   * Custom Event Pub/Sub System
   */
  static on(event: string, handler: (...args: any[]) => void): () => void {
    if (!this.eventMap.has(event)) {
      this.eventMap.set(event, new Set());
    }
    this.eventMap.get(event)!.add(handler);

    return () => this.eventMap.get(event)?.delete(handler);
  }

  static emit(event: string, ...args: any[]): void {
    this.eventMap.get(event)?.forEach((handler) => handler(...args));
  }

  /**
   * Event Queue Processing
   */
  static async processEventQueue<T>(
    events: T[],
    handler: (event: T) => Promise<void>,
    options: {
      concurrent?: number;
      onError?: (error: Error, event: T) => void;
      retryCount?: number;
    } = {},
  ): Promise<void> {
    const { concurrent = 1, onError, retryCount = 0 } = options;
    const active = new Set<Promise<void>>();
    const queue = [...events];

    while (queue.length > 0 || active.size > 0) {
      if (queue.length > 0 && active.size < concurrent) {
        const event = queue.shift()!;
        const promise = this.processEvent(
          event,
          handler,
          retryCount,
          onError,
        ).finally(() => active.delete(promise));
        active.add(promise);
      } else {
        await Promise.race(active);
      }
    }
  }

  private static async processEvent<T>(
    event: T,
    handler: (event: T) => Promise<void>,
    retryCount: number,
    onError?: (error: Error, event: T) => void,
  ): Promise<void> {
    let attempts = 0;
    while (attempts <= retryCount) {
      try {
        await handler(event);
        return;
      } catch (error) {
        attempts++;
        if (attempts > retryCount) {
          onError?.(error as Error, event);
          throw error;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempts) * 100),
        );
      }
    }
  }
}
