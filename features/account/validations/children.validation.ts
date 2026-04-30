import { z } from 'zod';

export const ChildrenSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  presentAddress: z.string().min(1, 'Present address is required'),
  socialMediaLink: z.string().nullable().optional(),
  school: z.string().optional(),
});
