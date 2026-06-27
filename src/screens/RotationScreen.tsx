// ============================================================
// Basra Manager — Rotation Screen (دوران اللاعبين)
// ============================================================

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated as RNAnimated,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRotationStore } from '../store/useRotationStore';
import CurrentMatch from '../components/CurrentMatch';
import AddTeamForm from '../components/AddTeamForm';
import TeamCard from '../components/TeamCard';
import MatchHistoryList from '../components/MatchHistoryList';
import { Team } from '../models/types';
import { colors, spacing, fontSize, borderRadius } from '../theme/theme';
import {
  BTN_RESET,
  MSG_CONFIRM_RESET,
  BTN_YES,
  BTN_CANCEL,
  BTN_SAVE,
} from '../utils/constants';

export default function RotationScreen() {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editPlayer1, setEditPlayer1] = useState('');
  const [editPlayer2, setEditPlayer2] = useState('');

  // Rotation store
  const teams = useRotationStore((s) => s.teams);
  const matchHistory = useRotationStore((s) => s.matchHistory);
  const addTeam = useRotationStore((s) => s.addTeam);
  const editTeam = useRotationStore((s) => s.editTeam);
  const deleteTeam = useRotationStore((s) => s.deleteTeam);
  const reorderTeams = useRotationStore((s) => s.reorderTeams);
  const resetAll = useRotationStore((s) => s.resetAll);

  const handleAddTeam = useCallback(
    (player1: string, player2: string) => {
      addTeam(player1, player2);
    },
    [addTeam]
  );

  const handleEditStart = useCallback((team: Team) => {
    setEditingTeam(team);
    setEditPlayer1(team.player1);
    setEditPlayer2(team.player2);
  }, []);

  const handleEditSave = useCallback(() => {
    if (!editingTeam) return;
    if (editPlayer1.trim() && editPlayer2.trim()) {
      editTeam(editingTeam.id, editPlayer1, editPlayer2);
    }
    setEditingTeam(null);
    setEditPlayer1('');
    setEditPlayer2('');
  }, [editingTeam, editPlayer1, editPlayer2, editTeam]);

  const handleEditCancel = useCallback(() => {
    setEditingTeam(null);
    setEditPlayer1('');
    setEditPlayer2('');
  }, []);

  const handleDelete = useCallback(
    (teamId: string) => {
      Alert.alert('', 'هل أنت متأكد من حذف هذا الفريق؟', [
        { text: BTN_CANCEL, style: 'cancel' },
        {
          text: BTN_YES,
          style: 'destructive',
          onPress: () => deleteTeam(teamId),
        },
      ]);
    },
    [deleteTeam]
  );

  const handleResetAll = useCallback(() => {
    Alert.alert('', MSG_CONFIRM_RESET, [
      { text: BTN_CANCEL, style: 'cancel' },
      {
        text: BTN_YES,
        style: 'destructive',
        onPress: () => resetAll(),
      },
    ]);
  }, [resetAll]);

  // Simple reorder: move team up
  const handleMoveUp = useCallback(
    (index: number) => {
      if (index <= 0) return;
      const newTeams = [...teams];
      [newTeams[index - 1], newTeams[index]] = [newTeams[index], newTeams[index - 1]];
      reorderTeams(newTeams);
    },
    [teams, reorderTeams]
  );

  // Simple reorder: move team down
  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= teams.length - 1) return;
      const newTeams = [...teams];
      [newTeams[index], newTeams[index + 1]] = [newTeams[index + 1], newTeams[index]];
      reorderTeams(newTeams);
    },
    [teams, reorderTeams]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>دوران اللاعبين</Text>
      </View>
      

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Match */}
        {/* <CurrentMatch teamA={teamA} teamB={teamB} /> */}

        {/* Add Team Form */}
        <AddTeamForm onAddTeam={handleAddTeam} />

        {/* Team Queue */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>قائمة الفرق ({teams.length})</Text>
        </View>

        {teams.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={styles.emptyText}>لا توجد فرق بعد</Text>
            <Text style={styles.emptySubtext}>أضف فريقًا للبدء</Text>
          </View>
        ) : (
          teams.map((team, index) => (
            <View key={team.id}>
              {editingTeam?.id === team.id ? (
                /* Inline Edit Mode */
                <View style={styles.editCard}>
                  <TextInput
                    style={styles.editInput}
                    value={editPlayer1}
                    onChangeText={setEditPlayer1}
                    placeholder="اسم اللاعب الأول"
                    placeholderTextColor={colors.textMuted}
                    textAlign="right"
                  />
                  <TextInput
                    style={styles.editInput}
                    value={editPlayer2}
                    onChangeText={setEditPlayer2}
                    placeholder="اسم اللاعب الثاني"
                    placeholderTextColor={colors.textMuted}
                    textAlign="right"
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      style={[styles.editBtn, styles.editBtnCancel]}
                      onPress={handleEditCancel}
                    >
                      <Text style={styles.editBtnCancelText}>{BTN_CANCEL}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editBtn, styles.editBtnSave]}
                      onPress={handleEditSave}
                    >
                      <Text style={styles.editBtnSaveText}>{BTN_SAVE}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* Normal Display Mode */
                <View style={[
                  styles.teamCard,
                  index < 2 && styles.teamCardPlaying,
                ]}>
                  {/* Position Badge */}
                  <View style={[
                    styles.positionBadge,
                    index < 2 ? styles.positionBadgeActive : null,
                  ]}>
                    <Text style={[
                      styles.positionText,
                      index < 2 ? styles.positionTextActive : null,
                    ]}>
                      {index + 1}
                    </Text>
                  </View>

                  {/* Team Info */}
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>
                      {team.player1} / {team.player2}
                    </Text>
                  </View>
                    {index < 2 && (
                      <View style={styles.playingBadge}>
                        <Text style={styles.playingBadgeText}>يلعب الآن</Text>
                      </View>
                    )}

                  {/* Actions */}
                  <View style={styles.teamActions}>
                    {/* Move buttons */}
                    <TouchableOpacity
                      onPress={() => handleMoveUp(index)}
                      disabled={index === 0}
                      style={styles.actionBtn}
                    >
                      <MaterialCommunityIcons
                        name="chevron-up"
                        size={22}
                        color={index === 0 ? colors.textMuted : colors.textSecondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleMoveDown(index)}
                      disabled={index === teams.length - 1}
                      style={styles.actionBtn}
                    >
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={22}
                        color={index === teams.length - 1 ? colors.textMuted : colors.textSecondary}
                      />
                    </TouchableOpacity>
                    {/* Edit */}
                    <TouchableOpacity
                      onPress={() => handleEditStart(team)}
                      style={styles.actionBtn}
                    >
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                    {/* Delete */}
                    <TouchableOpacity
                      onPress={() => handleDelete(team.id)}
                      style={styles.actionBtn}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={20}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}

        {/* Match History */}
        {teams.length > 0 && <MatchHistoryList matchHistory={matchHistory} />}

        {/* Reset Button */}
        {teams.length > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={handleResetAll}>
            <MaterialCommunityIcons name="delete-sweep-outline" size={20} color={colors.error} />
            <Text style={styles.resetButtonText}>{BTN_RESET}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    paddingBottom: spacing.xxl * 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    writingDirection: 'rtl',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
    writingDirection: 'rtl',
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    writingDirection: 'rtl',
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  teamCardPlaying: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  positionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.md,
  },
  positionBadgeActive: {
    backgroundColor: colors.primary,
  },
  positionText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  positionTextActive: {
    color: '#FFFFFF',
  },
  teamInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  teamName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  playingBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  playingBadgeText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  teamActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionBtn: {
    padding: spacing.xs,
  },
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  editBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  editBtnSave: {
    backgroundColor: colors.primary,
  },
  editBtnSaveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  editBtnCancel: {
    backgroundColor: colors.surfaceLight,
  },
  editBtnCancelText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
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
