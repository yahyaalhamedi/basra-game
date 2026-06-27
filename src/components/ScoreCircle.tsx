// ============================================================
// Basra Manager — ScoreCircle Component
// ============================================================
// A large circular button used for score input on the scoreboard.
// Displays the team's running total above the circle,
// a "+" icon inside, and the team label below.
// Provides haptic feedback and a scale-down animation on press.
// ============================================================

import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing, fontSize } from '../theme/theme';

// ── Props ──────────────────────────────────────────────────────
export interface ScoreCircleProps {
  /** Team accent color used for text, border, and icon highlights */
  color: string;
  /** Semi-transparent team background color for the circle fill */
  bgColor: string;
  /** Callback invoked when the circle is pressed */
  onPress: () => void;
  /** The pending score of the team for the current round */
  pendingScore: number | null;
}

// ── Component ──────────────────────────────────────────────────
const ScoreCircle: React.FC<ScoreCircleProps> = ({
  color,
  bgColor,
  onPress,
  pendingScore,
}) => {
  // Animated scale value for press feedback
  const scaleAnim = useRef(new Animated.Value(1)).current;

  /**
   * Shrink the circle slightly on press-in for tactile feel.
   */
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  /**
   * Restore the circle to its original scale on press-out.
   */
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  /**
   * Fire haptic feedback and notify the parent on press.
   */
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <View style={styles.container}>
      {/* ── Circular Button ────────────────────────────────── */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          style={[
            styles.circle,
            {
              backgroundColor: bgColor,
              borderColor: color,
            },
          ]}
        >
          {pendingScore === null ? (
            <MaterialCommunityIcons name="plus" size={48} color={color} />
          ) : (
            <Text style={[styles.scoreText, { color }]}>{pendingScore}</Text>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────
const CIRCLE_SIZE = 130;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },

  /** Giant score number displayed above the circle */
  scoreText: {
    fontSize: fontSize.xxl,         // 40 (fits nicely in 130 circle)
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,      // tighter vertical spacing on Android
  },

  /** The circular pressable area */
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScoreCircle;
