/**
 * Complex Network Request Utility Class
 */
export class NetworkUtils {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static pendingRequests = new Map<string, Promise<any>>();

  /**
   * Request with Cache
   */
  static async fetchWithCache<T>(
    url: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      cacheDuration?: number;
      forceRefresh?: boolean;
    } = {},
  ): Promise<T> {
    const cacheKey = `${options.method || "GET"}-${url}-${JSON.stringify(options.body || {})}`;
    const cached = this.cache.get(cacheKey);

    if (
      !options.forceRefresh &&
      cached &&
      Date.now() - cached.timestamp < (options.cacheDuration || 5000)
    ) {
      return cached.data;
    }

    // Prevent duplicate requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const promise = fetch(url, {
      method: options.method || "GET",
      headers: options.headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        this.pendingRequests.delete(cacheKey);
        return data as T;
      })
      .catch((error) => {
        this.pendingRequests.delete(cacheKey);
        throw error;
      });

    this.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Request Retry and Timeout Handling
   */
  static async fetchWithRetry<T>(
    url: string,
    options: {
      retryCount?: number;
      timeout?: number;
      onRetry?: (error: Error, attempt: number) => void;
    } = {},
  ): Promise<T> {
    const { retryCount = 3, timeout = 5000, onRetry } = options;
    let attempts = 0;

    while (attempts <= retryCount) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data as T;
      } catch (error) {
        attempts++;
        if (attempts > retryCount) throw error;
        onRetry?.(error as Error, attempts);
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempts) * 100),
        );
      }
    }

    throw new Error("Max retry attempts reached");
  }
}
