export function isFloat(value: string | number) {
  return typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value);
}

export function convertToFloat(value: string | number, decimalSize = 2): number {
  if (typeof value === 'number') {
    value = value.toString();
  }
  return parseFloat(parseFloat(value).toFixed(decimalSize));
}
