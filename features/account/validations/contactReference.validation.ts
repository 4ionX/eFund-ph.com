import { z } from 'zod';

export const ContactReferenceSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  relationship: z.string().min(1, 'Relationship is required'),
});
