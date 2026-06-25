// ============================================================
// Basra Manager — Rotation Store (Zustand + AsyncStorage)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RotationState, Team, MatchRecord, WinnerSide, ScoreRound } from '../models/types';
import { generateId } from '../utils/helpers';

const initialState = {
  teams: [] as Team[],
  matchHistory: [] as MatchRecord[],
};

export const useRotationStore = create<RotationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addTeam: (player1: string, player2: string) => {
        const newTeam: Team = {
          id: generateId(),
          player1: player1.trim(),
          player2: player2.trim(),
        };
        set({ teams: [...get().teams, newTeam] });
      },

      editTeam: (id: string, player1: string, player2: string) => {
        set({
          teams: get().teams.map((t) =>
            t.id === id ? { ...t, player1: player1.trim(), player2: player2.trim() } : t
          ),
        });
      },

      deleteTeam: (id: string) => {
        set({ teams: get().teams.filter((t) => t.id !== id) });
      },

      reorderTeams: (teams: Team[]) => {
        set({ teams });
      },

      rotateAfterWin: (
        winnerSide: WinnerSide,
        winnerScore: number,
        loserScore: number,
        rounds: ScoreRound[]
      ) => {
        const teams = [...get().teams];
        if (teams.length < 2) return;

        const teamA = teams[0];
        const teamB = teams[1];
        const winner = winnerSide === 'A' ? teamA : teamB;
        const loser = winnerSide === 'A' ? teamB : teamA;

        // Record match history
        const matchRecord: MatchRecord = {
          id: generateId(),
          winnerTeam: { ...winner },
          loserTeam: { ...loser },
          winnerScore,
          loserScore,
          rounds: [...rounds],
          playedAt: new Date().toISOString(),
        };

        // Remove both active playing teams to get the queue of remaining teams
        const remainingTeams = teams.filter((t) => t.id !== teamA.id && t.id !== teamB.id);

        let newTeams: Team[];
        if (winnerSide === 'A') {
          // Team A stays at index 0 (Left/Us, Green). Team B (loser) goes to the end of the queue.
          // The next challenger (first of remaining) takes index 1.
          newTeams = [teamA, ...remainingTeams, teamB];
        } else {
          // Team B stays at index 1 (Right/Them, Orange). Team A (loser) goes to the end of the queue.
          // The next challenger (first of remaining) takes index 0.
          if (remainingTeams.length > 0) {
            newTeams = [remainingTeams[0], teamB, ...remainingTeams.slice(1), teamA];
          } else {
            // Only 2 teams total, they stay in their respective positions.
            newTeams = [teamA, teamB];
          }
        }

        set({
          teams: newTeams,
          matchHistory: [matchRecord, ...get().matchHistory],
        });
      },

      resetAll: () => {
        set({ ...initialState });
      },

      getCurrentMatch: () => {
        const teams = get().teams;
        return {
          teamA: teams.length > 0 ? teams[0] : null,
          teamB: teams.length > 1 ? teams[1] : null,
        };
      },
    }),
    {
      name: 'basra-rotation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
