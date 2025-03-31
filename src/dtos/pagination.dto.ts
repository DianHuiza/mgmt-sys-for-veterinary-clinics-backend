import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().default(1),
  pageSize: z.coerce.number().int().default(15),
});
