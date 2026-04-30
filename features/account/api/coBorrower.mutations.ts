import { supabaseClient } from '@/core/api/supabaseClient';
import type { CoBorrower } from '../types/co-borrower';

export const createCoBorrowerWithChildren = async (
  data: CoBorrower,
  userId: string,
) => {
  const { data: result, error } = await supabaseClient.rpc(
    'create_co_borrower_with_children',
    {
      p_user_id: userId,
      p_first_name: data.firstName,
      p_middle_name: data.middleName ?? null,
      p_last_name: data.lastName,
      p_birth_date: data.birthDate,

      p_civil_status: data.civilStatus,
      p_length_of_stay: data.lengthOfStay,
      p_present_address: data.presentAddress,
      p_previous_address: data.previousAddress ?? null,

      p_source_of_income: data.sourceOfIncome,
      p_primary_contact_number: data.primaryContactNumber,
      p_secondary_contact_number: data.secondaryContactNumber ?? null,
      p_social_media_link: data.socialMediaLink ?? null,

      p_children: data.children?.length ? data.children : null,
    },
  );

  if (error) throw error;

  return result;
};
