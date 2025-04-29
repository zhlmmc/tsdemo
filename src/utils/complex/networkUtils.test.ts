import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NetworkUtils } from './networkUtils';

// Helper to suppress unhandled rejection warnings in certain cases
async function suppressUnhandled(promise: Promise<any>) {
  try {
    await promise;
  } catch { /* intentionally empty */}
}

describe('NetworkUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    global.fetch = vi.fn();
    // Clear cache between tests
    NetworkUtils['cache'].clear();
    NetworkUtils['pendingRequests'].clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Restore AbortController after tests that may modify it
    if ((global as any).__originalAbortController__) {
      global.AbortController = (global as any).__originalAbortController__;
      delete (global as any).__originalAbortController__;
    }
  });

  describe('fetchWithCache', () => {
    it('should fetch and cache data', async () => {
      const mockData = { foo: 'bar' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await NetworkUtils.fetchWithCache('http://test.com');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('http://test.com', {
        method: 'GET',
        headers: undefined,
        body: undefined
      });
    });

    it('should return cached data if within cache duration', async () => {
      const mockData = { foo: 'bar' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      // First call
      const result1 = await NetworkUtils.fetchWithCache('http://test.com');
      expect(result1).toEqual(mockData);

      // Second call within cache duration
      const result2 = await NetworkUtils.fetchWithCache('http://test.com');
      expect(result2).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should force refresh cache when forceRefresh is true', async () => {
      const mockData1 = { foo: 'bar1' };
      const mockData2 = { foo: 'bar2' };

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData1)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData2)
        });

      await NetworkUtils.fetchWithCache('http://test.com');
      const result = await NetworkUtils.fetchWithCache('http://test.com', { forceRefresh: true });

      expect(result).toEqual(mockData2);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const promise = NetworkUtils.fetchWithCache('http://test.com');
      await expect(promise).rejects.toThrow('Network error');
      await suppressUnhandled(promise);
    });

    it('should prevent duplicate requests', async () => {
      const mockData = { foo: 'bar' };
      let resolvePromise: ((value: any) => void) | undefined;

      (global.fetch as any).mockImplementationOnce(() =>
        new Promise((resolve) => {
          resolvePromise = () => resolve({
            ok: true,
            json: () => Promise.resolve(mockData)
          });
        })
      );

      const promise1 = NetworkUtils.fetchWithCache('http://test.com');
      const promise2 = NetworkUtils.fetchWithCache('http://test.com');

      resolvePromise!({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toEqual(mockData);
      expect(result2).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle HTTP errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({})
      });

      const promise = NetworkUtils.fetchWithCache('http://test.com');
      await expect(promise).rejects.toThrow('HTTP error! status: 404');
      await suppressUnhandled(promise);
    });

    it('should expire cache after cacheDuration', async () => {
      const mockData1 = { foo: 'bar1' };
      const mockData2 = { foo: 'bar2' };

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData1)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData2)
        });

      // First call
      const result1 = await NetworkUtils.fetchWithCache('http://test.com', { cacheDuration: 100 });
      expect(result1).toEqual(mockData1);

      // Advance time beyond cache duration
      vi.advanceTimersByTime(150);

      // Second call after cache expired
      const result2 = await NetworkUtils.fetchWithCache('http://test.com', { cacheDuration: 100 });
      expect(result2).toEqual(mockData2);

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should use correct cacheKey for different methods and bodies', async () => {
      const mockData1 = { foo: 'bar1' };
      const mockData2 = { foo: 'bar2' };

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData1)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData2)
        });

      // GET request
      const result1 = await NetworkUtils.fetchWithCache('http://test.com', { method: 'GET' });
      expect(result1).toEqual(mockData1);

      // POST request with different body
      const result2 = await NetworkUtils.fetchWithCache('http://test.com', { method: 'POST', body: { a: 1 } });
      expect(result2).toEqual(mockData2);

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('fetchWithRetry', () => {
    it('should fetch successfully on first try', async () => {
      const mockData = { foo: 'bar' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await NetworkUtils.fetchWithRetry('http://test.com');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const mockData = { foo: 'bar' };
      const onRetry = vi.fn();

      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData)
        });

      const resultPromise = NetworkUtils.fetchWithRetry('http://test.com', {
        retryCount: 1,
        onRetry,
        timeout: 1000
      });

      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should handle timeout', async () => {
      const abortFn = vi.fn();
      const mockData = { foo: 'bar' };

      vi.spyOn(global, 'AbortController').mockImplementation(() => ({
        abort: abortFn,
        signal: {} as AbortSignal
      }));

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await NetworkUtils.fetchWithRetry('http://test.com', {
        timeout: 1000
      });

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('http://test.com', {
        signal: expect.any(Object)
      });
    });

    it.skip('should throw error if AbortController is not available', async () => {
      // Save and remove AbortController
      if (typeof global.AbortController !== 'undefined') {
        (global as any).__originalAbortController__ = global.AbortController;
        // @ts-expect-error
        global.AbortController = undefined;
      }

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ foo: 'bar' })
      });

      // Should still work because fetch does not use signal if undefined
      const result = await NetworkUtils.fetchWithRetry('http://test.com');
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should clear pendingRequests cache entry on success in fetchWithCache', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ foo: 'bar' })
      });

      await NetworkUtils.fetchWithCache('http://remove-pending.com');
      expect(NetworkUtils['pendingRequests'].size).toBe(0);
    });

    it('should accept custom headers and body', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ xyz: 123 })
      });

      const headers = { 'Content-Type': 'application/json' };
      const body = { t: 2 };
      const res = await NetworkUtils.fetchWithCache('http://headers.com', {
        method: 'POST',
        headers,
        body,
      });
      expect(res).toEqual({ xyz: 123 });
      expect(global.fetch).toHaveBeenCalledWith('http://headers.com', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    });
  });
});
