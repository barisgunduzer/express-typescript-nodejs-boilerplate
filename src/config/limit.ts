import { Request } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '@base/utils/env';

const rateLimiter = rateLimit({
  legacyHeaders: true,
  limit: Number(env('COMMON_RATE_LIMIT_MAX_REQUESTS')),
  message: env('Too many requests, please try again later.'),
  standardHeaders: true,
  windowMs: 15 * 60 * Number(env('COMMON_RATE_LIMIT_WINDOW_MS')),
  keyGenerator: (req: Request) => req.ip as string,
});

export default rateLimiter;
