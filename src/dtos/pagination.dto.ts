import { z } from 'zod';

export const paginationSchema = z.object({
  page: z
    .string()
    .default('1')
    .transform((x) => parseInt(x)),
  pageSize: z
    .string()
    .default('15')
    .transform((x) => parseInt(x)),
});
