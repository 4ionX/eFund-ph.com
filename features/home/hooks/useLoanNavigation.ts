import { useNavigationLock } from '@/shared/hooks/ui/useNavigationLock';
import { useCoBorrowerStore } from '@/store/coBorrower.store';
import { useContactReferenceStore } from '@/store/contactReference.store';
import { useDocumentInformationStore } from '@/store/documents.store';
import { usePersonalInformationStore } from '@/store/personalInformation.store';
import { router } from 'expo-router';
import { useCallback } from 'react';

export const useLoanNavigation = () => {
  const { personalInfo } = usePersonalInformationStore();
  const { coBorrowerInfo } = useCoBorrowerStore();

  const { contactInfo } = useContactReferenceStore();
  const { documentsInfo } = useDocumentInformationStore();
  const safeNavigate = useNavigationLock();

  const handleApplyNow = useCallback(() => {
    if (!personalInfo) {
      safeNavigate(() => router.push('/account/personal-information'));
      return;
    }

    if (!coBorrowerInfo) {
      safeNavigate(() => router.push('/account/co-borrower'));
      return;
    }

    if (!contactInfo) {
      safeNavigate(() => router.push('/account/contact-references'));
      return;
    }

    if (!documentsInfo) {
      safeNavigate(() => router.push('/account/documents'));
      return;
    }

    safeNavigate(() => router.push('/loans/loan-application'));
  }, [personalInfo, coBorrowerInfo, contactInfo, documentsInfo, safeNavigate]);

  return { handleApplyNow };
};
