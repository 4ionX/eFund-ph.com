import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedTextInput } from '@/shared/components/theme/ThemedTextInput';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { Spacing, Typography } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';

import { Picker } from '@react-native-picker/picker';
import type { CoBorrower } from '../types/co-borrower';
import { useCoBorrowerForm } from '../hooks/useCoBorrowerForm';

type Props = {
  initialData: CoBorrower | undefined;
};

const CoBorrowerForm = ({ initialData }: Props) => {
  const cardColor = useThemeColor({}, 'card');

  const {
    formData,
    showDatePicker,
    setShowDatePicker,
    handleChange,
    addChild,
    updateChild,
    removeChild,
    handleSave,
    isLoading,
    isLocked,
    errors,
  } = useCoBorrowerForm({ initialData });

  const today = new Date().toISOString().split('T')[0];
  const [civilStatusOpen, setCivilStatusOpen] = React.useState(false);
  const CIVIL_STATUS = ['Single', 'Married', 'Widowed', 'Separated'];
  return (
    <ThemedView style={styles.container}>
      {/* Names */}
      <ThemedText type="defaultSemiBold">First Name</ThemedText>
      <ThemedTextInput
        placeholder="Enter first name"
        value={formData.firstName ?? ''}
        onChangeText={(val) => handleChange('firstName', val)}
        error={!!errors.firstName}
        errorMessage={errors.firstName}
        editable={!initialData}
      />

      <ThemedText type="defaultSemiBold">Middle Name</ThemedText>
      <ThemedTextInput
        placeholder="Enter middle name"
        value={formData.middleName ?? ''}
        onChangeText={(val) => handleChange('middleName', val)}
        error={!!errors.middleName}
        errorMessage={errors.middleName}
        editable={!initialData}
      />

      <ThemedText type="defaultSemiBold">Last Name</ThemedText>
      <ThemedTextInput
        placeholder="Enter last name"
        value={formData.lastName ?? ''}
        onChangeText={(val) => handleChange('lastName', val)}
        error={!!errors.lastName}
        errorMessage={errors.lastName}
        editable={!initialData}
      />

      {/* Birth Date */}
      <ThemedText type="defaultSemiBold">Birth Date</ThemedText>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={formData.birthDate || today}
          onChange={(e) => handleChange('birthDate', e.target.value)}
          style={{
            padding: 12,
            borderRadius: 8,
            border: errors.birthDate ? '1px solid red' : '1px solid #ccc',
            height: 30,
            marginBottom: 10,
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDatePicker(true)}
          >
            <View pointerEvents="none">
              <ThemedTextInput
                value={formData.birthDate ?? ''}
                editable={false}
                placeholder="Select birth date"
                error={!!errors.birthDate}
                errorMessage={errors.birthDate}
              />
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={
                formData.birthDate ? new Date(formData.birthDate) : new Date()
              }
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              minimumDate={new Date(1960, 0, 1)}
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }

                if (event.type === 'set' && selectedDate) {
                  handleChange(
                    'birthDate',
                    selectedDate.toISOString().split('T')[0],
                  );
                }
              }}
            />
          )}
        </>
      )}

      {/* Civil Status */}
      <ThemedText type="defaultSemiBold">Civil Status</ThemedText>

      <TouchableOpacity
        disabled={isLocked}
        onPress={() => setCivilStatusOpen((prev) => !prev)}
        style={[
          styles.dropdown,
          { borderColor: errors.civilStatus ? 'red' : '#E5E7EB' },
        ]}
      >
        <ThemedText>{formData.civilStatus || 'Select civil status'}</ThemedText>

        <Ionicons
          name={civilStatusOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {civilStatusOpen && (
        <View style={styles.dropdownList}>
          {CIVIL_STATUS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                handleChange('civilStatus', item);
                setCivilStatusOpen(false);
              }}
              style={styles.dropdownItem}
            >
              <ThemedText>{item}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {errors.civilStatus && (
        <ThemedText style={{ color: 'red', marginTop: 4 }}>
          {errors.civilStatus}
        </ThemedText>
      )}

      {/* Length of Stay */}
      <ThemedText type="defaultSemiBold">Length of Stay</ThemedText>
      <ThemedTextInput
        placeholder="Enter length of stay"
        value={formData.lengthOfStay ?? ''}
        editable={!initialData}
        onChangeText={(val) => handleChange('lengthOfStay', val)}
        error={!!errors.lengthOfStay}
        errorMessage={errors.lengthOfStay}
      />

      {/* Addresses */}
      <ThemedText type="defaultSemiBold">Present Address</ThemedText>
      <ThemedTextInput
        placeholder="Enter present address"
        value={formData.presentAddress ?? ''}
        editable={!initialData}
        onChangeText={(val) => handleChange('presentAddress', val)}
        error={!!errors.presentAddress}
        errorMessage={errors.presentAddress}
      />

      <ThemedText type="defaultSemiBold">Previous Address</ThemedText>
      <ThemedTextInput
        placeholder="Enter previous address"
        value={formData.previousAddress ?? ''}
        editable={!initialData}
        onChangeText={(val) => handleChange('previousAddress', val)}
      />

      {/* Contact */}
      <ThemedText type="defaultSemiBold">Primary Contact</ThemedText>
      <ThemedTextInput
        placeholder="Enter primary contact number"
        value={formData.primaryContactNumber ?? ''}
        onChangeText={(val) => handleChange('primaryContactNumber', val)}
        keyboardType="phone-pad"
        editable={!initialData}
        error={!!errors.primaryContactNumber}
        errorMessage={errors.primaryContactNumber}
      />

      <ThemedText type="defaultSemiBold">Secondary Contact</ThemedText>
      <ThemedTextInput
        placeholder="Enter secondary contact number"
        value={formData.secondaryContactNumber ?? ''}
        editable={!initialData}
        onChangeText={(val) => handleChange('secondaryContactNumber', val)}
        keyboardType="phone-pad"
      />

      {/* Social Media Link */}
      <ThemedText type="defaultSemiBold">Social Media Link</ThemedText>
      <ThemedTextInput
        placeholder="Enter social media link"
        value={formData.socialMediaLink ?? ''}
        editable={!initialData}
        onChangeText={(val) => handleChange('socialMediaLink', val)}
      />

      {/* Source of Income */}
      <ThemedText type="defaultSemiBold">Source of Income</ThemedText>
      <ThemedTextInput
        placeholder="Enter source of income"
        value={formData.sourceOfIncome ?? ''}
        editable={!initialData}
        onChangeText={(val) => handleChange('sourceOfIncome', val)}
        error={!!errors.sourceOfIncome}
        errorMessage={errors.sourceOfIncome}
      />

      {/* Child Section */}
      <ThemedText type="defaultSemiBold" style={{ marginTop: Spacing.lg }}>
        Child Information?
      </ThemedText>

      {/* List of children */}
      {(formData.children || []).map((child: any, index: number) => (
        <ThemedView
          key={index}
          style={[styles.childContainer, { backgroundColor: cardColor }]}
        >
          <View style={styles.childHeader}>
            <ThemedText type="defaultSemiBold" style={styles.childLabel}>
              Child #{index + 1}
            </ThemedText>
            {!initialData && (
              <TouchableOpacity onPress={() => removeChild(index)}>
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            )}
          </View>

          <ThemedTextInput
            placeholder="First Name"
            value={child.firstName}
            onChangeText={(val) => updateChild(index, 'firstName', val)}
            error={!!errors[`children.${index}.firstName`]}
            errorMessage={errors[`children.${index}.firstName`]}
            editable={!initialData}
          />
          <ThemedTextInput
            placeholder="Middle Name"
            value={child.middleName}
            onChangeText={(val) => updateChild(index, 'middleName', val)}
            error={!!errors[`children.${index}.middleName`]}
            errorMessage={errors[`children.${index}.middleName`]}
            editable={!initialData}
          />
          <ThemedTextInput
            placeholder="Last Name"
            value={child.lastName}
            onChangeText={(val) => updateChild(index, 'lastName', val)}
            error={!!errors[`children.${index}.lastName`]}
            errorMessage={errors[`children.${index}.lastName`]}
            editable={!initialData}
          />

          <ThemedTextInput
            placeholder="Present Address"
            value={child.presentAddress}
            onChangeText={(val) => updateChild(index, 'presentAddress', val)}
            error={!!errors[`children.${index}.presentAddress`]}
            errorMessage={errors[`children.${index}.presentAddress`]}
            editable={!initialData}
          />
          <ThemedTextInput
            placeholder="Social Media Link"
            value={child.socialMediaLink}
            onChangeText={(val) => updateChild(index, 'socialMediaLink', val)}
            error={!!errors[`children.${index}.socialMediaLink`]}
            errorMessage={errors[`children.${index}.socialMediaLink`]}
            editable={!initialData}
          />
          <ThemedTextInput
            placeholder="School"
            value={child.school}
            onChangeText={(val) => updateChild(index, 'school', val)}
            error={!!errors[`children.${index}.school`]}
            errorMessage={errors[`children.${index}.school`]}
            editable={!initialData}
          />
        </ThemedView>
      ))}

      {/* Add Child Button */}
      {!initialData && (
        <TouchableOpacity onPress={addChild} style={styles.addChildButton}>
          <ThemedText type="defaultSemiBold" style={{ color: '#007AFF' }}>
            + Add Child Information
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Save Button */}
      {!initialData && (
        <View style={styles.footer}>
          <AnimatedButton
            label={isLoading ? 'Saving...' : 'Save'}
            onPress={handleSave}
            disabled={isLoading}
          />
        </View>
      )}
    </ThemedView>
  );
};

export default CoBorrowerForm;

const styles = StyleSheet.create({
  container: { padding: Spacing.md },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#fff',
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  childContainer: {
    marginVertical: Spacing.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'android' ? 50 : undefined,
  },
  childLabel: { fontSize: Typography.size.base },
  addChildButton: { marginVertical: Spacing.md },
  footer: { marginTop: Spacing.lg, marginBottom: Spacing.lg },
});
