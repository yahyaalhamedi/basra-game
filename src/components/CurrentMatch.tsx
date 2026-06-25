// ============================================================
// Basra Manager — CurrentMatch Component
// ============================================================
// Displays the current match between two teams prominently.
// Shows team A (emerald) vs team B (amber) with a glowing card.
// Falls back to a placeholder when fewer than 2 teams are queued.
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, borderRadius, fontSize } from '../theme/theme';
import { formatTeamName } from '../utils/helpers';
import { MSG_NO_TEAMS, MSG_CURRENT_MATCH } from '../utils/constants';
import type { Team } from '../models/types';

// ─── Props ───────────────────────────────────────────────────
interface CurrentMatchProps {
  /** Team A (currently playing) */
  teamA: Team | null;
  /** Team B (currently playing) */
  teamB: Team | null;
}

// ─── Component ───────────────────────────────────────────────
const CurrentMatch: React.FC<CurrentMatchProps> = ({ teamA, teamB }) => {
  const hasMatch = teamA !== null && teamB !== null;

  return (
    <View style={styles.outerGlow}>
      <View style={styles.card}>
        {/* ── Header ── */}
        <Text style={styles.header}>{MSG_CURRENT_MATCH}</Text>

        {hasMatch ? (
          <View style={styles.matchContainer}>
            {/* ── Team A (emerald) ── */}
            <View style={[styles.teamBlock, styles.teamABg]}>
              <Text style={styles.teamAName}>
                {formatTeamName(teamA.player1, teamA.player2)}
              </Text>
            </View>

            {/* ── VS Separator ── */}
            <View style={styles.vsContainer}>
              <View style={styles.vsLine} />
              <Text style={styles.vsText}>ضد</Text>
              <View style={styles.vsLine} />
            </View>

            {/* ── Team B (amber) ── */}
            <View style={[styles.teamBlock, styles.teamBBg]}>
              <Text style={styles.teamBName}>
                {formatTeamName(teamB.player1, teamB.player2)}
              </Text>
            </View>
          </View>
        ) : (
          /* ── Empty state ── */
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{MSG_NO_TEAMS}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  /** Outer wrapper that provides the glow / gradient-like border */
  outerGlow: {
    borderRadius: borderRadius.lg,
    padding: 2,
    // Simulated glow via shadow (iOS) + elevation (Android)
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: colors.primary,
  },

  /** Main card surface */
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg - 1,
    padding: spacing.lg,
  },

  /** Section header — 'المباراة الحالية' */
  header: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    writingDirection: 'rtl',
  },

  /** Vertical stack for the two teams + VS */
  matchContainer: {
    alignItems: 'center',
  },

  /** Shared team block wrapper */
  teamBlock: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },

  /** Subtle background tint for Team A */
  teamABg: {
    backgroundColor: colors.teamABg,
  },

  /** Subtle background tint for Team B */
  teamBBg: {
    backgroundColor: colors.teamBBg,
  },

  /** Small label above team names — "لنا" */
  teamLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.teamA,
    marginBottom: spacing.xs,
    writingDirection: 'rtl',
  },

  /** Small label above team names — "لهم" */
  teamLabelB: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.teamB,
    marginBottom: spacing.xs,
    writingDirection: 'rtl',
  },

  /** Team A player names */
  teamAName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.teamA,
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  /** Team B player names */
  teamBName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.teamB,
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  /** VS separator row */
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    width: '100%',
  },

  /** Decorative line on either side of "ضد" */
  vsLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },

  /** VS label */
  vsText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textMuted,
    marginHorizontal: spacing.md,
    writingDirection: 'rtl',
  },

  /** Wrapper for empty state */
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },

  /** Empty state text */
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    writingDirection: 'rtl',
  },
});

export default CurrentMatch;
