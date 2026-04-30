import { toNullable } from '@/shared/utils/toNullable';
import { supabaseClient } from '@/core/api/supabaseClient';
import type { PersonalInformation } from '../types/personal-information';

export const createPersonalInformation = async (
  personalInfo: PersonalInformation,
  userId: string,
): Promise<PersonalInformation> => {
  // =========================
  // 1. CHECK IF EXISTS
  // =========================
  const { data: existing, error: checkError } = await supabaseClient
    .from('personal_informations')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  // 🚨 IF EXISTS → BLOCK INSERT
  if (existing) {
    throw new Error('Personal information already exists for this user.');
  }

  // =========================
  // 2. INSERT ONLY IF NONE
  // =========================
  const { data: result, error } = await supabaseClient
    .from('personal_informations')
    .insert([
      {
        user_id: userId,
        first_name: personalInfo.firstName,
        middle_name: toNullable(personalInfo.middleName),
        last_name: personalInfo.lastName,
        birth_date: personalInfo.birthDate,
        civil_status: personalInfo.civilStatus,
        length_of_stay: personalInfo.lengthOfStay,
        present_address: personalInfo.presentAddress,
        previous_address: toNullable(personalInfo.previousAddress),
        source_of_income: personalInfo.sourceOfIncome,
        primary_contact_number: personalInfo.primaryContactNumber,
        secondary_contact_number: toNullable(
          personalInfo.secondaryContactNumber,
        ),
        social_media_link: toNullable(personalInfo.socialMediaLink),
      },
    ])
    .select('*')
    .single();

  if (error || !result) {
    throw new Error(error?.message ?? 'Failed to create personal information');
  }

  return {
    firstName: result.first_name,
    middleName: result.middle_name ?? '',
    lastName: result.last_name,
    birthDate: result.birth_date,
    civilStatus: result.civil_status,
    lengthOfStay: result.length_of_stay,
    presentAddress: result.present_address,
    previousAddress: result.previous_address ?? '',
    sourceOfIncome: result.source_of_income,
    primaryContactNumber: result.primary_contact_number,
    secondaryContactNumber: result.secondary_contact_number ?? '',
    socialMediaLink: result.social_media_link ?? '',
  };
};
