// ============================================================
// Basra Manager — MatchHistoryList Component
// ============================================================
// Collapsible section that displays a list of past match
// results. Uses react-native-reanimated for the chevron
// rotation animation and smooth expand/collapse.
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, fontSize } from '../theme/theme';
import { formatDate, formatTeamName } from '../utils/helpers';
import { MATCH_HISTORY_TITLE } from '../utils/constants';
import type { MatchRecord } from '../models/types';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Maximum number of recent matches to show */
const MAX_VISIBLE = 20;

// ─── Props ───────────────────────────────────────────────────
interface MatchHistoryListProps {
  /** Array of completed match records, newest first. */
  matchHistory: MatchRecord[];
}

// ─── Match row sub-component ─────────────────────────────────
const MatchItem: React.FC<{ match: MatchRecord }> = ({ match }) => (
  <View style={styles.matchCard}>
    {/* Winner */}
    <View style={styles.matchRow}>
      <Text style={styles.trophy}>🏆</Text>
      <Text style={styles.winnerName} numberOfLines={1}>
        {formatTeamName(match.winnerTeam.player1, match.winnerTeam.player2)}
      </Text>
    </View>

    {/* Loser */}
    <View style={styles.matchRow}>
      <Text style={styles.bulletPlaceholder}>{' '}</Text>
      <Text style={styles.loserName} numberOfLines={1}>
        {formatTeamName(match.loserTeam.player1, match.loserTeam.player2)}
      </Text>
    </View>

    {/* Score & date */}
    <View style={styles.metaRow}>
      <Text style={styles.score}>
        {match.winnerScore} - {match.loserScore}
      </Text>
      <Text style={styles.date}>{formatDate(match.playedAt)}</Text>
    </View>
  </View>
);

// ─── Main Component ──────────────────────────────────────────
const MatchHistoryList: React.FC<MatchHistoryListProps> = ({
  matchHistory,
}) => {
  const [expanded, setExpanded] = useState(false);

  /** Shared value drives the chevron rotation. */
  const chevronRotation = useSharedValue(0);

  /** Animated style for the chevron icon. */
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${chevronRotation.value}deg` },
    ],
  }));

  /** Toggle the collapsed/expanded state. */
  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => {
      const next = !prev;
      chevronRotation.value = withTiming(next ? 180 : 0, { duration: 300 });
      return next;
    });
  }, [chevronRotation]);

  /** Only show the last MAX_VISIBLE entries. */
  const visibleData = matchHistory.slice(0, MAX_VISIBLE);

  return (
    <View style={styles.wrapper}>
      {/* ── Toggle Header ── */}
      <TouchableOpacity
        onPress={toggle}
        style={styles.header}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={MATCH_HISTORY_TITLE}
      >
        <Text style={styles.headerText}>{MATCH_HISTORY_TITLE}</Text>
        <Animated.Text style={[styles.chevron, chevronStyle]}>
          ▼
        </Animated.Text>
      </TouchableOpacity>

      {/* ── Collapsible body ── */}
      {expanded && (
        <View style={styles.body}>
          {visibleData.length === 0 ? (
            <Text style={styles.emptyText}>لا توجد مباريات بعد</Text>
          ) : (
            <FlatList
              data={visibleData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <MatchItem match={item} />}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              scrollEnabled={false} // parent ScrollView handles scrolling
            />
          )}
        </View>
      )}
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  /** Outer wrapper */
  wrapper: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  /** Toggle header row */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: 2,
    minHeight: 52,
  },

  /** Header title */
  headerText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    writingDirection: 'rtl',
  },

  /** Chevron indicator */
  chevron: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  /** Content area below the header */
  body: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.md
  },

  /** Individual match card */
  matchCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },

  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  trophy: {
    fontSize: fontSize.md,
  },

  /** Invisible spacer to align loser text with winner text */
  bulletPlaceholder: {
    width: fontSize.md + spacing.sm,
  },

  /** Winner team name */
  winnerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    writingDirection: 'rtl',
    paddingHorizontal: spacing.sm,
    textAlign: 'right',
  },

  /** Loser team name */
  loserName: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    writingDirection: 'rtl',
    paddingHorizontal: spacing.sm,
    textAlign: 'right',
  },

  /** Score + date row */
  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  /** Score label */
  score: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },

  /** Date label */
  date: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    writingDirection: 'rtl',
  },

  /** Divider between match cards */
  divider: {
    height: spacing.sm,
  },

  /** Empty state text */
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
    writingDirection: 'rtl',
  },
});

export default MatchHistoryList;
