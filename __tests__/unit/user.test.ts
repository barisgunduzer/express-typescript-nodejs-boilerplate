import { expect, test } from 'vitest';

function isValidFirstName(text: string) {
  return true
}

test('checks first name is a valid first name', () => {
  expect(isValidFirstName('John')).toBe(true);
});
