import { Platform } from 'react-native';

// Font families based on platform - using modern sans-serif fonts
export const FontFamilies = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
  web: {
    regular: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    medium: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    bold: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  default: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
});

// Typography scale for fintech design
export const Typography = {
  // Headings
  heading1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as '700',
  },
  heading2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as '700',
  },
  heading3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as '600',
  },
  heading4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as '600',
  },
  
  // Body text
  bodyLarge: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as '500',
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '400' as '400',
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as '400',
  },
  
  // Labels and captions
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as '500',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as '400',
  },
};