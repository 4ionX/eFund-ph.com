export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated';

export interface PersonalInformation {
  id?: string;
  userId?: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  birthDate: string;
  civilStatus: CivilStatus;
  lengthOfStay: string;
  presentAddress: string;
  previousAddress?: string | null;
  sourceOfIncome: string;
  primaryContactNumber: string;
  secondaryContactNumber?: string | null;
  socialMediaLink?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
