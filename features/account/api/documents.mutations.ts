import { supabaseClient } from '@/core/api/supabaseClient';
import type { Documents } from '../types/documents';

export const createDocuments = async (
  documents: Documents,
  userId: string,
): Promise<Documents> => {
  // =========================
  // 1. CHECK EXISTING DOCUMENT
  // =========================
  const { data: existing, error: checkError } = await supabaseClient
    .from('documents')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  // 🚨 BLOCK IF EXISTS
  if (existing) {
    throw new Error('You already have uploaded documents.');
  }

  // =========================
  // 2. INSERT ONLY IF NONE
  // =========================
  const { data, error } = await supabaseClient
    .from('documents')
    .insert([
      {
        user_id: userId,
        id_type: documents.idType,
        id_url: documents.idUrl,
        business_document_type: documents.businessDocumentType,
        business_document_url: documents.businessDocumentUrl,
      },
    ])
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to save documents');
  }

  // =========================
  // 3. RETURN MAPPED DATA
  // =========================
  return {
    idType: data.id_type,
    idUrl: data.id_url,
    businessDocumentType: data.business_document_type,
    businessDocumentUrl: data.business_document_url,
  };
};
