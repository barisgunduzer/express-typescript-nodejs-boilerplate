export function toBool(value: string): boolean {
  return value === 'true';
}

export function isPromise(obj?: any) {
  return obj !== null && typeof obj === 'object' && typeof obj.then === 'function' && typeof obj.catch === 'function';
}
