import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Namn är obligatoriskt')
    .max(100, 'Namn får inte vara längre än 100 tecken'),
  email: z
    .string()
    .trim()
    .email('Ogiltig e-postadress')
    .max(255, 'E-post får inte vara längre än 255 tecken'),
  phone: z
    .string()
    .trim()
    .max(20, 'Telefonnummer får inte vara längre än 20 tecken')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(1, 'Meddelande är obligatoriskt')
    .max(2000, 'Meddelande får inte vara längre än 2000 tecken'),
});

export type ContactFormData = z.infer<typeof contactSchema>;