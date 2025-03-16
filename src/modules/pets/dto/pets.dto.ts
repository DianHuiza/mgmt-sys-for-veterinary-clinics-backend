import { paginationSchema } from 'src/dtos/pagination.dto';
import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(2),
  birthday: z.date(),
  breed: z.string(),
  species: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  ownerId: z.number(),
});

export const updatePetSchema = createPetSchema.partial();

export const listingPetQuerySchema = paginationSchema;

export type CreatePetDto = z.infer<typeof createPetSchema>;
export type UpdatePetDto = z.infer<typeof updatePetSchema>;
export type ListingPetQueryParams = z.infer<typeof listingPetQuerySchema>;
