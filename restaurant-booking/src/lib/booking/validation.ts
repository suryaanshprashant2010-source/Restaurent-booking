import { z } from 'zod';

export const bookingSchema = z.object({
  roomSlug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.number().int().min(1).max(200),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(40),
  specialRequests: z.string().max(1000).optional().or(z.literal('')),
  payDeposit: z.boolean().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const lookupSchema = z.object({
  reference: z.string().min(5).max(40),
  email: z.string().email(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal('')),
  message: z.string().min(10).max(2000),
});
