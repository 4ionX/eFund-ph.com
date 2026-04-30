import type { Documents } from '@/features/account/types/documents';
import { create } from 'zustand';

type DocumentsState = {
  documentsInfo: Documents | null;
  setdocumentsInfo: (data: Documents) => void;
  reset: () => void;
};

export const useDocumentInformationStore = create<DocumentsState>((set) => ({
  documentsInfo: null,
  setdocumentsInfo: (data) => set({ documentsInfo: data }),
  reset: () => set({ documentsInfo: null }),
}));
