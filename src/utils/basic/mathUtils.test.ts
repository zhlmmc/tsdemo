import { describe, it, expect } from 'vitest';
import { MathUtils } from './mathUtils';

describe('MathUtils', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(MathUtils.add(2, 3)).toBe(5);
    });

    it('should add a positive and negative number correctly', () => {
      expect(MathUtils.add(5, -3)).toBe(2);
    });

    it('should add two negative numbers correctly', () => {
      expect(MathUtils.add(-2, -3)).toBe(-5);
    });

    it('should handle zero correctly', () => {
      expect(MathUtils.add(0, 5)).toBe(5);
      expect(MathUtils.add(5, 0)).toBe(5);
      expect(MathUtils.add(0, 0)).toBe(0);
    });
  });

  describe('sum', () => {
    it('should return 0 for empty array', () => {
      expect(MathUtils.sum([])).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(MathUtils.sum(null as unknown as number[])).toBe(0);
    });

    it('should calculate sum of positive numbers', () => {
      expect(MathUtils.sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should calculate sum of mixed positive and negative numbers', () => {
      expect(MathUtils.sum([-1, 2, -3, 4, -5])).toBe(-3);
    });

    it('should handle array with single number', () => {
      expect(MathUtils.sum([5])).toBe(5);
    });
  });

  describe('average', () => {
    it('should return 0 for empty array', () => {
      expect(MathUtils.average([])).toBe(0);
    });

    it('should return 0 for null input', () => {
      expect(MathUtils.average(null as unknown as number[])).toBe(0);
    });

    it('should calculate average of positive numbers', () => {
      expect(MathUtils.average([2, 4, 6, 8, 10])).toBe(6);
    });

    it('should calculate average of mixed positive and negative numbers', () => {
      expect(MathUtils.average([-2, 2, -4, 4])).toBe(0);
    });

    it('should handle array with single number', () => {
      expect(MathUtils.average([5])).toBe(5);
    });
  });

  describe('findMax', () => {
    it('should return null for empty array', () => {
      expect(MathUtils.findMax([])).toBeNull();
    });

    it('should return null for null input', () => {
      expect(MathUtils.findMax(null as unknown as number[])).toBeNull();
    });

    it('should find maximum in positive numbers array', () => {
      expect(MathUtils.findMax([1, 3, 5, 2, 4])).toBe(5);
    });

    it('should find maximum in mixed positive and negative numbers array', () => {
      expect(MathUtils.findMax([-1, -5, 0, -2, -3])).toBe(0);
    });

    it('should handle array with single number', () => {
      expect(MathUtils.findMax([5])).toBe(5);
    });
  });

  describe('findMin', () => {
    it('should return null for empty array', () => {
      expect(MathUtils.findMin([])).toBeNull();
    });

    it('should return null for null input', () => {
      expect(MathUtils.findMin(null as unknown as number[])).toBeNull();
    });

    it('should find minimum in positive numbers array', () => {
      expect(MathUtils.findMin([1, 3, 5, 2, 4])).toBe(1);
    });

    it('should find minimum in mixed positive and negative numbers array', () => {
      expect(MathUtils.findMin([-1, -5, 0, -2, -3])).toBe(-5);
    });

    it('should handle array with single number', () => {
      expect(MathUtils.findMin([5])).toBe(5);
    });
  });
});
