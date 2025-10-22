/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Fintech dark theme color palette
const primaryColor = '#4DA6FF'; // Sky Blue
const secondaryColor = '#0B0B0F'; // Deep Charcoal
const backgroundColor = '#0B0B0F'; // Deep Charcoal
const cardColor = '#1B1B1E'; // Graphite
const surfaceVariant = '#242429'; // Soft Ink
const textColor = '#FFFFFF'; // White
const textSecondaryColor = '#A1A1AA'; // Cool Gray
const textBodyColor = '#C5C5C8'; // Body Text
const accentGreen = '#00FF85'; // Mint
const accentOrange = '#FF7849'; // Coral
const accentYellow = '#FFCC33'; // Bright Amber
const warningColor = '#FFA726'; // Orange
const dangerColor = '#FF4C4C'; // Crimson Red
const dividerColor = 'rgba(255, 255, 255, 0.05)'; // Divider Shadow

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    
    // Enhanced color palette
    primary: primaryColor,
    secondary: secondaryColor,
    backgroundPrimary: backgroundColor,
    cardBackground: '#ffffff',
    surfaceVariant: '#f8f9fa',
    headerBackground: '#f8f9fa',
    borderColor: '#e9ecef',
    textSecondary: '#6c757d',
    textBody: '#495057',
    textMuted: '#adb5bd',
    accentGreen: accentGreen,
    accentOrange: accentOrange,
    accentYellow: accentYellow,
    warning: warningColor,
    danger: dangerColor,
    divider: dividerColor,
  },
  dark: {
    text: textColor,
    background: backgroundColor,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    // Fintech dark theme palette
    primary: primaryColor,
    secondary: secondaryColor,
    backgroundPrimary: backgroundColor,
    cardBackground: cardColor,
    surfaceVariant: surfaceVariant,
    headerBackground: backgroundColor,
    borderColor: dividerColor,
    textSecondary: textSecondaryColor,
    textBody: textBodyColor,
    textMuted: '#7a8288',
    accentGreen: accentGreen,
    accentOrange: accentOrange,
    accentYellow: accentYellow,
    warning: warningColor,
    danger: dangerColor,
    divider: dividerColor,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});