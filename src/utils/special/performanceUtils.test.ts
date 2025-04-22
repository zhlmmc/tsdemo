import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PerformanceUtils } from './performanceUtils';

describe('PerformanceUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoizedFn = PerformanceUtils.memoize(fn);

      expect(memoizedFn(2)).toBe(4);
      expect(memoizedFn(2)).toBe(4);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should use custom key generator if provided', () => {
      const fn = vi.fn((x: number, y: number) => x + y);
      const keyGenerator = (x: number, y: number) => `${x}-${y}`;
      const memoizedFn = PerformanceUtils.memoize(fn, keyGenerator);

      expect(memoizedFn(2, 3)).toBe(5);
      expect(memoizedFn(2, 3)).toBe(5);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple arguments correctly', () => {
      const fn = vi.fn((x: number, y: number, z: number) => x + y + z);
      const memoizedFn = PerformanceUtils.memoize(fn);

      expect(memoizedFn(1, 2, 3)).toBe(6);
      expect(memoizedFn(1, 2, 3)).toBe(6);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle object arguments', () => {
      const fn = vi.fn((obj: {x: number, y: number}) => obj.x + obj.y);
      const memoizedFn = PerformanceUtils.memoize(fn);

      expect(memoizedFn({x: 1, y: 2})).toBe(3);
      expect(memoizedFn({x: 1, y: 2})).toBe(3);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      const fn = vi.fn();
      const debouncedFn = PerformanceUtils.debounce(fn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn();
      const debouncedFn = PerformanceUtils.debounce(fn, 1000);

      debouncedFn();
      vi.advanceTimersByTime(500);
      debouncedFn();
      vi.advanceTimersByTime(500);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
      const fn = vi.fn();
      const debouncedFn = PerformanceUtils.debounce(fn, 1000);

      debouncedFn(1, 'test');
      vi.advanceTimersByTime(1000);

      expect(fn).toHaveBeenCalledWith(1, 'test');
    });
  });

  describe('throttle', () => {
    it('should limit function execution rate', () => {
      const fn = vi.fn();
      const throttledFn = PerformanceUtils.throttle(fn, 1000);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should execute function immediately on first call', () => {
      const fn = vi.fn();
      const throttledFn = PerformanceUtils.throttle(fn, 1000);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the throttled function', () => {
      const fn = vi.fn();
      const throttledFn = PerformanceUtils.throttle(fn, 1000);

      throttledFn(1, 'test');
      expect(fn).toHaveBeenCalledWith(1, 'test');
    });

    it('should execute after throttle period even with intermediate calls', () => {
      const fn = vi.fn();
      const throttledFn = PerformanceUtils.throttle(fn, 1000);

      throttledFn();
      vi.advanceTimersByTime(500);
      throttledFn();
      vi.advanceTimersByTime(500);
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
