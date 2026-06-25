// ============================================================
// Basra Manager — AddTeamForm Component
// ============================================================
// A compact form to add a new team (two players) to the queue.
// Features RTL-aligned TextInputs and a disabled state when
// either field is empty.
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, borderRadius, fontSize } from '../theme/theme';
import {
  BTN_ADD_TEAM,
  PLACEHOLDER_PLAYER1,
  PLACEHOLDER_PLAYER2,
} from '../utils/constants';

// ─── Props ───────────────────────────────────────────────────
interface AddTeamFormProps {
  /** Called with the two player names when the user submits. */
  onAddTeam: (player1: string, player2: string) => void;
}

// ─── Component ───────────────────────────────────────────────
const AddTeamForm: React.FC<AddTeamFormProps> = ({ onAddTeam }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  /** Both fields must have non-whitespace content. */
  const isValid = player1.trim().length > 0 && player2.trim().length > 0;

  /** Submit handler — calls parent callback and clears form. */
  const handleAdd = useCallback(() => {
    if (!isValid) return;
    onAddTeam(player1.trim(), player2.trim());
    setPlayer1('');
    setPlayer2('');
  }, [player1, player2, isValid, onAddTeam]);

  return (
    <View style={styles.card}>
      {/* ── Player 1 input ── */}
      <TextInput
        style={styles.input}
        placeholder={PLACEHOLDER_PLAYER1}
        placeholderTextColor={colors.textMuted}
        value={player1}
        onChangeText={setPlayer1}
        textAlign="right"
        returnKeyType="next"
        autoCorrect={false}
      />

      {/* ── Player 2 input ── */}
      <TextInput
        style={styles.input}
        placeholder={PLACEHOLDER_PLAYER2}
        placeholderTextColor={colors.textMuted}
        value={player2}
        onChangeText={setPlayer2}
        textAlign="right"
        returnKeyType="done"
        autoCorrect={false}
        onSubmitEditing={handleAdd}
      />

      {/* ── Add button ── */}
      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleAdd}
        disabled={!isValid}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{BTN_ADD_TEAM}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  /** Card wrapper */
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },

  /** Shared input styling */
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    height: 50,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    writingDirection: 'rtl',
  },

  /** Primary action button */
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Dimmed appearance when disabled */
  buttonDisabled: {
    opacity: 0.45,
  },

  /** Button label */
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
    writingDirection: 'rtl',
  },
});

export default AddTeamForm;
