import { useQuery } from '@tanstack/react-query';

import { useCoBorrowerStore } from '@/store/coBorrower.store';
import type { Children } from '../types/children';
import type { CoBorrower } from '../types/co-borrower';
import { fetchCoBorrowers } from '../api/coBorrower.api';

const mapSnakeToCamel = (data: any): CoBorrower => ({
  firstName: data.first_name,
  middleName: data.middle_name,
  lastName: data.last_name,
  birthDate: data.birth_date,
  civilStatus: data.civil_status,
  lengthOfStay: data.length_of_stay,
  presentAddress: data.present_address,
  previousAddress: data.previous_address,
  sourceOfIncome: data.source_of_income,
  primaryContactNumber: data.primary_contact_number,
  secondaryContactNumber: data.secondary_contact_number,
  socialMediaLink: data.social_media_link,

  children:
    data.childrenCollection?.edges?.map(
      (c: any): Children => ({
        firstName: c.node.first_name,
        middleName: c.node.middle_name,
        lastName: c.node.last_name,
        presentAddress: c.node.present_address,
        socialMediaLink: c.node.social_media_link,
        school: c.node.school,
      }),
    ) ?? [],
});

export const useFetchCoBorrowers = (user_id?: string) => {
  const setCoBorrowerInfo = useCoBorrowerStore(
    (state) => state.setCoBorrowerInfo,
  );

  return useQuery<CoBorrower | null, Error>({
    queryKey: ['coBorrowers', user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const res = await fetchCoBorrowers(user_id!);

      const nodes =
        res?.co_borrowersCollection?.edges?.map((e: any) => e.node) ?? [];

      if (!nodes.length) return null;

      const mapped = mapSnakeToCamel(nodes[0]);

      setCoBorrowerInfo(mapped);
      return mapped;
    },
    staleTime: 1000 * 60 * 5,
  });
};
