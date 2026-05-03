import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';

import { Spacing } from '@/shared/constants/theme';
import EFImage from '@/shared/components/ui/EFImage';
import { Ionicons } from '@expo/vector-icons';
import { useDocumentsForm } from '../hooks/useDocumentsForm';
import { useFileUpload } from '../hooks/useFileUpload';
import type {
  BusinessDocumentType,
  PhilippineIDType,
} from '../types/documents';

const DocumentsForm = ({ initialData }: any) => {
  const { formData, isLoading, handleChange, handleSave, pickImage, isLocked } =
    useDocumentsForm({ initialData });

  const { getSignedUrl } = useFileUpload();

  const [idImageUrl, setIdImageUrl] = useState<string | null>(null);
  const [businessImageUrl, setBusinessImageUrl] = useState<string | null>(null);

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
        if (alive) setIdImageUrl(url);
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
      if (!formData.businessDocumentUrl) return setBusinessImageUrl(null);

      try {
        if (isLocalFile(formData.businessDocumentUrl)) {
          setBusinessImageUrl(formData.businessDocumentUrl);
          return;
        }

        const url = await getSignedUrl(formData.businessDocumentUrl);
        if (alive) setBusinessImageUrl(url);
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
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* ================= ID TYPE ================= */}
        <ThemedText type="defaultSemiBold">ID Type</ThemedText>

        <View style={styles.pickerContainer}>
          <Picker
            enabled={!isLocked}
            selectedValue={formData.idType}
            onValueChange={(v) => handleChange('idType', v)}
            style={styles.picker}
          >
            {PHILIPPINE_ID_TYPES.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        {/* ================= ID UPLOAD ================= */}
        <TouchableOpacity
          onPress={() => pickImage('idUrl')}
          disabled={isLocked}
          style={styles.upload}
        >
          {idImageUrl ? (
            <EFImage
              source={idImageUrl}
              style={styles.image}
              contentFit="contain"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="cloud-upload-outline" size={40} color="#888" />
              <ThemedText>Tap to upload ID</ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {/* ================= BUSINESS TYPE ================= */}
        <ThemedText type="defaultSemiBold">Business Document Type</ThemedText>

        <View style={styles.pickerContainer}>
          <Picker
            enabled={!isLocked}
            selectedValue={formData.businessDocumentType}
            onValueChange={(v) => handleChange('businessDocumentType', v)}
            style={styles.picker}
          >
            {BUSINESS_DOCUMENT_TYPES.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        {/* ================= BUSINESS UPLOAD ================= */}
        <TouchableOpacity
          onPress={() => pickImage('businessDocumentUrl')}
          disabled={isLocked}
          style={styles.upload}
        >
          {businessImageUrl ? (
            <EFImage
              source={businessImageUrl}
              style={styles.image}
              contentFit="contain"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="cloud-upload-outline" size={40} color="#888" />
              <ThemedText>Tap to upload document</ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {/* ================= SAVE ================= */}
        {!initialData && (
          <View style={styles.footer}>
            <AnimatedButton
              label={isLoading ? 'Saving...' : 'Save'}
              onPress={handleSave}
              disabled={isLoading}
            />
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default DocumentsForm;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { padding: Spacing.md, flex: 1 },

  upload: {
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  placeholder: {
    alignItems: 'center',
  },

  /* 🔥 CLEAN PICKER WRAPPER */
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,

    height: 48,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  /* 🔥 removes inner thick border / underline */
  picker: {
    height: 48,
    width: '100%',
    borderWidth: 0,
    elevation: 0,
  },

  footer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});
