// ============================================================
// Basra Manager — Dark Theme Configuration
// ============================================================

import { MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

export const colors = {
  // Primary palette
  primary: '#10B981',        // Emerald green
  primaryLight: '#34D399',   // Light emerald
  primaryDark: '#059669',    // Dark emerald

  // Secondary palette
  secondary: '#F59E0B',      // Amber gold
  secondaryLight: '#FBBF24', // Light amber
  secondaryDark: '#D97706',  // Dark amber

  // Backgrounds
  background: '#0F172A',     // Deep navy dark
  surface: '#1E293B',        // Slate surface
  surfaceLight: '#334155',   // Lighter slate
  card: '#1E293B',           // Card background

  // Team colors
  teamA: '#10B981',          // Emerald for "us"
  teamABg: 'rgba(16, 185, 129, 0.15)',
  teamB: '#F59E0B',          // Amber for "them"
  teamBBg: 'rgba(245, 158, 11, 0.15)',

  // Semantic
  success: '#14B8A6',        // Teal
  error: '#F43F5E',          // Rose
  warning: '#F59E0B',        // Amber
  info: '#3B82F6',           // Blue

  // Text
  textPrimary: '#F8FAFC',    // Almost white
  textSecondary: '#94A3B8',  // Muted gray
  textMuted: '#64748B',      // More muted

  // Borders & dividers
  border: '#334155',
  divider: 'rgba(148, 163, 184, 0.12)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  backdropBlur: 'rgba(15, 23, 42, 0.85)',

  // Medal colors for leaderboard
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',

  // Tab bar
  tabBarBg: '#0F172A',
  tabBarBorder: '#1E293B',
  tabActive: '#10B981',
  tabInactive: '#64748B',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
  giant: 56,
};

export const theme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
    onError: '#FFFFFF',
    surfaceVariant: colors.surfaceLight,
    outline: colors.border,
    elevation: {
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.surfaceLight,
      level3: colors.surfaceLight,
      level4: colors.surfaceLight,
      level5: colors.surfaceLight,
    },
  },
  fonts: configureFonts({ config: fontConfig }),
};
