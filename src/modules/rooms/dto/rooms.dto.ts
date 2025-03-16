import { paginationSchema } from 'src/dtos/pagination.dto';
import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string(),
  openAt: z.date(),
  closeAt: z.date(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const listingRoomQuerySchema = paginationSchema;

export type CreateRoomDto = z.infer<typeof createRoomSchema>;
export type UpdateRoomDto = z.infer<typeof updateRoomSchema>;
export type ListingRoomQueryParams = z.infer<typeof listingRoomQuerySchema>;