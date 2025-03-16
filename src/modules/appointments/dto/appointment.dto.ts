import { paginationSchema } from 'src/dtos/pagination.dto';
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  date: z.date(),
  description: z.string(),
  roomId: z.number(),
  petId: z.number(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export const listingAppointmentQuerySchema = paginationSchema;

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDto = z.infer<typeof updateAppointmentSchema>;
export type ListingAppointmentQueryParams = z.infer<
  typeof listingAppointmentQuerySchema
>;
