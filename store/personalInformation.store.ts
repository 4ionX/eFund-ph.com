import type { PersonalInformation } from '@/features/account/types/personal-information';
import { create } from 'zustand';

type PersonalInformationState = {
  personalInfo: PersonalInformation | null;
  setPersonalInfo: (data: PersonalInformation) => void;
  reset: () => void;
};

export const usePersonalInformationStore = create<PersonalInformationState>(
  (set) => ({
    personalInfo: null,
    setPersonalInfo: (data) => set({ personalInfo: data }),
    reset: () => set({ personalInfo: null }),
  }),
);
