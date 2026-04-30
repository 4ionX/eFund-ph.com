import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedTextInput } from '@/shared/components/theme/ThemedTextInput';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { Spacing, Typography } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ContactReference } from '../types/contact-reference';
import { useContactReferenceForm } from '../hooks/useContactReferenceForm';

type Props = {
  initialData?: ContactReference[];
};

const ContactReferenceForm = ({ initialData }: Props) => {
  const cardColor = useThemeColor({}, 'card');

  const {
    formData: references,
    handleChange,
    handleSave,
    isLoading,
    errors,
  } = useContactReferenceForm({ initialData });

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        {references.map((ref, index) => (
          <ThemedView
            key={index}
            style={[styles.referenceContainer, { backgroundColor: cardColor }]}
          >
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Reference #{index + 1}
            </ThemedText>

            {/* Contact Name */}
            <ThemedTextInput
              placeholder="Contact Name"
              value={ref.contactName}
              onChangeText={(val) => handleChange(index, 'contactName', val)}
              error={!!errors[index]?.contactName}
              errorMessage={errors[index]?.contactName}
              editable={!initialData || initialData.length === 0}
            />

            {/* Contact Number */}
            <ThemedTextInput
              placeholder="Contact Number"
              value={ref.contactNumber}
              onChangeText={(val) => handleChange(index, 'contactNumber', val)}
              keyboardType="phone-pad"
              error={!!errors[index]?.contactNumber}
              errorMessage={errors[index]?.contactNumber}
              editable={!initialData || initialData.length === 0}
            />

            {/* Relationship */}
            <ThemedTextInput
              placeholder="Relationship"
              value={ref.relationship}
              onChangeText={(val) => handleChange(index, 'relationship', val)}
              error={!!errors[index]?.relationship}
              errorMessage={errors[index]?.relationship}
              editable={!initialData || initialData.length === 0}
            />
          </ThemedView>
        ))}

        {/* SAVE BUTTON */}
        {(!initialData || initialData.length === 0) && (
          <View style={styles.footer}>
            <AnimatedButton
              label={isLoading ? 'Saving...' : 'Save'}
              onPress={handleSave}
              disabled={isLoading}
            />
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
};

export default ContactReferenceForm;

const styles = StyleSheet.create({
  container: { padding: Spacing.md },

  referenceContainer: {
    marginVertical: Spacing.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },

  label: {
    fontSize: Typography.size.base,
    marginBottom: Spacing.xs,
  },

  footer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});
