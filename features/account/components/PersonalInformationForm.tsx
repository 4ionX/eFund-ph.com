import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import type { PersonalInformation } from '@/features/account/types/personal-information';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedTextInput } from '@/shared/components/theme/ThemedTextInput';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { Spacing } from '@/shared/constants/theme';
import { usePersonalInformationForm } from '../hooks/usePersonalInformationForm';

type Props = {
  initialData?: PersonalInformation;
};

const PersonalInformationForm = ({ initialData }: Props) => {
  const {
    formData,
    showDatePicker,
    errors,
    setShowDatePicker,
    handleChange,
    handleSave,
    isLoading,
    isLocked,
  } = usePersonalInformationForm({ initialData: initialData });
  const today = new Date().toISOString().split('T')[0];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* First Name */}
        <ThemedText type="defaultSemiBold">First Name</ThemedText>
        <ThemedTextInput
          placeholder="Enter first name"
          value={formData.firstName ?? ''}
          onChangeText={(val) => handleChange('firstName', val)}
          error={!!errors.firstName}
          errorMessage={errors.firstName}
          editable={!initialData}
        />

        {/* Middle Name */}
        <ThemedText type="defaultSemiBold">Middle Name</ThemedText>
        <ThemedTextInput
          placeholder="Enter middle name"
          value={formData.middleName ?? ''}
          onChangeText={(val) => handleChange('middleName', val)}
          error={!!errors.middleName}
          errorMessage={errors.middleName}
          editable={!initialData}
        />

        {/* Last Name */}
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
            <ThemedTextInput
              value={formData.birthDate ?? ''}
              editable={false}
              onPressIn={() => setShowDatePicker(true)}
              error={!!errors.birthDate}
            />

            {showDatePicker && (
              <DateTimePicker
                value={
                  formData.birthDate ? new Date(formData.birthDate) : new Date()
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                minimumDate={new Date(1990, 0, 1)}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
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
        {Platform.OS === 'web' ? (
          <select
            value={formData.civilStatus}
            onChange={(e) => handleChange('civilStatus', e.target.value)}
            style={{
              padding: 12,
              borderRadius: 6,
              border: errors.civilStatus ? '1px solid red' : '1px solid #ccc',
              width: '100%',
              height: 40,
              marginBottom: 10,
            }}
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
        ) : (
          <View
            style={[
              styles.pickerContainer,
              { borderColor: errors.civilStatus ? 'red' : '#ccc' },
            ]}
          >
            <Picker
              selectedValue={formData.civilStatus}
              onValueChange={(val) => handleChange('civilStatus', val)}
              enabled={!isLocked}
            >
              <Picker.Item label="Single" value="Single" />
              <Picker.Item label="Married" value="Married" />
              <Picker.Item label="Widowed" value="Widowed" />
              <Picker.Item label="Separated" value="Separated" />
            </Picker>
          </View>
        )}
        {errors.civilStatus && (
          <ThemedText type="default" style={{ color: 'red' }}>
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

        {/* Present Address */}
        <ThemedText type="defaultSemiBold">Present Address</ThemedText>
        <ThemedTextInput
          placeholder="Enter present address"
          value={formData.presentAddress ?? ''}
          editable={!initialData}
          onChangeText={(val) => handleChange('presentAddress', val)}
          error={!!errors.presentAddress}
          errorMessage={errors.presentAddress}
        />

        {/* Previous Address */}
        <ThemedText type="defaultSemiBold">Previous Address</ThemedText>
        <ThemedTextInput
          placeholder="Enter previous address"
          value={formData.previousAddress ?? ''}
          editable={!initialData}
          onChangeText={(val) => handleChange('previousAddress', val)}
        />

        {/* Primary Contact */}
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

        {/* Secondary Contact */}
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
      </ScrollView>
    </ThemedView>
  );
};

export default PersonalInformationForm;

const styles = StyleSheet.create({
  container: { padding: Spacing.md, flex: 1 },

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
  footer: { marginTop: Spacing.lg, marginBottom: Spacing.lg },
});
