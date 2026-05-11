import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import EFImage from '@/shared/components/ui/EFImage';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';

import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';

import { Spacing } from '@/shared/constants/theme';

import { useDocumentsForm } from '../hooks/useDocumentsForm';
import { useFileUpload } from '../hooks/useFileUpload';

import type {
  BusinessDocumentType,
  PhilippineIDType,
} from '../types/documents';

const DocumentsForm = ({ initialData }: any) => {
  const {
    isSubmitting,
    formData,
    isLoading,
    handleChange,
    handleSave,
    pickImage,
    isLocked,
  } = useDocumentsForm({ initialData });

  const { getSignedUrl } = useFileUpload();

  const [idImageUrl, setIdImageUrl] = useState<string | null>(null);
  const [businessImageUrl, setBusinessImageUrl] = useState<string | null>(null);

  const [showIdDropdown, setShowIdDropdown] = useState(false);
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);

  const isLocalFile = (value?: string | null) =>
    !!value &&
    (value.startsWith('file://') ||
      value.startsWith('content://') ||
      value.startsWith('blob:') ||
      value.startsWith('data:'));

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!formData.idUrl) return setIdImageUrl(null);

      try {
        if (isLocalFile(formData.idUrl)) {
          setIdImageUrl(formData.idUrl);
          return;
        }

        const url = await getSignedUrl(formData.idUrl);

        if (alive) {
          setIdImageUrl(url);
        }
      } catch (err) {
        console.log('ID error:', err);
      }
    };

    load();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.idUrl]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!formData.businessDocumentUrl) {
        return setBusinessImageUrl(null);
      }

      try {
        if (isLocalFile(formData.businessDocumentUrl)) {
          setBusinessImageUrl(formData.businessDocumentUrl);
          return;
        }

        const url = await getSignedUrl(formData.businessDocumentUrl);

        if (alive) {
          setBusinessImageUrl(url);
        }
      } catch (err) {
        console.log('Business error:', err);
      }
    };

    load();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.businessDocumentUrl]);

  const PHILIPPINE_ID_TYPES: PhilippineIDType[] = [
    'PhilSys ID (National ID)',
    'Passport',
    "Driver's License",
    'UMID',
    'SSS ID',
    'GSIS ID',
    'PRC ID',
    "Voter's ID",
    'Postal ID',
    'PhilHealth ID',
    'TIN ID',
    'Senior Citizen ID',
    'PWD ID',
    'Barangay ID',
    'Police Clearance',
    'NBI Clearance',
    'OWWA ID',
    "Seaman's Book",
    'Company ID',
    'Student ID',
    'Other',
  ];

  const BUSINESS_DOCUMENT_TYPES: BusinessDocumentType[] = [
    'DTI Certificate',
    'SEC Registration',
    'CDA Registration',
    "Mayor's Permit",
    'Barangay Business Clearance',
    'BIR Certificate of Registration (Form 2303)',
    'Business Permit',
    'Audited Financial Statement',
    'Income Tax Return',
    'Lease Contract',
    'Proof of Billing',
    'Other',
    'None',
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ================= ID TYPE ================= */}

        <ThemedText type="defaultSemiBold" style={styles.label}>
          ID Type
        </ThemedText>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLocked}
          onPress={() => setShowIdDropdown(true)}
          style={styles.dropdown}
        >
          <ThemedText numberOfLines={1}>{formData.idType}</ThemedText>

          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* ================= ID UPLOAD ================= */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => pickImage('idUrl')}
          disabled={isLocked}
          style={styles.upload}
        >
          {idImageUrl ? (
            <EFImage
              source={idImageUrl}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="cloud-upload-outline" size={42} color="#9CA3AF" />

              <ThemedText type="defaultSemiBold">Upload Valid ID</ThemedText>

              <ThemedText type="description">JPG, PNG supported</ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {/* ================= BUSINESS TYPE ================= */}

        <ThemedText type="defaultSemiBold" style={styles.label}>
          Business Document Type
        </ThemedText>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLocked}
          onPress={() => setShowBusinessDropdown(true)}
          style={styles.dropdown}
        >
          <ThemedText numberOfLines={1}>
            {formData.businessDocumentType}
          </ThemedText>

          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* ================= BUSINESS UPLOAD ================= */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => pickImage('businessDocumentUrl')}
          disabled={isLocked}
          style={styles.upload}
        >
          {businessImageUrl ? (
            <EFImage
              source={businessImageUrl}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="document-outline" size={42} color="#9CA3AF" />

              <ThemedText type="defaultSemiBold">
                Upload Business Document
              </ThemedText>

              <ThemedText type="description">
                Optional if none selected
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {/* ================= SAVE ================= */}

        {!initialData && (
          <View style={styles.footer}>
            <AnimatedButton
              label={isLoading || isSubmitting ? 'Saving...' : 'Save'}
              onPress={handleSave}
              disabled={isLoading}
            />
          </View>
        )}
      </ScrollView>

      {/* ================= ID MODAL ================= */}

      <Modal visible={showIdDropdown} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setShowIdDropdown(false)}
        >
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PHILIPPINE_ID_TYPES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    handleChange('idType', item);
                    setShowIdDropdown(false);
                  }}
                >
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* ================= BUSINESS MODAL ================= */}

      <Modal visible={showBusinessDropdown} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setShowBusinessDropdown(false)}
        >
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {BUSINESS_DOCUMENT_TYPES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    handleChange('businessDocumentType', item);
                    setShowBusinessDropdown(false);
                  }}
                >
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
};

export default DocumentsForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },

  label: {
    marginBottom: 8,
  },

  dropdown: {
    height: 56,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderRadius: 16,

    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 20,

    backgroundColor: '#FFFFFF',
  },

  upload: {
    height: 220,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',

    marginBottom: 24,

    backgroundColor: '#FFFFFF',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',

    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modal: {
    maxHeight: Platform.OS === 'ios' ? '70%' : '75%',

    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    paddingVertical: 12,

    overflow: 'hidden',
  },

  option: {
    paddingHorizontal: 20,
    paddingVertical: 16,

    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  footer: {
    marginTop: 8,
    marginBottom: 40,
  },
});
