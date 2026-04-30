import { usePersonalInformationStore } from '@/store/personalInformation.store';
import { useQuery } from '@tanstack/react-query';

import { mapSnakeToCamel } from '@/shared/utils/makeCamelCase';
import type { PersonalInformation } from '../types/personal-information';
import { fetchPersonalInformation } from '../api/personalInformation.api';

export const useFetchPersonalInformation = (user_id?: string) => {
  const setPersonalInfo = usePersonalInformationStore(
    (state) => state.setPersonalInfo,
  );

  return useQuery<PersonalInformation | null, Error>({
    queryKey: ['personalInformation', user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const data = await fetchPersonalInformation(user_id!);

      if (!data?.length) return null;

      const mapped = mapSnakeToCamel(data[0]) as PersonalInformation;

      setPersonalInfo(mapped);
      return mapped;
    },
    staleTime: 1000 * 60 * 5,
  });
};
