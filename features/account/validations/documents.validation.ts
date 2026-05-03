import { z } from 'zod';

// -----------------------------
// ENUMS
// -----------------------------
export const PhilippineIDTypeEnum = z.enum([
  'PhilSys ID (National ID)',
  'Passport',
  "Driver's License",
  'UMID',
  'SSS ID',
  'GSIS ID',
  'PRC ID',
  "Voter's ID",
  'Postal ID',
  'PhilHealth ID',
  'TIN ID',
  'Senior Citizen ID',
  'PWD ID',
  'Barangay ID',
  'Police Clearance',
  'NBI Clearance',
  'OWWA ID',
  "Seaman's Book",
  'Company ID',
  'Student ID',
  'Other',
]);

export const BusinessDocumentTypeEnum = z.enum([
  'DTI Certificate',
  'SEC Registration',
  'CDA Registration',
  "Mayor's Permit",
  'Barangay Business Clearance',
  'BIR Certificate of Registration (Form 2303)',
  'Business Permit',
  'Audited Financial Statement',
  'Income Tax Return',
  'Lease Contract',
  'Proof of Billing',
  'Other',
  'None',
]);

// -----------------------------
// SCHEMA
// -----------------------------
export const DocumentsSchema = z
  .object({
    idType: PhilippineIDTypeEnum,

    idUrl: z.string().min(1, 'Valid ID is required').url('Invalid ID URL'),

    businessDocumentType: BusinessDocumentTypeEnum.nullable().optional(),

    businessDocumentUrl: z
      .string()
      .url('Invalid business document URL')
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const needsBusinessDoc = data.businessDocumentType !== 'None';

      if (!needsBusinessDoc) return true;

      return !!data.businessDocumentUrl;
    },
    {
      message: 'Business document file is required',
      path: ['businessDocumentUrl'],
    },
  );
