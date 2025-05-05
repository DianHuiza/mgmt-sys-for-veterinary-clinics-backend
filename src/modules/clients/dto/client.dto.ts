import { listingSchema } from 'src/dtos/listing.dto';
import { paginationSchema } from 'src/dtos/pagination.dto';
import { z } from 'zod';

export const createClientSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
    phone: z.string(),
    dni: z.string(),
  })
  .strict();

export const updateClientSchema = createClientSchema.partial();

export const listingClientSchema = paginationSchema.merge(listingSchema);

export type CreateClientDto = z.infer<typeof createClientSchema>; 
export type UpdateClientDto = z.infer<typeof updateClientSchema>;
export type ListingClientQueryParams = z.infer<typeof listingClientSchema>;
