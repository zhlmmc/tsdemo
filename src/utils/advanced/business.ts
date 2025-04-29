/**
 * Advanced business logic implementations
 */
export class Business {
  /**
   * Shopping cart calculation
   */
  static calculateCart(
    items: {
      id: string;
      price: number;
      quantity: number;
      discount?: number;
    }[],
  ): {
    subtotal: number;
    discount: number;
    total: number;
  } {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discount = items.reduce(
      (sum, item) => sum + (item.discount || 0) * item.price * item.quantity,
      0,
    );

    return {
      subtotal,
      discount,
      total: subtotal - discount,
    };
  }

  /**
   * User permission validation
   */
  static validatePermissions(
    user: {
      roles: string[];
      permissions: string[];
    },
    requiredPermissions: string[],
  ): boolean {
    const hasAdminRole = user.roles.includes("admin");
    if (hasAdminRole) return true;

    return requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
  }

  /**
   * Data statistical analysis
   */
  static analyzeData(data: number[]): {
    mean: number;
    median: number;
    mode: number[];
    variance: number;
  } {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;

    const sortedData = [...data].sort((a, b) => a - b);
    const median =
      sortedData.length % 2 === 0
        ? (sortedData[sortedData.length / 2 - 1] +
            sortedData[sortedData.length / 2]) /
          2
        : sortedData[Math.floor(sortedData.length / 2)];

    const frequency: Map<number, number> = new Map();
    let maxFreq = 0;
    data.forEach((val) => {
      const freq = (frequency.get(val) || 0) + 1;
      frequency.set(val, freq);
      maxFreq = Math.max(maxFreq, freq);
    });

    const mode = Array.from(frequency.entries())
      .filter(([_, freq]) => freq === maxFreq)
      .map(([val]) => val);

    const variance =
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;

    return { mean, median, mode, variance };
  }
}
