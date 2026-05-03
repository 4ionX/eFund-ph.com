import { supabaseClient } from '@/core/api/supabaseClient';
import type { Documents } from '../types/documents';

export const createDocuments = async (
  documents: Documents,
  userId: string,
): Promise<Documents> => {
  const { data: existing, error: checkError } = await supabaseClient
    .from('documents')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) throw new Error(checkError.message);

  if (existing) {
    throw new Error('You already have uploaded documents.');
  }

  const payload: any = {
    user_id: userId,
    id_type: documents.idType,
    id_url: documents.idUrl,
    business_document_type: documents.businessDocumentType,
  };

  // ✅ OPTIONAL BUSINESS FILE
  if (
    documents.businessDocumentType !== 'None' &&
    documents.businessDocumentUrl
  ) {
    payload.business_document_url = documents.businessDocumentUrl;
  }

  const { data, error } = await supabaseClient
    .from('documents')
    .insert([payload])
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to save documents');
  }

  return {
    idType: data.id_type,
    idUrl: data.id_url,
    businessDocumentType: data.business_document_type,
    businessDocumentUrl: data.business_document_url,
  };
};
