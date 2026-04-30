import { z } from 'zod';

export const PersonalInformationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),

  middleName: z.string().nullable().optional(),

  lastName: z.string().min(1, 'Last name is required'),

  birthDate: z
    .string()
    .refine((val) => !!val && /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: 'Birth date must be YYYY-MM-DD',
    }),

  civilStatus: z
    .string()
    .refine(
      (status) =>
        ['Single', 'Married', 'Widowed', 'Separated'].includes(status),
      {
        message: 'Civil Status must be Single, Married, Widowed, or Separated',
      },
    ),

  lengthOfStay: z.string().min(1, 'Length of stay is required'),

  presentAddress: z.string().min(1, 'Present address is required'),

  previousAddress: z.string().nullable().optional(),

  sourceOfIncome: z.string().min(1, 'Source of income is required'),

  primaryContactNumber: z.string().min(1, 'Primary contact is required'),

  secondaryContactNumber: z.string().nullable().optional(),

  socialMediaLink: z.string().nullable().optional(),
});
