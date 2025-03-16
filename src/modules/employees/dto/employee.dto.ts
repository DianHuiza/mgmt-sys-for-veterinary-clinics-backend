import { Role } from '@prisma/client';
import { paginationSchema } from 'src/dtos/pagination.dto';
import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  password: z.string(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const listingEmployeeQuerySchema = paginationSchema;

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
export type ListingEmployeeQueryParams = z.infer<
  typeof listingEmployeeQuerySchema
>;
