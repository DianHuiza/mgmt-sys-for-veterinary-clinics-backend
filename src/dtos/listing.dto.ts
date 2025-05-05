import { z } from 'zod';

export const listingSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'birthday', 'breed', 'species', 'gender', 'ownerId']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  showDeleted: z.boolean().optional(),
})