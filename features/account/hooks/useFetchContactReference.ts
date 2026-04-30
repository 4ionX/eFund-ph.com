import { useQuery } from '@tanstack/react-query';

import { useContactReferenceStore } from '@/store/contactReference.store';
import type { ContactReference } from '../types/contact-reference';
import { fetchContactReference } from '../api/contactReference.api';

const mapSnakeToCamel = (data: any): ContactReference => ({
  contactName: data.contact_name,
  contactNumber: data.contact_number,
  relationship: data.relationship,
});

export const useFetchContactReference = (user_id?: string) => {
  const setContactInfo = useContactReferenceStore(
    (state) => state.setContactInfo,
  );

  return useQuery<ContactReference | null, Error>({
    queryKey: ['contactReference', user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const data = await fetchContactReference(user_id!);

      if (!data.length) return null;

      const mapped = data.map(mapSnakeToCamel);

      setContactInfo(mapped);
      return mapped;
    },

    staleTime: 1000 * 60 * 5,
  });
};
