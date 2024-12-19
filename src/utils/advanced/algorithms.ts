/**
 * 高级算法实现
 */
export class Algorithms {
    /**
     * 树节点类
     */
    static TreeNode = class<T> {
        value: T;
        left: InstanceType<typeof Algorithms.TreeNode<T>> | null = null;
        right: InstanceType<typeof Algorithms.TreeNode<T>> | null = null;

        constructor(value: T) {
            this.value = value;
        }
    }

    /**
     * 快速排序
     */
    static quickSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
        if (!arr || arr.length <= 1) return arr || [];

        const pivot = arr[Math.floor(arr.length / 2)];
        const left = arr.filter(x => compareFn(x, pivot) < 0);
        const middle = arr.filter(x => compareFn(x, pivot) === 0);
        const right = arr.filter(x => compareFn(x, pivot) > 0);

        return [...this.quickSort(left, compareFn), ...middle, ...this.quickSort(right, compareFn)];
    }

    /**
     * 二分查找
     */
    static binarySearch<T>(arr: T[], target: T, compareFn: (a: T, b: T) => number): number {
        if (!arr || arr.length === 0) return -1;

        let left = 0;
        let right = arr.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const comparison = compareFn(arr[mid], target);

            if (comparison === 0) return mid;
            if (comparison < 0) left = mid + 1;
            else right = mid - 1;
        }

        return -1;
    }

    /**
     * 创建新的树节点
     */
    static createNode<T>(value: T): InstanceType<typeof Algorithms.TreeNode<T>> {
        return new this.TreeNode(value);
    }

    /**
     * 插入节点到二叉搜索树
     */
    static insertNode<T>(
        root: InstanceType<typeof Algorithms.TreeNode<T>> | null,
        value: T,
        compareFn: (a: T, b: T) => number
    ): InstanceType<typeof Algorithms.TreeNode<T>> {
        if (!root) return this.createNode(value);

        if (compareFn(value, root.value) < 0) {
            root.left = this.insertNode(root.left, value, compareFn);
        } else {
            root.right = this.insertNode(root.right, value, compareFn);
        }

        return root;
    }
} 