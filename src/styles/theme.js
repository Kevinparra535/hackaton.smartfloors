/**
 * Theme Configuration
 * Color palette and semantic color assignments
 */

// Base color palette
const colors = {
  // Primary colors
  primary: '#646cff',
  primaryHover: '#535bf2',
  primaryActive: '#4249d8',

  // Status colors
  success: '#00ff88',
  successLight: 'rgba(0, 255, 136, 0.15)',
  warning: '#ffd966',
  warningLight: 'rgba(255, 217, 102, 0.15)',
  danger: '#ff4d4f',
  dangerLight: 'rgba(255, 77, 79, 0.15)',
  info: '#646cff',

  // Heat layer states
  optimal: '#00b4d8',
  media: '#ffd966',
  critical: '#ff4d4f',
  combined: '#9d4edd',

  // Grayscale
  white: '#ffffff',
  gray100: '#f5f5f5',
  gray200: '#eeeeee',
  gray300: '#e0e0e0',
  gray400: '#bdbdbd',
  gray500: '#9e9e9e',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  black: '#000000',

  // Dark theme specific
  dark: {
    bg: '#0a0a0a',
    bgPanel: 'rgba(26, 26, 26, 0.95)',
    bgElevated: '#1a1a1a',
    border: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    textMuted: '#aaaaaa',
    textDimmed: '#666666'
  }
};

// Typography
const typography = {
  fonts: {
    heading: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Courier New", Courier, monospace'
  },

  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem' // 48px
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 800
  },

  lineHeights: {
    tight: 1.25,
    base: 1.5,
    relaxed: 1.75,
    loose: 2
  }
};

// Complete theme object
export const theme = {
  colors,
  ...typography,

  // Semantic color assignments
  text: {
    primary: colors.white,
    secondary: colors.dark.textMuted,
    dimmed: colors.dark.textDimmed,
    inverse: colors.black
  },

  background: {
    primary: colors.dark.bg,
    secondary: colors.dark.bgPanel,
    elevated: colors.dark.bgElevated
  },

  border: {
    default: colors.dark.border,
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.15)',
    strong: 'rgba(255, 255, 255, 0.25)'
  }
};

export default theme;
