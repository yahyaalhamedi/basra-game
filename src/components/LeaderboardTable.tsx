// ============================================================
// Basra Manager — LeaderboardTable Component
// ============================================================
// Displays tournament standings in a tabular format.
// Features:
//   - Medal emojis for the top 3 positions
//   - Alternating row backgrounds for readability
//   - Win percentage via calcWinPercentage helper
//   - Reset button with Alert confirmation
//   - FlatList for efficient rendering
// ============================================================

import React, { useCallback } from 'react';
import { View, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, borderRadius, fontSize } from '../theme/theme';
import {
  formatTeamName,
  calcWinPercentage,
  toArabicNumerals,
} from '../utils/helpers';
import {
  LEADERBOARD_TITLE,
  COL_RANK,
  COL_TEAM,
  COL_PLAYED,
  COL_WINS,
  COL_WIN_PCT,
  BTN_YES,
  BTN_CANCEL,
  MSG_CONFIRM_RESET,
} from '../utils/constants';
import type { TournamentEntry } from '../models/types';

// ─── Medal mapping for top 3 ────────────────────────────────
const MEDALS: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

// ─── Props ───────────────────────────────────────────────────
interface LeaderboardTableProps {
  /** Sorted leaderboard entries (best-first). */
  entries: TournamentEntry[];
  /** Called when the user confirms a tournament reset. */
  onReset: () => void;
}

// ─── Component ───────────────────────────────────────────────
const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  onReset,
}) => {
  /** Show a native confirmation alert before resetting. */
  const confirmReset = useCallback(() => {
    Alert.alert(
      'إعادة تعيين البطولة',
      MSG_CONFIRM_RESET,
      [
        { text: BTN_CANCEL, style: 'cancel' },
        { text: BTN_YES, style: 'destructive', onPress: onReset },
      ],
    );
  }, [onReset]);

  /** Render a single leaderboard row. */
  const renderRow = useCallback(
    ({ item, index }: { item: TournamentEntry; index: number }) => {
      const rank = index + 1;
      const medal = MEDALS[rank];
      const isEvenRow = index % 2 === 0;

      return (
        <View
          style={[
            styles.row,
            isEvenRow ? styles.rowEven : styles.rowOdd,
          ]}
        >
          {/* Rank */}
          <View style={styles.cellRank}>
            <Text style={styles.rankText}>
              {medal ?? toArabicNumerals(rank)}
            </Text>
          </View>

          {/* Team name */}
          <View style={styles.cellTeam}>
            <Text style={styles.teamText} numberOfLines={1}>
              {formatTeamName(item.team.player1, item.team.player2)}
            </Text>
          </View>

          {/* Games played */}
          <View style={styles.cellNum}>
            <Text style={styles.numText}>
              {toArabicNumerals(item.gamesPlayed)}
            </Text>
          </View>

          {/* Wins */}
          <View style={styles.cellNum}>
            <Text style={styles.numText}>
              {toArabicNumerals(item.wins)}
            </Text>
          </View>

          {/* Win % */}
          <View style={styles.cellNum}>
            <Text style={styles.numText}>
              {calcWinPercentage(item.wins, item.gamesPlayed)}
            </Text>
          </View>
        </View>
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
      {/* ── Title ── */}
      <Text style={styles.title}>🏆 {LEADERBOARD_TITLE}</Text>

      {entries.length === 0 ? (
        /* ── Empty state ── */
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>لا توجد بيانات بعد</Text>
        </View>
      ) : (
        <>
          {/* ── Table header ── */}
          <View style={styles.tableHeader}>
            <View style={styles.cellRank}>
              <Text style={styles.headerCell}>{COL_RANK}</Text>
            </View>
            <View style={styles.cellTeam}>
              <Text style={styles.headerCell}>{COL_TEAM}</Text>
            </View>
            <View style={styles.cellNum}>
              <Text style={styles.headerCell}>{COL_PLAYED}</Text>
            </View>
            <View style={styles.cellNum}>
              <Text style={styles.headerCell}>{COL_WINS}</Text>
            </View>
            <View style={styles.cellNum}>
              <Text style={styles.headerCell}>{COL_WIN_PCT}</Text>
            </View>
          </View>

          {/* ── Table body ── */}
          <FlatList
            data={entries}
            keyExtractor={(item) => item.teamId}
            renderItem={renderRow}
            scrollEnabled={false} // Embed inside a parent ScrollView
          />
        </>
      )}

      {/* ── Reset button ── */}
      <TouchableOpacity
        onPress={confirmReset}
        style={styles.resetButton}
        activeOpacity={0.8}
      >
        <Text style={styles.resetText}>إعادة تعيين البطولة</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  /** Outer container */
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  /** Page title */
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: spacing.md,
  },

  /** Table header row (column labels) */
  tableHeader: {
    flexDirection: 'row-reverse', // RTL
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },

  /** Individual header cell text */
  headerCell: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  /** Data row */
  row: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    minHeight: 48, // touch-friendly height
  },

  /** Even row background */
  rowEven: {
    backgroundColor: colors.surface,
  },

  /** Odd row background (slightly different) */
  rowOdd: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },

  /** Rank column */
  cellRank: {
    width: 48,
    alignItems: 'center',
  },

  /** Team name column — flex to fill remaining space */
  cellTeam: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },

  /** Numeric columns (played, wins, %) */
  cellNum: {
    width: 52,
    alignItems: 'center',
  },

  /** Rank text (or medal emoji) */
  rankText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  /** Team name text */
  teamText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  /** Numeric text */
  numText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  /** Empty state wrapper */
  emptyWrapper: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },

  /** Empty state text */
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    writingDirection: 'rtl',
  },

  /** Reset tournament button */
  resetButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.error,
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Reset button label */
  resetText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
    writingDirection: 'rtl',
  },
});

export default LeaderboardTable;
