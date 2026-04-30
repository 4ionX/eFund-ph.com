import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';
import React, { useState } from 'react';
import type { TextInputProps, ViewStyle } from 'react-native';
// eslint-disable-next-line no-duplicate-imports
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from './ThemedText';

interface ThemedTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorMessage?: string;
  onRightIconPress?: () => void;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  containerStyle,
  style,
  error = false,
  leftIcon,
  rightIcon,
  errorMessage,
  onRightIconPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = error
    ? Colors.semantic.error
    : isFocused
      ? Colors.brand.primary
      : Colors.semantic.disabled;

  return (
    <View style={containerStyle}>
      {/* Input Row */}
      <View style={[styles.container, { backgroundColor, borderColor }]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            { color: textColor },
            style,
            leftIcon ? { paddingLeft: 40 } : {},
            rightIcon ? { paddingRight: 40 } : {},
          ]}
          placeholderTextColor={Colors.semantic.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <Pressable style={styles.rightIcon} onPress={onRightIconPress}>
            {rightIcon}
          </Pressable>
        )}
      </View>

      {/* Error Message */}
      {errorMessage && (
        <ThemedText
          type="default"
          style={{ color: Colors.semantic.error, marginTop: -10 }}
        >
          {errorMessage}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
    width: '100%',
    paddingHorizontal: Spacing.sm,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
    paddingVertical: 0,
  },
  leftIcon: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 1,
  },
});
