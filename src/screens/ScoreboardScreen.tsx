// ============================================================
// Basra Manager — Scoreboard Screen (لوحة النتائج)
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  I18nManager,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScoreStore } from '../store/useScoreStore';
import { useRotationStore } from '../store/useRotationStore';
import { useTournamentStore } from '../store/useTournamentStore';
import ScoreCircle from '../components/ScoreCircle';
import NumericKeypad from '../components/NumericKeypad';
import RoundHistoryTable from '../components/RoundHistoryTable';
import WinnerDialog from '../components/WinnerDialog';
import { colors, spacing, fontSize, borderRadius } from '../theme/theme';
import {
  TEAM_A_LABEL,
  TEAM_B_LABEL,
  BTN_NEW_DEAL,
  MSG_CONFIRM_RESET,
  BTN_YES,
  BTN_CANCEL,
  APP_NAME,
} from '../utils/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type KeypadTarget = 'A' | 'B' | null;

export default function ScoreboardScreen() {
  const [keypadVisible, setKeypadVisible] = useState(false);
  const [keypadTarget, setKeypadTarget] = useState<KeypadTarget>(null);

  // Score store
  const teamATotal = useScoreStore((s) => s.teamATotal);
  const teamBTotal = useScoreStore((s) => s.teamBTotal);
  const rounds = useScoreStore((s) => s.rounds);
  const isGameOver = useScoreStore((s) => s.isGameOver);
  const winnerSide = useScoreStore((s) => s.winnerSide);
  const addRound = useScoreStore((s) => s.addRound);
  const resetGame = useScoreStore((s) => s.resetGame);
  const undoLastRound = useScoreStore((s) => s.undoLastRound);
  const dismissWinner = useScoreStore((s) => s.dismissWinner);

  // Rotation store
  const getCurrentMatch = useRotationStore((s) => s.getCurrentMatch);
  const rotateAfterWin = useRotationStore((s) => s.rotateAfterWin);

  // Tournament store
  const recordMatch = useTournamentStore((s) => s.recordMatch);

  const handleCirclePress = useCallback((target: KeypadTarget) => {
    setKeypadTarget(target);
    setKeypadVisible(true);
  }, []);

  const handleKeypadSubmit = useCallback(
    (value: number) => {
      if (keypadTarget === 'A') {
        addRound(value, 0);
      } else if (keypadTarget === 'B') {
        addRound(0, value);
      }
      setKeypadVisible(false);
      setKeypadTarget(null);
    },
    [keypadTarget, addRound]
  );

  const handleKeypadClose = useCallback(() => {
    setKeypadVisible(false);
    setKeypadTarget(null);
  }, []);

  const handleNewDeal = useCallback(() => {
    Alert.alert('', MSG_CONFIRM_RESET, [
      { text: BTN_CANCEL, style: 'cancel' },
      {
        text: BTN_YES,
        style: 'destructive',
        onPress: () => resetGame(),
      },
    ]);
  }, [resetGame]);

  const handleStartNextGame = useCallback(() => {
    if (!winnerSide) return;

    const { teamA, teamB } = getCurrentMatch();
    if (teamA && teamB) {
      const winner = winnerSide === 'A' ? teamA : teamB;
      const loser = winnerSide === 'A' ? teamB : teamA;
      const wScore = winnerSide === 'A' ? teamATotal : teamBTotal;
      const lScore = winnerSide === 'A' ? teamBTotal : teamATotal;

      // Record in tournament
      recordMatch(winner, loser);

      // Rotate teams
      rotateAfterWin(winnerSide, wScore, lScore, rounds);
    }

    // Reset scores
    resetGame();
  }, [winnerSide, getCurrentMatch, recordMatch, rotateAfterWin, teamATotal, teamBTotal, rounds, resetGame]);

  const handleCancelWinner = useCallback(() => {
    dismissWinner();
  }, [dismissWinner]);

  // Determine current match team names for display
  const { teamA: currentTeamA, teamB: currentTeamB } = getCurrentMatch();
  const teamAName = currentTeamA
    ? `${currentTeamA.player1} / ${currentTeamA.player2}`
    : TEAM_A_LABEL;
  const teamBName = currentTeamB
    ? `${currentTeamB.player1} / ${currentTeamB.player2}`
    : TEAM_B_LABEL;

  const winnerLabel = winnerSide === 'A' ? TEAM_A_LABEL : TEAM_B_LABEL;
  const winnerColor = winnerSide === 'A' ? colors.teamA : colors.teamB;
  const winnerScore = winnerSide === 'A' ? teamATotal : teamBTotal;
  const loserScore = winnerSide === 'A' ? teamBTotal : teamATotal;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{APP_NAME}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Match Banner */}
        {(currentTeamA || currentTeamB) && (
          <View style={styles.matchBanner}>
            <Text style={styles.matchBannerTeamA}>
              {currentTeamA ? `${currentTeamA.player1} / ${currentTeamA.player2}` : '---'}
            </Text>
            <Text style={styles.matchBannerVs}>ضد</Text>
            <Text style={styles.matchBannerTeamB}>
              {currentTeamB ? `${currentTeamB.player1} / ${currentTeamB.player2}` : '---'}
            </Text>
          </View>
        )}

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          {/* Team B (Right in RTL = shows on right) */}
          <View style={styles.scoreColumn}>
            <Text style={[styles.teamLabel, { color: colors.teamB }]}>
              {TEAM_B_LABEL}
            </Text>
            <Text style={[styles.scoreValue, { color: colors.teamB }]}>
              {teamBTotal}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.scoreDivider}>
            <Text style={styles.scoreDividerText}>-</Text>
          </View>

          {/* Team A (Left in RTL = shows on left) */}
          <View style={styles.scoreColumn}>
            <Text style={[styles.teamLabel, { color: colors.teamA }]}>
              {TEAM_A_LABEL}
            </Text>
            <Text style={[styles.scoreValue, { color: colors.teamA }]}>
              {teamATotal}
            </Text>
          </View>
        </View>

        {/* Score Input Circles */}
        <View style={styles.circlesContainer}>
          <ScoreCircle
            label={TEAM_B_LABEL}
            score={teamBTotal}
            color={colors.teamB}
            bgColor={colors.teamBBg}
            onPress={() => handleCirclePress('B')}
          />
          <ScoreCircle
            label={TEAM_A_LABEL}
            score={teamATotal}
            color={colors.teamA}
            bgColor={colors.teamABg}
            onPress={() => handleCirclePress('A')}
          />
        </View>

        {/* New Deal Button */}
        <View style={styles.newDealContainer}>
          <View style={styles.newDealButton}>
            <Text
              style={styles.newDealText}
              onPress={handleNewDeal}
            >
              <MaterialCommunityIcons name="restart" size={18} color={colors.error} />
              {'  '}{BTN_NEW_DEAL}
            </Text>
          </View>
        </View>

        {/* Round History */}
        <RoundHistoryTable rounds={rounds} onUndoLast={undoLastRound} />
      </ScrollView>

      {/* Numeric Keypad Modal */}
      <NumericKeypad
        visible={keypadVisible}
        teamLabel={keypadTarget === 'A' ? TEAM_A_LABEL : TEAM_B_LABEL}
        teamColor={keypadTarget === 'A' ? colors.teamA : colors.teamB}
        onSubmit={handleKeypadSubmit}
        onClose={handleKeypadClose}
      />

      {/* Winner Dialog */}
      <WinnerDialog
        visible={isGameOver}
        winnerLabel={winnerLabel}
        winnerColor={winnerColor}
        winnerScore={winnerScore}
        loserScore={loserScore}
        onStartNext={handleStartNextGame}
        onCancel={handleCancelWinner}
      />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  matchBannerTeamA: {
    fontSize: fontSize.sm,
    color: colors.teamA,
    fontWeight: '600',
    writingDirection: 'rtl',
    flex: 1,
    textAlign: 'center',
  },
  matchBannerVs: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
    fontWeight: '700',
  },
  matchBannerTeamB: {
    fontSize: fontSize.sm,
    color: colors.teamB,
    fontWeight: '600',
    writingDirection: 'rtl',
    flex: 1,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  scoreColumn: {
    flex: 1,
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
    writingDirection: 'rtl',
  },
  scoreValue: {
    fontSize: fontSize.giant,
    fontWeight: '800',
    lineHeight: 68,
  },
  scoreDivider: {
    paddingHorizontal: spacing.md,
  },
  scoreDividerText: {
    fontSize: fontSize.xxl,
    color: colors.textMuted,
    fontWeight: '300',
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  newDealContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  newDealButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  newDealText: {
    color: colors.error,
    fontSize: fontSize.md,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
});
