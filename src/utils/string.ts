import { AppException } from '@api/exceptions/Application/AppException';

const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';

export function randomNumber(size: number): string {
  const number = Math.floor(Math.random() * 10 ** size);
  let stringType = number.toString();
  if (stringType.length < size) {
    const diff = size - stringType.length;
    for (let i = 0; i < diff; i++) {
      stringType += i.toString();
    }
  }
  return stringType;
}

export function randomString(size: number, isUpperAll = false) {
  const randomArray = Array.from({ length: size }, (v, k) => chars[Math.floor(Math.random() * chars.length)]);
  const randomString = randomArray.join('');
  return isUpperAll ? randomString.toUpperCase() : randomString;
}

export function clearSpecialChars(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/\s+$/, '');
}

export function assertPhone(phone: string) {
  phone = clearSpecialChars(phone);
  if (phone.startsWith('90') && phone.length === 12) {
    return phone;
  }

  if (phone.startsWith('0')) {
    phone = `9${phone}`;
  }

  if (phone.startsWith('5')) {
    phone = `90${phone}`;
  }

  if (phone.length < 12) {
    throw new AppException('Invalid phone number');
  }

  return phone;
}

export function hideCharacter(value: string, startIndex = 2, isFixed = true, store: string[] = []): string {
  if (value.length < 3) {
    return value;
  }
  if (value.length <= startIndex) {
    startIndex = value.length - 2;
  }

  if (value.search(' ') > -1) {
    const words = value.split(' ');
    for (const word of words) {
      store.push(hideCharacter(word, startIndex, isFixed, store));
    }
    return store.join(' ');
  }

  const firstChars = value.substring(0, startIndex);

  const remainingChars = isFixed
    ? '***'
    : value
        .substring(startIndex)
        .split('')
        .map(() => '*')
        .join('');
  return `${firstChars}${remainingChars}`;
}

export function replaceAll(value: string, target: string) {
  const search = '/';
  const replacer = new RegExp(search, 'g');
  return value.replace(replacer, target);
}

export function fillZero(value: number | string, size = 6, side: 'left' | 'right' = 'left', needle = '0'): string {
  const valueString = value.toString();
  if (valueString.length >= size) {
    return valueString;
  }

  const diff = size - valueString.length;
  const zeros = [];
  for (let i = 0; i < diff; i++) {
    zeros.push(needle);
  }
  return side == 'left' ? `${zeros.join('')}${valueString}` : `${valueString}${zeros.join('')}`;
}

export function isNullOrEmpty(value: any, checkZeroValue = false) {
  const isCheck = typeof value === 'undefined' || value === null || value === '' || value.length == 0;
  if (checkZeroValue) {
    return isCheck || (typeof value === 'number' && value === 0);
  }
  return isCheck;
}

export function generateBlankString(size: number, existsValue = ' ') {
  return fillZero(existsValue, size, 'right', ' ');
}

export function generateOTP(length: number): string {
  const charset = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    otp += charset[randomIndex];
  }

  return otp;
}

export function parseFullName(fullName: string): { firstName: string; lastName: string } {
  const separateFullName = fullName.split(' ');
  if (separateFullName.length === 1) {
    return { firstName: separateFullName.pop(), lastName: '' };
  }
  const lastName = separateFullName.pop();
  const firstName = separateFullName.join(' ');
  return { firstName, lastName };
}
