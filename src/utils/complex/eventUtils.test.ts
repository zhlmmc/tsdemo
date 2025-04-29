import { describe, it, expect, vi } from 'vitest';
import { EventUtils } from './eventUtils';

describe('EventUtils', () => {
  describe('on/emit', () => {
    it('should register and trigger event handlers', () => {
      const handler = vi.fn();
      const unsubscribe = EventUtils.on('test', handler);

      EventUtils.emit('test', 'arg1', 'arg2');

      expect(handler).toHaveBeenCalledWith('arg1', 'arg2');

      unsubscribe();
      EventUtils.emit('test');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple handlers for same event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      EventUtils.on('test', handler1);
      EventUtils.on('test', handler2);

      EventUtils.emit('test', 'data');

      expect(handler1).toHaveBeenCalledWith('data');
      expect(handler2).toHaveBeenCalledWith('data');
    });

    it('should safely handle emit for non-existent events', () => {
      expect(() => {
        EventUtils.emit('nonexistent');
      }).not.toThrow();
    });
  });

  describe('processEventQueue', () => {
    it('should process events sequentially by default', async () => {
      const events = [1, 2, 3];
      const results: number[] = [];
      const handler = async (event: number) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        results.push(event);
      };

      await EventUtils.processEventQueue(events, handler);

      expect(results).toEqual([1, 2, 3]);
    });

    it('should handle concurrent processing', async () => {
      const events = [1, 2, 3, 4];
      const inProgress = new Set<number>();
      const maxConcurrent = 2;

      const handler = async (event: number) => {
        inProgress.add(event);
        expect(inProgress.size).toBeLessThanOrEqual(maxConcurrent);
        await new Promise(resolve => setTimeout(resolve, 10));
        inProgress.delete(event);
      };

      await EventUtils.processEventQueue(events, handler, { concurrent: maxConcurrent });
    });

    it('should retry failed events', async () => {
      const event = 'test';
      const handler = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValueOnce(undefined);

      const onError = vi.fn();

      await EventUtils.processEventQueue([event], handler, {
        retryCount: 2,
        onError
      });

      expect(handler).toHaveBeenCalledTimes(3);
      expect(onError).not.toHaveBeenCalled();
    });

    it('should call onError when max retries exceeded', async () => {
      const event = 'test';
      const error = new Error('Test error');
      const handler = vi.fn().mockRejectedValue(error);
      const onError = vi.fn();

      await expect(EventUtils.processEventQueue([event], handler, {
        retryCount: 1,
        onError
      })).rejects.toThrow(error);

      expect(handler).toHaveBeenCalledTimes(2);
      expect(onError).toHaveBeenCalledWith(error, event);
    });

    it('should handle empty event queue', async () => {
      const handler = vi.fn();
      await EventUtils.processEventQueue([], handler);
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
