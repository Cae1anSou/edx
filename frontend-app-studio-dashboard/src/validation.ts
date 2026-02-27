const KEY_PATTERN = /^[^\s!'()*]+$/;
const MAX_SUM_KEY_LENGTH = 65;

export function validateRequired(value: string): string | null {
  return value.trim() ? null : 'Required field.';
}

export function validateKeyField(value: string): string | null {
  const required = validateRequired(value);
  if (required) {
    return required;
  }
  if (!KEY_PATTERN.test(value)) {
    return 'Please do not use any spaces or special characters in this field.';
  }
  return null;
}

export function validateCombinedKeyLength(values: string[]): string | null {
  const sum = values.reduce((acc, value) => acc + value.length, 0);
  if (sum > MAX_SUM_KEY_LENGTH) {
    return `The combined length of key fields cannot be more than ${MAX_SUM_KEY_LENGTH} characters.`;
  }
  return null;
}
