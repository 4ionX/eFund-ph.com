import { ImagesPath } from '@/shared/constants/images';

import { capitalizeFirstLetterOfWords } from '@/shared/utils/capitalizeFirstLetterOfWords';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../../shared/components/theme/ThemedText';
import EFImage from '../../../shared/components/ui/EFImage';
import { Colors, Radius, Spacing } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';

type AccountHeaderProps = {
  photoURL: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  onEditPress?: () => void;
};

const AccountHeader = ({
  photoURL,
  firstName,
  middleName,
  lastName,
  email,
  phoneNumber,
}: AccountHeaderProps) => {
  const fullName = capitalizeFirstLetterOfWords(
    `${firstName || ''} ${middleName ? middleName + ' ' : ''}${lastName || ''}`.trim(),
  );
  const backgroundColor = useThemeColor({}, 'card');
  return (
    <View style={styles.container}>
      <EFImage
        style={[styles.avatar, { backgroundColor }]}
        source={photoURL || ImagesPath.logo}
        contentFit="contain"
        transition={300}
      />

      <View style={styles.infoContainer}>
        <ThemedText type="title" numberOfLines={1}>
          {fullName}
        </ThemedText>

        {email && (
          <ThemedText type="description" numberOfLines={1}>
            {email}
          </ThemedText>
        )}

        {phoneNumber && (
          <ThemedText type="description" numberOfLines={1}>
            {phoneNumber}
          </ThemedText>
        )}
      </View>
    </View>
  );
};

export default memo(AccountHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xs,
  },

  avatar: {
    height: 100,
    width: 100,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
  },

  infoContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
});
