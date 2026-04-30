import { Colors, Typography } from '@/shared/constants/theme';
import { useThemeColor } from '@/shared/hooks/theme/useThemeColor';

import type { TextStyle, TextProps } from 'react-native';
// eslint-disable-next-line no-duplicate-imports
import { StyleSheet, Text } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'description'
    | 'caption';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <Text style={[{ color }, textStyles[type], style]} {...rest} />;
}

const textStyles: Record<string, TextStyle> = StyleSheet.create({
  default: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.base,
    lineHeight: Typography.lineHeight.base,
  },
  defaultSemiBold: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.base,
    lineHeight: Typography.lineHeight.base,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.xl,
    lineHeight: Typography.lineHeight.xl,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.size.lg,
    lineHeight: Typography.lineHeight.lg,
  },
  link: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.base,
    lineHeight: Typography.lineHeight.base,
    color: Colors.brand.primary,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    lineHeight: Typography.lineHeight.sm,
  },
  caption: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    lineHeight: Typography.lineHeight.xs,
    color: Colors.semantic.disabled,
  },
});
