export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  chipBackground: string;
  modalOverlay: string;
}

export const lightColors: ThemeColors = {
  primary: '#004D40', // Deep Ayurvedic Emerald Green
  primaryDark: '#00251A',
  primaryLight: '#39796B',
  secondary: '#D4AF37', // Warm Ayurvedic Gold
  background: '#F7F9F8',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1C2D27',
  textSecondary: '#4A6056',
  textMuted: '#8A9E95',
  border: '#E2E8E5',
  error: '#D32F2F',
  warning: '#F57C00',
  success: '#388E3C',
  info: '#1976D2',
  chipBackground: '#E8F5E9',
  modalOverlay: 'rgba(0,0,0,0.5)',
};

export const darkColors: ThemeColors = {
  primary: '#4DB6AC',
  primaryDark: '#004D40',
  primaryLight: '#80CBC4',
  secondary: '#FFD54F',
  background: '#121B18',
  surface: '#1E2B26',
  card: '#1E2B26',
  text: '#E8F5E9',
  textSecondary: '#A3C2B5',
  textMuted: '#6B877B',
  border: '#2C3E37',
  error: '#EF5350',
  warning: '#FFB74D',
  success: '#81C784',
  info: '#64B5F6',
  chipBackground: '#263D35',
  modalOverlay: 'rgba(0,0,0,0.7)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 20,
  round: 9999,
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
