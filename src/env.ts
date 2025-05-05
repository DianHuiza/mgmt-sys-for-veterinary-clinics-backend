import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().optional().default(3000),
  DATABASE_URL: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
});

export const env = envSchema.parse(process.env);
