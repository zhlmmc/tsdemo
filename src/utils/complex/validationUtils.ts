/**
 * Validation Rule Interface
 */
interface ValidationRule {
  type?: string;
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
  message?: string;
  nested?: Record<string, ValidationRule>;
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

/**
 * Complex Validation Rule Utility Class
 */
export class ValidationUtils {
  static validateComplex<T extends object>(
    data: T,
    rules: ValidationRules<T>,
  ): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    for (const [key, rule] of Object.entries(rules) as [
      string,
      ValidationRule,
    ][]) {
      const value = data[key as keyof T];
      const fieldErrors: string[] = [];

      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        fieldErrors.push(rule.message || `${key} is required`);
      }

      if (value !== undefined && value !== null) {
        if (rule.type && typeof value !== rule.type) {
          fieldErrors.push(`${key} should be of type ${rule.type}`);
        }

        if (
          rule.pattern &&
          typeof value === "string" &&
          !rule.pattern.test(value)
        ) {
          fieldErrors.push(`${key} does not match required pattern`);
        }

        if (rule.min !== undefined) {
          if (typeof value === "number" && value < rule.min) {
            fieldErrors.push(
              `${key} should be greater than or equal to ${rule.min}`,
            );
          }
          if (typeof value === "string" && value.length < rule.min) {
            fieldErrors.push(
              `${key} should have at least ${rule.min} characters`,
            );
          }
        }

        if (rule.max !== undefined) {
          if (typeof value === "number" && value > rule.max) {
            fieldErrors.push(
              `${key} should be less than or equal to ${rule.max}`,
            );
          }
          if (typeof value === "string" && value.length > rule.max) {
            fieldErrors.push(
              `${key} should have at most ${rule.max} characters`,
            );
          }
        }

        if (rule.custom && !rule.custom(value)) {
          fieldErrors.push(rule.message || `${key} failed custom validation`);
        }

        if (rule.nested && typeof value === "object") {
          const nestedValidation = this.validateComplex(value, rule.nested);
          if (!nestedValidation.isValid) {
            Object.entries(nestedValidation.errors).forEach(
              ([nestedKey, nestedErrors]) => {
                errors[`${key}.${nestedKey}`] = nestedErrors;
              },
            );
          }
        }
      }

      if (fieldErrors.length > 0) {
        errors[key] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
