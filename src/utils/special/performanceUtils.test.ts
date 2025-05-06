import { describe, it, expect, vi, beforeEach } from 'vitest';
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
      const keyGen = (x: number, y: number) => `${x}-${y}`;
      const memoizedFn = PerformanceUtils.memoize(fn, keyGen);

      expect(memoizedFn(1, 2)).toBe(3);
      expect(memoizedFn(1, 2)).toBe(3);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debouncedFn = PerformanceUtils.debounce(fn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const fn = vi.fn();
      const debouncedFn = PerformanceUtils.debounce(fn, 1000);

      debouncedFn(1, 'test');
      vi.advanceTimersByTime(1000);

      expect(fn).toHaveBeenCalledWith(1, 'test');
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
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

    it('should pass arguments to throttled function', () => {
      const fn = vi.fn();
      const throttledFn = PerformanceUtils.throttle(fn, 1000);

      throttledFn(1, 'test');
      expect(fn).toHaveBeenCalledWith(1, 'test');
    });
  });
});
