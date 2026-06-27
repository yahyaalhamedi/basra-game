// ============================================================
// Basra Manager — Scoreboard Screen (لوحة النتائج)
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
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
  BTN_ADD_ROUND,
  TAB_SCOREBOARD,
} from '../utils/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type KeypadTarget = 'A' | 'B' | null;

export default function ScoreboardScreen() {
  const [keypadVisible, setKeypadVisible] = useState(false);
  const [keypadTarget, setKeypadTarget] = useState<KeypadTarget>(null);

  // Current round draft scores
  const [draftScoreA, setDraftScoreA] = useState<number | null>(null);
  const [draftScoreB, setDraftScoreB] = useState<number | null>(null);

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
  const teams = useRotationStore((s) => s.teams);
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
        setDraftScoreA(value);
      } else if (keypadTarget === 'B') {
        setDraftScoreB(value);
      }
      setKeypadVisible(false);
      setKeypadTarget(null);
    },
    [keypadTarget]
  );

  const handleKeypadClose = useCallback(() => {
    setKeypadVisible(false);
    setKeypadTarget(null);
  }, []);

  const handleAddRound = useCallback(() => {
    if (draftScoreA === null && draftScoreB === null) {
      Alert.alert('تنبيه', 'الرجاء إدخال النقاط أولاً');
      return;
    }

    const scoreA = draftScoreA ?? 0;
    const scoreB = draftScoreB ?? 0;

    addRound(scoreA, scoreB);

    // Reset draft scores
    setDraftScoreA(null);
    setDraftScoreB(null);
  }, [draftScoreA, draftScoreB, addRound]);

  const handleNewDeal = useCallback(() => {
    Alert.alert('', MSG_CONFIRM_RESET, [
      { text: BTN_CANCEL, style: 'cancel' },
      {
        text: BTN_YES,
        style: 'destructive',
        onPress: () => {
          resetGame();
          setDraftScoreA(null);
          setDraftScoreB(null);
        },
      },
    ]);
  }, [resetGame]);

  const handleStartNextGame = useCallback(() => {
    if (!winnerSide) return;

    const teamA = teams.length > 0 ? teams[0] : null;
    const teamB = teams.length > 1 ? teams[1] : null;
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
    setDraftScoreA(null);
    setDraftScoreB(null);
  }, [winnerSide, teams, recordMatch, rotateAfterWin, teamATotal, teamBTotal, rounds, resetGame]);

  const handleCancelWinner = useCallback(() => {
    dismissWinner();
  }, [dismissWinner]);

  // Determine current match team names for display — derived directly from
  // reactive `teams` slice so the component re-renders on every team change.
  const currentTeamA = teams.length > 0 ? teams[0] : null;
  const currentTeamB = teams.length > 1 ? teams[1] : null;
  const teamAName = currentTeamA
    ? `${currentTeamA.player1} / ${currentTeamA.player2}`
    : TEAM_A_LABEL;
  const teamBName = currentTeamB
    ? `${currentTeamB.player1} / ${currentTeamB.player2}`
    : TEAM_B_LABEL;

  const winnerLabel = winnerSide === 'A' ? teamAName : teamBName;
  const winnerColor = winnerSide === 'A' ? colors.teamA : colors.teamB;
  const winnerScore = winnerSide === 'A' ? teamATotal : teamBTotal;
  const loserScore = winnerSide === 'A' ? teamBTotal : teamATotal;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{TAB_SCOREBOARD}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Match Banner */}
        <View style={styles.matchBanner}>
          <Text style={styles.matchBannerTeamA}>
            {currentTeamA ? teamAName : TEAM_A_LABEL}
          </Text>
          <Text style={styles.matchBannerVs}>ضد</Text>
          <Text style={styles.matchBannerTeamB}>
            {currentTeamB ? teamBName : TEAM_B_LABEL}
          </Text>
        </View>

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreColumn}>
            <Text style={[styles.scoreValue, { color: colors.teamA }]}>
              {teamATotal}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.scoreDivider}>
            <Text style={styles.scoreDividerText}>-</Text>
          </View>

          <View style={styles.scoreColumn}>
            <Text style={[styles.scoreValue, { color: colors.teamB }]}>
              {teamBTotal}
            </Text>
          </View>
        </View>

        {/* Score Input Circles */}
        <View style={styles.circlesContainer}>
          <ScoreCircle
            color={colors.teamA}
            bgColor={colors.teamABg}
            onPress={() => handleCirclePress('A')}
            pendingScore={draftScoreA}
          />
          <ScoreCircle
            color={colors.teamB}
            bgColor={colors.teamBBg}
            onPress={() => handleCirclePress('B')}
            pendingScore={draftScoreB}
          />
        </View>

        {/* Add Round Button */}
        <View style={styles.addRoundContainer}>
          <Pressable
            disabled={draftScoreA === null && draftScoreB === null}
            onPress={handleAddRound}
            style={({ pressed }) => [
              styles.addRoundButton,
              (draftScoreA === null && draftScoreB === null) && styles.addRoundButtonDisabled,
              pressed && styles.addRoundButtonPressed,
            ]}
          >
            <Text style={styles.addRoundText}>{BTN_ADD_ROUND}</Text>
          </Pressable>
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
        teamLabel={keypadTarget === 'A' ? teamAName : teamBName}
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
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  scoreColumn: {
    flex: 1,
    alignItems: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  newDealContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  addRoundContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  addRoundButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  addRoundButtonDisabled: {
    backgroundColor: colors.surfaceLight,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.5,
  },
  addRoundButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  addRoundText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '700',
    writingDirection: 'rtl',
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
