import * as dotenv from 'dotenv';

dotenv.config(); // { path: `.env.example.development.${process.env.NODE_ENV}` }

// Use it for multienv files in codebase but its not safe
// if (process.env.NODE_ENV == '' || (process.env.NODE_ENV != '' && !fs.existsSync(`.env.example.${process.env.NODE_ENV}`))) {
//   dotenv.config();
// } else {
//   dotenv.config({path: `.env.example.${process.env.NODE_ENV}`});

export function env(key: string, defaultValue: null | string = null): string {
  return process.env[key] ?? (defaultValue as string);
}

export function envOrFail(key: string): string {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
}
