import { Role } from '@prisma/client';
import { paginationSchema } from 'src/dtos/pagination.dto';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  password: z.string(),
});

export const updateUserSchema = createUserSchema.partial();

export const listingUserQuerySchema = paginationSchema;

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ListingUserQueryParams = z.infer<
  typeof listingUserQuerySchema
>;
