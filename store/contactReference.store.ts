import type { ContactReference } from '@/features/account/types/contact-reference';
import { create } from 'zustand';

type ContactReferenceState = {
  contactInfo: ContactReference[] | null;
  setContactInfo: (data: ContactReference[]) => void;
  reset: () => void;
};

export const useContactReferenceStore = create<ContactReferenceState>(
  (set) => ({
    contactInfo: null,
    setContactInfo: (data) => set({ contactInfo: data }),
    reset: () => set({ contactInfo: null }),
  }),
);
