// ============================================================
// Basra Manager — Leaderboard Screen (لوحة المتصدرين)
// ============================================================

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTournamentStore } from '../store/useTournamentStore';
import { useRotationStore } from '../store/useRotationStore';
import { TournamentEntry } from '../models/types';
import { colors, spacing, fontSize, borderRadius } from '../theme/theme';
import { formatTeamName } from '../utils/helpers';
import {
  LEADERBOARD_TITLE,
  BTN_YES,
  BTN_CANCEL,
} from '../utils/constants';

const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  const resetTournament = useTournamentStore((s) => s.resetTournament);
  // Subscribe directly to reactive slices so component re-renders on change
  const entries = useTournamentStore((s) => s.entries);
  const teams = useRotationStore((s) => s.teams);

  // Build a full leaderboard: every team in the rotation queue should appear,
  // even if they haven't played yet (wins = 0, losses = 0).
  const leaderboard: TournamentEntry[] = [
    // Start from recorded entries
    ...entries,
    // Add synthetic 0-stat entries for teams not yet in the tournament store
    ...teams
      .filter((t) => !entries.some((e) => e.teamId === t.id))
      .map((t) => ({
        teamId: t.id,
        team: t,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
      })),
  ].sort((a, b) => {
    // Primary: most wins first
    if (b.wins !== a.wins) return b.wins - a.wins;
    // Secondary: fewest losses (fewer losses = better)
    return a.losses - b.losses;
  });

  const handleReset = useCallback(() => {
    Alert.alert('', 'هل أنت متأكد من إعادة تعيين البطولة؟', [
      { text: BTN_CANCEL, style: 'cancel' },
      {
        text: BTN_YES,
        style: 'destructive',
        onPress: () => resetTournament(),
      },
    ]);
  }, [resetTournament]);

  const renderItem = useCallback(
    ({ item, index }: { item: TournamentEntry; index: number }) => {
      const rank = index + 1;
      const medal = rank <= 3 ? MEDAL_EMOJIS[rank - 1] : null;
      const isTopThree = rank <= 3;

      return (
        <View
          style={[
            styles.row,
            index % 2 === 0 ? styles.rowEven : styles.rowOdd,
            isTopThree && styles.rowTopThree,
          ]}
        >
          {/* Rank */}
          <View style={styles.rankCell}>
            {medal ? (
              <Text style={styles.medalText}>{medal}</Text>
            ) : (
              <Text style={styles.rankText}>{rank}</Text>
            )}
          </View>

          {/* Team Name */}
          <View style={styles.teamCell}>
            <Text style={styles.teamNameText} numberOfLines={1}>
              {formatTeamName(item.team.player1, item.team.player2)}
            </Text>
          </View>

          {/* Games Played */}
          <View style={styles.statCell}>
            <Text style={styles.statText}>{item.gamesPlayed}</Text>
          </View>

          {/* Wins */}
          <View style={styles.statCell}>
            <Text style={[styles.statText, styles.winsText]}>{item.wins}</Text>
          </View>

          {/* lose */}
          <View style={styles.statCell}>
            <Text style={styles.lossesText}>
              {item.losses}
            </Text>
          </View>
        </View>
      );
    },
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{LEADERBOARD_TITLE}</Text>
      </View>

      {leaderboard.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="trophy-outline"
            size={64}
            color={colors.textMuted}
          />
          <Text style={styles.emptyText}>لا توجد بيانات بعد</Text>
          <Text style={styles.emptySubtext}>
            العب مباريات لتظهر النتائج هنا
          </Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.rankCell}>
              <Text style={styles.headerCellText}>#</Text>
            </View>
            <View style={styles.teamCell}>
              <Text style={styles.headerCellText}>الفريق</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={styles.headerCellText}>لعب</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={styles.headerCellText}>فوز</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={styles.headerCellText}>خسر</Text>
            </View>
          </View>

          {/* Table Body */}
          <FlatList
            data={leaderboard}
            renderItem={renderItem}
            keyExtractor={(item) => item.teamId}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Reset Tournament Button */}
      {entries.length > 0 && (
        <View style={styles.resetContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <MaterialCommunityIcons
              name="delete-sweep-outline"
              size={20}
              color={colors.error}
            />
            <Text style={styles.resetButtonText}>إعادة تعيين البطولة</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    writingDirection: 'rtl',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl * 2,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
    marginTop: spacing.md,
    writingDirection: 'rtl',
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    writingDirection: 'rtl',
  },
  tableContainer: {
    flex: 1,
    margin: spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderTopStartRadius: borderRadius.md,
    borderTopEndRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  headerCellText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '700',
    textAlign: 'left',
    writingDirection: 'rtl',
  },
  list: {
    borderBottomStartRadius: borderRadius.md,
    borderBottomEndRadius: borderRadius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: colors.surface,
  },
  rowOdd: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  rowTopThree: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  rankCell: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  medalText: {
    fontSize: fontSize.lg,
  },
  teamCell: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  teamNameText: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  statCell: {
    width: 48,
    alignItems: 'center',
  },
  statText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  winsText: {
    color: colors.primary,
  },
  lossesText: {
    color: colors.error,
  },
  resetContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    gap: spacing.sm,
  },
  resetButtonText: {
    color: colors.error,
    fontSize: fontSize.md,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
});
