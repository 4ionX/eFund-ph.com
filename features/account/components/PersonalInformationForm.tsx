import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import type { PersonalInformation } from '@/features/account/types/personal-information';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedTextInput } from '@/shared/components/theme/ThemedTextInput';
import { ThemedView } from '@/shared/components/theme/ThemedView';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { Spacing } from '@/shared/constants/theme';
import { usePersonalInformationForm } from '../hooks/usePersonalInformationForm';
import { Ionicons } from '@expo/vector-icons';

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
  const [civilStatusOpen, setCivilStatusOpen] = React.useState(false);
  const CIVIL_STATUS = ['Single', 'Married', 'Widowed', 'Separated'];
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
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <ThemedTextInput
                  value={formData.birthDate ?? ''}
                  editable={false}
                  error={!!errors.birthDate}
                  errorMessage={errors.birthDate}
                  placeholder="Select birth date"
                />
              </View>
            </Pressable>

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

        <TouchableOpacity
          disabled={isLocked}
          onPress={() => setCivilStatusOpen((prev) => !prev)}
          style={[
            styles.dropdown,
            { borderColor: errors.civilStatus ? 'red' : '#E5E7EB' },
          ]}
        >
          <ThemedText>
            {formData.civilStatus || 'Select civil status'}
          </ThemedText>

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
