// -----------------------------
// ID TYPES
// -----------------------------
export type PhilippineIDType =
  | 'PhilSys ID (National ID)'
  | 'Passport'
  | "Driver's License"
  | 'UMID'
  | 'SSS ID'
  | 'GSIS ID'
  | 'PRC ID'
  | "Voter's ID"
  | 'Postal ID'
  | 'PhilHealth ID'
  | 'TIN ID'
  | 'Senior Citizen ID'
  | 'PWD ID'
  | 'Barangay ID'
  | 'Police Clearance'
  | 'NBI Clearance'
  | 'OWWA ID'
  | "Seaman's Book"
  | 'Company ID'
  | 'Student ID'
  | 'Other';

// -----------------------------
// BUSINESS DOCUMENT TYPES
// -----------------------------
export type BusinessDocumentType =
  | 'DTI Certificate'
  | 'SEC Registration'
  | 'CDA Registration'
  | "Mayor's Permit"
  | 'Barangay Business Clearance'
  | 'BIR Certificate of Registration (Form 2303)'
  | 'Business Permit'
  | 'Audited Financial Statement'
  | 'Income Tax Return'
  | 'Lease Contract'
  | 'Proof of Billing'
  | 'Other'
  | 'None';

// -----------------------------
// MAIN INTERFACE
// -----------------------------
export interface Documents {
  id?: string;
  userId?: string;
  idType: PhilippineIDType;
  idUrl: string;
  businessDocumentType?: BusinessDocumentType | null;
  businessDocumentUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
