import { supabaseClient } from '@/core/api/supabaseClient';
import type { ContactReference } from '../types/contact-reference';

export const createContactReference = async (
  contactReferences: ContactReference[],
  userId: string,
): Promise<ContactReference[]> => {
  // =========================
  // 1. CHECK IF USER ALREADY HAS DATA
  // =========================
  const { data: existing, error: checkError } = await supabaseClient
    .from('contact_references')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (checkError) {
    throw new Error(checkError.message);
  }

  // 🚨 BLOCK IF EXISTS
  if (existing && existing.length > 0) {
    throw new Error('Contact references already exist for this user.');
  }

  // =========================
  // 2. INSERT (ONLY IF NONE)
  // =========================
  const { data, error } = await supabaseClient
    .from('contact_references')
    .insert(
      contactReferences.map((ref) => ({
        user_id: userId,
        contact_name: ref.contactName,
        contact_number: ref.contactNumber,
        relationship: ref.relationship,
      })),
    )
    .select('*');

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to save contact references');
  }

  // =========================
  // 3. MAP RESPONSE
  // =========================
  return data.map((item) => ({
    contactName: item.contact_name,
    contactNumber: item.contact_number,
    relationship: item.relationship,
  }));
};
