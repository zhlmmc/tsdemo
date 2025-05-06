import { describe, it, expect, vi } from "vitest";
import { AsyncUtils } from "./asyncUtils";

describe("AsyncUtils", () => {
  describe("delay", () => {
    it("should delay execution for specified time", async () => {
      const start = Date.now();
      await AsyncUtils.delay(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(95); // Allow small timing variance
    });
  });

  describe("retry", () => {
    it("should return result if successful on first try", async () => {
      const fn = vi.fn().mockResolvedValue("success");
      const result = await AsyncUtils.retry(fn, {
        maxAttempts: 3,
        delay: 100,
      });
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry on failure and eventually succeed", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValue("success");

      const result = await AsyncUtils.retry(fn, {
        maxAttempts: 3,
        delay: 100,
      });

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should throw error if max attempts reached", async () => {
      const error = new Error("test error");
      const fn = vi.fn().mockRejectedValue(error);

      await expect(
        AsyncUtils.retry(fn, {
          maxAttempts: 3,
          delay: 100,
        }),
      ).rejects.toThrow(error);

      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should apply backoff delay", async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValue("success");

      const start = Date.now();
      await AsyncUtils.retry(fn, {
        maxAttempts: 3,
        delay: 100,
        backoff: 2,
      });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(295); // 100 + 200 ms minimum
    });
  });

  describe("concurrent", () => {
    it("should execute tasks concurrently and return results in order", async () => {
      const tasks = [
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3),
      ];

      const results = await AsyncUtils.concurrent(tasks, 2);
      expect(results).toEqual([1, 2, 3]);
    });

    it("should handle empty task list", async () => {
      const results = await AsyncUtils.concurrent([], 2);
      expect(results).toEqual([]);
    });

    it("should handle errors in tasks", async () => {
      const error = new Error("task error");
      const tasks = [
        async () => {
          await AsyncUtils.delay(10);
          return 1;
        },
        () => Promise.reject(error),
        () => Promise.resolve(3),
      ];

      await expect(AsyncUtils.concurrent(tasks, 2)).rejects.toThrow(error);
    });

    it("should respect concurrency limit", async () => {
      let maxConcurrent = 0;
      let currentConcurrent = 0;
      const running = new Set<number>();

      const createTask = (id: number) => async () => {
        await AsyncUtils.delay(10); // Add small delay before adding to running set
        running.add(id);
        currentConcurrent = running.size;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        await AsyncUtils.delay(50);
        running.delete(id);
        return id;
      };

      const tasks = [
        createTask(1),
        createTask(2),
        createTask(3),
        createTask(4),
      ];

      await AsyncUtils.concurrent(tasks, 2);
      expect(maxConcurrent).toBeLessThanOrEqual(2);
    });
  });
});
