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

import { useFileUpload } from '@/features/loans/hooks/useFileUpload';

const DocumentsForm = ({ initialData }: any) => {
  const { formData, isLoading, handleChange, handleSave, pickImage, isLocked } =
    useDocumentsForm({ initialData });

  const { getSignedUrl } = useFileUpload();

  const [idImageUrl, setIdImageUrl] = useState<string | null>(null);
  const [businessImageUrl, setBusinessImageUrl] = useState<string | null>(null);
  const isStoragePath = (value: string) =>
    !value.startsWith('file://') && !value.startsWith('content://');

  useEffect(() => {
    let mounted = true;

    const loadId = async () => {
      if (!formData.idUrl) return;

      setIdImageUrl(null);

      try {
        // 🔥 ONLY resolve if it's already uploaded path
        if (!isStoragePath(formData.idUrl)) {
          setIdImageUrl(formData.idUrl); // local preview
          return;
        }

        const url = await getSignedUrl(formData.idUrl);

        if (mounted) setIdImageUrl(url);
      } catch (err) {
        console.log('ID error:', err);
      }
    };

    loadId();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.idUrl]);

  useEffect(() => {
    let mounted = true;

    const loadBusiness = async () => {
      if (!formData.businessDocumentUrl) return;

      setBusinessImageUrl(null);

      try {
        if (!isStoragePath(formData.businessDocumentUrl)) {
          setBusinessImageUrl(formData.businessDocumentUrl);
          return;
        }

        const url = await getSignedUrl(formData.businessDocumentUrl);

        if (mounted) setBusinessImageUrl(url);
      } catch (err) {
        console.log('Business error:', err);
      }
    };

    loadBusiness();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.businessDocumentUrl]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* ================= ID TYPE ================= */}
        <ThemedText type="defaultSemiBold">ID Type</ThemedText>

        <ThemedView style={styles.pickerContainer}>
          <Picker
            enabled={!isLocked}
            selectedValue={formData.idType}
            onValueChange={(v) => handleChange('idType', v)}
          >
            <Picker.Item label="Passport" value="Passport" />
            <Picker.Item label="Driver's License" value="Driver's License" />
            <Picker.Item label="UMID" value="UMID" />
            <Picker.Item label="SSS ID" value="SSS ID" />
            <Picker.Item label="PhilSys ID" value="PhilSys ID (National ID)" />
          </Picker>
        </ThemedView>

        {/* ================= ID UPLOAD ================= */}
        <TouchableOpacity
          onPress={() => pickImage('idUrl')}
          disabled={isLocked}
          style={[styles.upload, isLocked && { opacity: 1 }]}
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

        <ThemedView style={styles.pickerContainer}>
          <Picker
            enabled={!isLocked}
            selectedValue={formData.businessDocumentType}
            onValueChange={(v) => handleChange('businessDocumentType', v)}
          >
            <Picker.Item label="DTI Certificate" value="DTI Certificate" />
            <Picker.Item label="SEC Registration" value="SEC Registration" />
            <Picker.Item label="Mayor's Permit" value="Mayor's Permit" />
            <Picker.Item label="Business Permit" value="Business Permit" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </ThemedView>

        {/* ================= BUSINESS UPLOAD ================= */}
        <TouchableOpacity
          onPress={() => pickImage('businessDocumentUrl')}
          disabled={isLocked}
          style={[styles.upload, isLocked && { opacity: 1 }]}
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

  pickerContainer: {
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    marginBottom: 40,
    marginTop: 8,
  },

  footer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});
