// ============================================================
// Basra Manager — WinnerDialog Component
// ============================================================
// Full-screen celebration dialog displayed when a team wins.
// Shows a trophy, the winning team's name and color, the final
// score, and action buttons for starting the next game or
// dismissing the dialog. Uses react-native-reanimated for a
// smooth scale-in entrance animation.
// ============================================================

import React, { useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius, fontSize } from '../theme/theme';
import {
  MSG_WINNER,
  MSG_START_NEXT,
  BTN_YES,
  BTN_CANCEL,
} from '../utils/constants';

// ── Props ──────────────────────────────────────────────────────
export interface WinnerDialogProps {
  /** Whether the dialog is visible */
  visible: boolean;
  /** Winning team's label (e.g. 'لنا' or 'لهم') */
  winnerLabel: string;
  /** Winning team's accent color */
  winnerColor: string;
  /** Winner's final total score */
  winnerScore: number;
  /** Loser's final total score */
  loserScore: number;
  /** Callback to start the next game */
  onStartNext: () => void;
  /** Callback to dismiss the dialog without action */
  onCancel: () => void;
}

// ── Component ──────────────────────────────────────────────────
const WinnerDialog: React.FC<WinnerDialogProps> = ({
  visible,
  winnerLabel,
  winnerColor,
  winnerScore,
  loserScore,
  onStartNext,
  onCancel,
}) => {
  // ── Entrance animation (scale from 0.7 → 1) ───────────────
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 14,
        stiffness: 120,
        mass: 0.8,
      });
      opacity.value = withSpring(1, {
        damping: 20,
        stiffness: 100,
      });
    } else {
      scale.value = 0.7;
      opacity.value = 0;
    }
  }, [visible, scale, opacity]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          {/* ── Decorative glow border ─────────────────────── */}
          <View
            style={[
              styles.glowBorder,
              {
                borderColor: winnerColor,
                shadowColor: winnerColor,
              },
            ]}
          >
            {/* ── Trophy ──────────────────────────────────── */}
            <Text style={styles.trophy}>🏆</Text>

            {/* ── Announcement ────────────────────────────── */}
            <Text style={styles.announcement}>{MSG_WINNER}</Text>

            {/* ── Winner Label ────────────────────────────── */}
            <Text style={[styles.winnerLabel, { color: winnerColor }]}>
              {winnerLabel}
            </Text>

            {/* ── Score Display ────────────────────────────── */}
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreValue, { color: winnerColor }]}>
                {winnerScore}
              </Text>
              <Text style={styles.scoreDash}>—</Text>
              <Text style={styles.scoreValueLoser}>{loserScore}</Text>
            </View>

            {/* ── Question ────────────────────────────────── */}
            <Text style={styles.questionText}>{MSG_START_NEXT}</Text>

            {/* ── Action Buttons ──────────────────────────── */}
            <View style={styles.buttonRow}>
              {/* Primary: Start next game */}
              <Button
                mode="contained"
                onPress={onStartNext}
                buttonColor={colors.primary}
                textColor="#FFFFFF"
                style={styles.actionButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                accessibilityLabel={BTN_YES}
              >
                {BTN_YES}
              </Button>

              {/* Secondary: Cancel / dismiss */}
              <Button
                mode="outlined"
                onPress={onCancel}
                textColor={colors.textSecondary}
                style={[
                  styles.actionButton,
                  styles.outlinedButton,
                ]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                accessibilityLabel={BTN_CANCEL}
              >
                {BTN_CANCEL}
              </Button>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  /** Semi-transparent full-screen backdrop */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  /** Central dialog card */
  card: {
    width: '100%',
    maxWidth: 380,
  },

  /** Glow-bordered inner wrapper for visual flair */
  glowBorder: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,         // 24
    borderWidth: 2,
    paddingVertical: spacing.xl,           // 32
    paddingHorizontal: spacing.lg,         // 24
    alignItems: 'center',
    // Glow effect via shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  },

  /** Trophy emoji */
  trophy: {
    fontSize: 64,
    marginBottom: spacing.md,
  },

  /** 'فاز الفريق!' announcement */
  announcement: {
    fontSize: fontSize.lg,                 // 20
    fontWeight: '600',
    color: colors.textSecondary,
    writingDirection: 'rtl',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  /** Winner team name in large colored text */
  winnerLabel: {
    fontSize: fontSize.xxl,                // 40
    fontWeight: '800',
    writingDirection: 'rtl',
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  /** Score row: winner — loser */
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  scoreValue: {
    fontSize: fontSize.xxl,                // 40
    fontWeight: '800',
  },
  scoreDash: {
    fontSize: fontSize.xl,                 // 28
    color: colors.textMuted,
    fontWeight: '300',
  },
  scoreValueLoser: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textMuted,
  },

  /** 'بدء اللعبة التالية؟' question */
  questionText: {
    fontSize: fontSize.md,                 // 16
    color: colors.textSecondary,
    writingDirection: 'rtl',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  /** Button row */
  buttonRow: {
    flexDirection: 'row-reverse',          // RTL: primary on right
    gap: spacing.md,
    width: '100%',
  },

  /** Shared button sizing (48dp min height) */
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.md,         // 12
  },
  buttonContent: {
    height: 52,                            // comfortable one-handed tap
  },
  buttonLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    writingDirection: 'rtl',
  },

  /** Outlined cancel button */
  outlinedButton: {
    borderColor: colors.surfaceLight,
    borderWidth: 1.5,
  },
});

export default WinnerDialog;
