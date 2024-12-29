import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StateUtils } from './stateUtils';

describe('StateUtils', () => {
  beforeEach(() => {
    // Clear all states, history and subscribers before each test
    (StateUtils as any).states = new Map();
    (StateUtils as any).history = new Map();
    (StateUtils as any).subscribers = new Map();
  });

  describe('setState and getState', () => {
    it('should set and get state correctly', () => {
      StateUtils.setState('testKey', 'testValue');
      expect(StateUtils.getState('testKey')).toBe('testValue');
    });

    it('should return undefined for non-existent key', () => {
      expect(StateUtils.getState('nonExistentKey')).toBeUndefined();
    });

    it('should update existing state', () => {
      StateUtils.setState('testKey', 'initialValue');
      StateUtils.setState('testKey', 'updatedValue');
      expect(StateUtils.getState('testKey')).toBe('updatedValue');
    });
  });

  describe('state history', () => {
    it('should keep history when keepHistory option is true', () => {
      StateUtils.setState('testKey', 'value1', { keepHistory: true });
      StateUtils.setState('testKey', 'value2', { keepHistory: true });

      expect(StateUtils.getState('testKey')).toBe('value2');
      expect(StateUtils.undo('testKey')).toBe(true);
      expect(StateUtils.getState('testKey')).toBe('value1');
    });

    it('should not keep history when keepHistory option is false', () => {
      StateUtils.setState('testKey', 'value1');
      StateUtils.setState('testKey', 'value2');

      expect(StateUtils.undo('testKey')).toBe(false);
      expect(StateUtils.getState('testKey')).toBe('value2');
    });

    it('should return false when trying to undo with no history', () => {
      expect(StateUtils.undo('nonExistentKey')).toBe(false);
    });
  });

  describe('subscribers', () => {
    it('should notify subscribers when state changes', () => {
      const subscriber = vi.fn();
      StateUtils.subscribe('testKey', subscriber);

      StateUtils.setState('testKey', 'newValue');
      expect(subscriber).toHaveBeenCalledWith('newValue');
    });

    it('should allow multiple subscribers', () => {
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();

      StateUtils.subscribe('testKey', subscriber1);
      StateUtils.subscribe('testKey', subscriber2);

      StateUtils.setState('testKey', 'newValue');

      expect(subscriber1).toHaveBeenCalledWith('newValue');
      expect(subscriber2).toHaveBeenCalledWith('newValue');
    });

    it('should allow unsubscribing', () => {
      const subscriber = vi.fn();
      const unsubscribe = StateUtils.subscribe('testKey', subscriber);

      StateUtils.setState('testKey', 'value1');
      expect(subscriber).toHaveBeenCalledTimes(1);

      unsubscribe();
      StateUtils.setState('testKey', 'value2');
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not fail when setting state with no subscribers', () => {
      expect(() => {
        StateUtils.setState('testKey', 'value');
      }).not.toThrow();
    });
  });

  describe('complex scenarios', () => {
    it('should handle undo with subscribers', () => {
      const subscriber = vi.fn();
      StateUtils.subscribe('testKey', subscriber);

      StateUtils.setState('testKey', 'value1', { keepHistory: true });
      StateUtils.setState('testKey', 'value2', { keepHistory: true });

      expect(subscriber).toHaveBeenCalledTimes(2);

      StateUtils.undo('testKey');
      expect(subscriber).toHaveBeenCalledTimes(3);
      expect(subscriber).toHaveBeenLastCalledWith('value1');
    });

    it('should handle multiple state keys independently', () => {
      StateUtils.setState('key1', 'value1', { keepHistory: true });
      StateUtils.setState('key2', 'value2', { keepHistory: true });

      StateUtils.setState('key1', 'updatedValue1', { keepHistory: true });

      expect(StateUtils.getState('key1')).toBe('updatedValue1');
      expect(StateUtils.getState('key2')).toBe('value2');

      StateUtils.undo('key1');
      expect(StateUtils.getState('key1')).toBe('value1');
      expect(StateUtils.getState('key2')).toBe('value2');
    });
  });
});
