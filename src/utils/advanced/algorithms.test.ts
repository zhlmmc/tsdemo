import { describe, it, expect } from "vitest";
import { Algorithms } from "./algorithms";

describe("Algorithms", () => {
  describe("quickSort", () => {
    it("should sort numbers in ascending order", () => {
      const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
      const compareFn = (a: number, b: number) => a - b;
      const sorted = Algorithms.quickSort(arr, compareFn);
      expect(sorted).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
    });

    it("should sort strings in alphabetical order", () => {
      const arr = ["banana", "apple", "orange", "grape"];
      const compareFn = (a: string, b: string) => a.localeCompare(b);
      const sorted = Algorithms.quickSort(arr, compareFn);
      expect(sorted).toEqual(["apple", "banana", "grape", "orange"]);
    });

    it("should handle empty array", () => {
      const arr: number[] = [];
      const compareFn = (a: number, b: number) => a - b;
      const sorted = Algorithms.quickSort(arr, compareFn);
      expect(sorted).toEqual([]);
    });

    it("should handle null or undefined input", () => {
      const compareFn = (a: number, b: number) => a - b;
      expect(
        Algorithms.quickSort(null as unknown as number[], compareFn),
      ).toEqual([]);
      expect(
        Algorithms.quickSort(undefined as unknown as number[], compareFn),
      ).toEqual([]);
    });
  });

  describe("binarySearch", () => {
    it("should find existing element in sorted array", () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const compareFn = (a: number, b: number) => a - b;
      expect(Algorithms.binarySearch(arr, 5, compareFn)).toBe(4);
    });

    it("should return -1 for non-existent element", () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const compareFn = (a: number, b: number) => a - b;
      expect(Algorithms.binarySearch(arr, 10, compareFn)).toBe(-1);
    });

    it("should handle empty array", () => {
      const arr: number[] = [];
      const compareFn = (a: number, b: number) => a - b;
      expect(Algorithms.binarySearch(arr, 1, compareFn)).toBe(-1);
    });

    it("should handle null or undefined input", () => {
      const compareFn = (a: number, b: number) => a - b;
      expect(
        Algorithms.binarySearch(null as unknown as number[], 1, compareFn),
      ).toBe(-1);
      expect(
        Algorithms.binarySearch(undefined as unknown as number[], 1, compareFn),
      ).toBe(-1);
    });
  });

  describe("TreeNode and BST operations", () => {
    it("should create a new tree node", () => {
      const node = Algorithms.createNode(42);
      expect(node.value).toBe(42);
      expect(node.left).toBeNull();
      expect(node.right).toBeNull();
    });

    it("should insert nodes into BST correctly", () => {
      const compareFn = (a: number, b: number) => a - b;
      let root = null;

      root = Algorithms.insertNode(root, 5, compareFn);
      root = Algorithms.insertNode(root, 3, compareFn);
      root = Algorithms.insertNode(root, 7, compareFn);
      root = Algorithms.insertNode(root, 2, compareFn);
      root = Algorithms.insertNode(root, 4, compareFn);
      root = Algorithms.insertNode(root, 6, compareFn);
      root = Algorithms.insertNode(root, 8, compareFn);

      expect(root?.value).toBe(5);
      expect(root?.left?.value).toBe(3);
      expect(root?.right?.value).toBe(7);
      expect(root?.left?.left?.value).toBe(2);
      expect(root?.left?.right?.value).toBe(4);
      expect(root?.right?.left?.value).toBe(6);
      expect(root?.right?.right?.value).toBe(8);
    });

    it("should handle duplicate values in BST", () => {
      const compareFn = (a: number, b: number) => a - b;
      let root = null;

      root = Algorithms.insertNode(root, 5, compareFn);
      root = Algorithms.insertNode(root, 5, compareFn);
      root = Algorithms.insertNode(root, 5, compareFn);

      expect(root?.value).toBe(5);
      expect(root?.right?.value).toBe(5);
      expect(root?.right?.right?.value).toBe(5);
    });
  });
});
