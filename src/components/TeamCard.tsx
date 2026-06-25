// ============================================================
// Basra Manager — TeamCard Component
// ============================================================
// Renders a single team row inside the team queue list.
// Supports:
//   - Position badge with color based on playing status
//   - "يلعب الآن" (Playing now) badge for active teams
//   - Edit & Delete icons
//   - Long-press drag activation via the grip handle
//   - Elevated / scaled look while being dragged
// ============================================================

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { colors, spacing, borderRadius, fontSize } from '../theme/theme';
import { formatTeamName, toArabicNumerals } from '../utils/helpers';
import type { Team } from '../models/types';

// ─── Props ───────────────────────────────────────────────────
interface TeamCardProps {
  /** The team data to display. */
  team: Team;
  /** 1-based position in the queue. */
  position: number;
  /** Whether this team is one of the two currently playing. */
  isPlaying: boolean;
  /** Edit callback. */
  onEdit: (team: Team) => void;
  /** Delete callback. */
  onDelete: (teamId: string) => void;
  /** Drag activation callback (called on long-press of the grip handle). */
  drag?: () => void;
  /** True while this card is actively being dragged. */
  isActive?: boolean;
}

// ─── Component ───────────────────────────────────────────────
const TeamCard: React.FC<TeamCardProps> = ({
  team,
  position,
  isPlaying,
  onEdit,
  onDelete,
  drag,
  isActive = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        isActive && styles.containerActive,
      ]}
    >
      {/* ── Drag grip handle (far right in RTL) ── */}
      <TouchableOpacity
        onLongPress={drag}
        delayLongPress={150}
        style={styles.gripHandle}
        accessibilityLabel="اسحب لإعادة الترتيب"
        accessibilityRole="button"
      >
        <Text style={styles.gripDots}>⠿</Text>
      </TouchableOpacity>

      {/* ── Position badge ── */}
      <View
        style={[
          styles.badge,
          isPlaying ? styles.badgePlaying : styles.badgeDefault,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            isPlaying && styles.badgeTextPlaying,
          ]}
        >
          {toArabicNumerals(position)}
        </Text>
      </View>

      {/* ── Team info (center) ── */}
      <View style={styles.infoContainer}>
        <Text style={styles.teamName} numberOfLines={1}>
          {formatTeamName(team.player1, team.player2)}
        </Text>

        {isPlaying && (
          <View style={styles.playingBadge}>
            <Text style={styles.playingBadgeText}>يلعب الآن</Text>
          </View>
        )}
      </View>

      {/* ── Action buttons (left side in RTL) ── */}
      <View style={styles.actions}>
        <IconButton
          icon="pencil-outline"
          iconColor={colors.textSecondary}
          size={22}
          onPress={() => onEdit(team)}
          accessibilityLabel="تعديل الفريق"
          style={styles.iconBtn}
        />
        <IconButton
          icon="trash-can-outline"
          iconColor={colors.error}
          size={22}
          onPress={() => onDelete(team.id)}
          accessibilityLabel="حذف الفريق"
          style={styles.iconBtn}
        />
      </View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  /** Row container */
  container: {
    flexDirection: 'row-reverse', // RTL: grip on right, actions on left
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    minHeight: 56,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },

  /** Elevated look while being dragged */
  containerActive: {
    backgroundColor: colors.surfaceLight,
    transform: [{ scale: 1.03 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },

  /** Drag grip handle */
  gripHandle: {
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 28,
    minHeight: 48, // large touch target
  },

  /** Braille-pattern character used as a grip icon */
  gripDots: {
    fontSize: 22,
    color: colors.textMuted,
    lineHeight: 24,
  },

  /** Position number circle badge */
  badge: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
  },

  /** Badge when the team is currently playing */
  badgePlaying: {
    backgroundColor: colors.primary,
  },

  /** Badge for idle teams */
  badgeDefault: {
    backgroundColor: colors.surfaceLight,
  },

  /** Badge number text */
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.textMuted,
  },

  /** Badge text when playing (white on green) */
  badgeTextPlaying: {
    color: '#FFFFFF',
  },

  /** Center section containing name + playing badge */
  infoContainer: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    alignItems: 'flex-end', // RTL alignment
  },

  /** Team player names */
  teamName: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
    writingDirection: 'rtl',
    textAlign: 'right',
  },

  /** "يلعب الآن" pill badge */
  playingBadge: {
    backgroundColor: colors.teamABg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },

  /** Playing badge label */
  playingBadgeText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
    writingDirection: 'rtl',
  },

  /** Action icons wrapper */
  actions: {
    flexDirection: 'row-reverse', // Keep consistent RTL order
    alignItems: 'center',
  },

  /** Ensure icons have a minimum 48dp touch area */
  iconBtn: {
    margin: 0,
  },
});

export default TeamCard;
