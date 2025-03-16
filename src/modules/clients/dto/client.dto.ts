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

export const listingClientSchema = paginationSchema;

export type CreateClientDto = z.infer<typeof createClientSchema>; // Sin el partial, los atributos son requeridos.
export type UpdateClientDto = z.infer<typeof updateClientSchema>; // Con el partial, los atributos son opcionales.
export type ListingClientQueryParams = z.infer<typeof listingClientSchema>;
