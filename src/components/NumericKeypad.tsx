// ============================================================
// Basra Manager — NumericKeypad Component
// ============================================================
// A bottom-sheet modal that presents a 4×3 numeric keypad
// for entering round scores. Includes Clear and Submit buttons,
// haptic feedback on every key press, and validation that the
// entered value is greater than zero before submission.
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, fontSize } from '../theme/theme';

// ── Props ──────────────────────────────────────────────────────
export interface NumericKeypadProps {
  /** Whether the keypad modal is visible */
  visible: boolean;
  /** Team label displayed in the header (e.g. 'لنا') */
  teamLabel: string;
  /** Team accent color for header text */
  teamColor: string;
  /** Callback with the final numeric value when the user submits */
  onSubmit: (value: number) => void;
  /** Callback when the user dismisses the keypad */
  onClose: () => void;
}

// ── Key definitions ────────────────────────────────────────────
type KeyDef =
  | { type: 'digit'; value: string }
  | { type: 'clear' }
  | { type: 'submit' };

const KEYS: KeyDef[][] = [
  [
    { type: 'digit', value: '1' },
    { type: 'digit', value: '2' },
    { type: 'digit', value: '3' },
  ],
  [
    { type: 'digit', value: '4' },
    { type: 'digit', value: '5' },
    { type: 'digit', value: '6' },
  ],
  [
    { type: 'digit', value: '7' },
    { type: 'digit', value: '8' },
    { type: 'digit', value: '9' },
  ],
  [
    { type: 'clear' },
    { type: 'digit', value: '0' },
    { type: 'submit' },
  ],
];

// Maximum digits allowed to prevent absurd values
const MAX_DIGITS = 3;

// ── Component ──────────────────────────────────────────────────
const NumericKeypad: React.FC<NumericKeypadProps> = ({
  visible,
  teamLabel,
  teamColor,
  onSubmit,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');

  // Reset input every time the modal opens
  useEffect(() => {
    if (visible) setInputValue('');
  }, [visible]);

  /**
   * Handle a key press: digit appending, clearing, or submitting.
   */
  const handleKeyPress = async (key: KeyDef) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (key.type) {
      case 'digit':
        // Prevent leading zeros and cap at MAX_DIGITS
        setInputValue((prev) => {
          if (prev.length >= MAX_DIGITS) return prev;
          if (prev === '0') return key.value; // replace leading zero
          return prev + key.value;
        });
        break;

      case 'clear':
        setInputValue('');
        break;

      case 'submit': {
        const numericValue = parseInt(inputValue, 10);
        if (!isNaN(numericValue) && numericValue > 0) {
          onSubmit(numericValue);
        }
        break;
      }
    }
  };

  /**
   * Render a single key button with contextual styling.
   */
  const renderKey = (key: KeyDef, index: number) => {
    let label = '';
    let keyStyle = styles.key;
    let textStyle = styles.keyText;

    switch (key.type) {
      case 'digit':
        label = key.value;
        break;
      case 'clear':
        label = 'C';
        keyStyle = { ...styles.key, backgroundColor: colors.error };
        textStyle = { ...styles.keyText, color: '#FFFFFF' };
        break;
      case 'submit':
        label = '✓';
        keyStyle = { ...styles.key, backgroundColor: colors.primary };
        textStyle = { ...styles.keyText, color: '#FFFFFF' };
        break;
    }

    return (
      <Pressable
        key={index}
        onPress={() => handleKeyPress(key)}
        accessibilityRole="button"
        accessibilityLabel={
          key.type === 'clear'
            ? 'مسح'
            : key.type === 'submit'
              ? 'تأكيد'
              : key.type === 'digit'
                ? key.value
                : ''
        }
        style={({ pressed }) => [
          keyStyle,
          pressed && styles.keyPressed,
        ]}
      >
        <Text style={textStyle}>{label}</Text>
      </Pressable>
    );
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Dark backdrop */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Prevent taps inside the sheet from closing */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          {/* ── Header ──────────────────────────────────────── */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: teamColor }]}>
              {teamLabel}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
              hitSlop={12}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={28}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          {/* ── Value Display ───────────────────────────────── */}
          <View style={styles.display}>
            <Text
              style={[
                styles.displayText,
                {
                  color: inputValue
                    ? colors.textPrimary
                    : colors.textMuted,
                },
              ]}
            >
              {inputValue || '0'}
            </Text>
          </View>

          {/* ── Keypad Grid ─────────────────────────────────── */}
          <View style={styles.grid}>
            {KEYS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((key, keyIndex) => renderKey(key, keyIndex))}
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ── Styles ─────────────────────────────────────────────────────
const KEY_SIZE = 72;

const styles = StyleSheet.create({
  /** Full-screen dark backdrop */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  /** Bottom-sheet container */
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,   // 24
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,          // 24
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,             // 48 (safe area breathing room)
  },

  /** Header row: team label + close icon */
  header: {
    flexDirection: 'row-reverse',           // RTL: label on the right
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.lg,                  // 20
    fontWeight: '700',
    writingDirection: 'rtl',
  },
  closeButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.full,
  },

  /** Numeric display area */
  display: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,          // 12
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    minHeight: 72,
    alignItems: 'flex-end',                 // right-aligned for RTL
    justifyContent: 'center',
  },
  displayText: {
    fontSize: 48,
    fontWeight: '700',
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  /** Keypad grid container */
  grid: {
    gap: spacing.sm,                        // 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,                        // 16
  },

  /** Individual key button */
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    opacity: 0.7,
  },
  keyText: {
    fontSize: fontSize.xl,                  // 28
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default NumericKeypad;
