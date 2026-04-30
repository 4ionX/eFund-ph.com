import { useQuery } from '@tanstack/react-query';
import { useDocumentInformationStore } from '@/store/documents.store';

import type { Documents } from '../types/documents';
import { fetchDocuments } from '../api/documents.api';

const mapSnakeToCamel = (data: any): Documents => ({
  idType: data.id_type,
  idUrl: data.id_url,
  businessDocumentType: data.business_document_type,
  businessDocumentUrl: data.business_document_url,
});

export const useFetchDocuments = (user_id?: string) => {
  const setdocumentsInfo = useDocumentInformationStore(
    (state) => state.setdocumentsInfo,
  );

  return useQuery<Documents | null, Error>({
    queryKey: ['documents', user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const data = await fetchDocuments(user_id!);

      if (!data.length) return null;

      const mapped = mapSnakeToCamel(data[0]);

      setdocumentsInfo(mapped);
      return mapped;
    },

    staleTime: 1000 * 60 * 5,
  });
};
