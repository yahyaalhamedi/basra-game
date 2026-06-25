// ============================================================
// Basra Manager — RoundHistoryTable Component
// ============================================================
// Displays a scrollable table of all rounds played in the
// current game. Newest rounds appear first. Each row shows the
// round number and both teams' scores in their respective colors.
// An undo button allows removing the most recent round.
// ============================================================

import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, fontSize } from '../theme/theme';
import { TEAM_A_LABEL, TEAM_B_LABEL } from '../utils/constants';
import type { ScoreRound } from '../models/types';

// ── Props ──────────────────────────────────────────────────────
export interface RoundHistoryTableProps {
  /** Array of score rounds (newest first) */
  rounds: ScoreRound[];
  /** Callback to undo/remove the last round */
  onUndoLast: () => void;
}

// ── Component ──────────────────────────────────────────────────
const RoundHistoryTable: React.FC<RoundHistoryTableProps> = ({
  rounds,
  onUndoLast,
}) => {
  const hasRounds = rounds.length > 0;

  /**
   * Render a single row in the round history table.
   * Uses alternating background shades for readability.
   */
  const renderRow = ({
    item,
    index,
  }: {
    item: ScoreRound;
    index: number;
  }) => {
    // Round number: total rounds minus current index (newest first)
    const roundNumber = rounds.length - index;
    const isEven = index % 2 === 0;

    return (
      <View
        style={[
          styles.row,
          {
            backgroundColor: isEven
              ? colors.surface
              : colors.background,
          },
        ]}
      >
        {/* Round number */}
        <Text style={styles.cellRound}>{roundNumber}</Text>

        {/* Team A score */}
        <Text style={[styles.cellScore, { color: colors.teamA }]}>
          {item.teamAScore}
        </Text>

        {/* Team B score */}
        <Text style={[styles.cellScore, { color: colors.teamB }]}>
          {item.teamBScore}
        </Text>
      </View>
    );
  };

  /**
   * Render the empty-state placeholder when no rounds exist.
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>لا توجد جولات بعد</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Section Header ────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>سجل الجولات</Text>

        {hasRounds && (
          <Pressable
            onPress={onUndoLast}
            accessibilityRole="button"
            accessibilityLabel="تراجع عن آخر جولة"
            hitSlop={12}
            style={({ pressed }) => [
              styles.undoButton,
              pressed && styles.undoButtonPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="undo-variant"
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {/* ── Table Header Row ──────────────────────────────── */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>الجولة</Text>
        <Text style={styles.headerCell}>{TEAM_A_LABEL}</Text>
        <Text style={styles.headerCell}>{TEAM_B_LABEL}</Text>
      </View>

      {/* ── Table Body (FlatList) ─────────────────────────── */}
      <FlatList
        data={rounds}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={!hasRounds && styles.listEmpty}
      />
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────
const MAX_TABLE_HEIGHT = 300;

const styles = StyleSheet.create({
  container: {
    maxHeight: MAX_TABLE_HEIGHT + 100, // header + table
    marginTop: spacing.lg,
  },

  /** Section title row with optional undo button */
  sectionHeader: {
    flexDirection: 'row-reverse',       // RTL
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.lg,              // 20
    fontWeight: '700',
    color: colors.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  /** Undo icon button */
  undoButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
  },
  undoButtonPressed: {
    opacity: 0.6,
  },

  /** Column headers */
  tableHeader: {
    flexDirection: 'row-reverse',       // RTL
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  headerCell: {
    flex: 1,
    fontSize: fontSize.sm,             // 14
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  /** Data rows */
  row: {
    flexDirection: 'row-reverse',       // RTL
    paddingVertical: spacing.sm + 4,    // comfortable tap height
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },

  /** Round number cell */
  cellRound: {
    flex: 1,
    fontSize: fontSize.md,             // 16
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  /** Score value cells (colored per team) */
  cellScore: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '700',
    textAlign: 'center',
  },

  /** Scrollable list of rows */
  list: {
    maxHeight: MAX_TABLE_HEIGHT,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  /** Empty state */
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
});

export default RoundHistoryTable;
