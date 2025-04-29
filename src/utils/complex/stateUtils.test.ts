import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StateUtils } from './stateUtils';

describe('StateUtils', () => {
  beforeEach(() => {
    // Reset internal state before each test
    StateUtils['states'] = new Map();
    StateUtils['history'] = new Map();
    StateUtils['subscribers'] = new Map();
  });

  describe('setState', () => {
    it('should set state value', () => {
      StateUtils.setState('test', 'value');
      expect(StateUtils.getState('test')).toBe('value');
    });

    it('should keep history when option is enabled', () => {
      StateUtils.setState('test', 'value1');
      StateUtils.setState('test', 'value2', { keepHistory: true });
      expect(StateUtils['history'].get('test')).toEqual(['value1']);
    });

    it('should notify subscribers when state changes', () => {
      const subscriber = vi.fn();
      StateUtils.subscribe('test', subscriber);
      StateUtils.setState('test', 'newValue');
      expect(subscriber).toHaveBeenCalledWith('newValue');
    });
  });

  describe('getState', () => {
    it('should return undefined for non-existent key', () => {
      expect(StateUtils.getState('nonexistent')).toBeUndefined();
    });

    it('should return correct state value', () => {
      StateUtils.setState('test', { data: 123 });
      expect(StateUtils.getState('test')).toEqual({ data: 123 });
    });
  });

  describe('subscribe', () => {
    it('should add subscriber and return unsubscribe function', () => {
      const subscriber = vi.fn();
      const unsubscribe = StateUtils.subscribe('test', subscriber);

      StateUtils.setState('test', 'value');
      expect(subscriber).toHaveBeenCalledWith('value');

      unsubscribe();
      StateUtils.setState('test', 'newValue');
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple subscribers', () => {
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();

      StateUtils.subscribe('test', subscriber1);
      StateUtils.subscribe('test', subscriber2);

      StateUtils.setState('test', 'value');

      expect(subscriber1).toHaveBeenCalledWith('value');
      expect(subscriber2).toHaveBeenCalledWith('value');
    });
  });

  describe('undo', () => {
    it('should return false when no history exists', () => {
      expect(StateUtils.undo('test')).toBe(false);
    });

    it('should restore previous state and notify subscribers', () => {
      const subscriber = vi.fn();
      StateUtils.subscribe('test', subscriber);

      StateUtils.setState('test', 'value1');
      StateUtils.setState('test', 'value2', { keepHistory: true });

      expect(StateUtils.undo('test')).toBe(true);
      expect(StateUtils.getState('test')).toBe('value1');
      expect(subscriber).toHaveBeenLastCalledWith('value1');
    });

    it('should handle multiple undo operations', () => {
      StateUtils.setState('test', 'value1');
      StateUtils.setState('test', 'value2', { keepHistory: true });
      StateUtils.setState('test', 'value3', { keepHistory: true });

      expect(StateUtils.undo('test')).toBe(true);
      expect(StateUtils.getState('test')).toBe('value2');

      expect(StateUtils.undo('test')).toBe(true);
      expect(StateUtils.getState('test')).toBe('value1');

      expect(StateUtils.undo('test')).toBe(false);
    });
  });
});
