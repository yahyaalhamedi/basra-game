// ============================================================
// Basra Manager — Score Store (Zustand + AsyncStorage)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreState, ScoreRound, WinnerSide } from '../models/types';
import { TARGET_SCORE } from '../utils/constants';
import { generateId } from '../utils/helpers';

const initialState = {
  teamATotal: 0,
  teamBTotal: 0,
  rounds: [] as ScoreRound[],
  isGameOver: false,
  winnerSide: null as WinnerSide | null,
};

export const useScoreStore = create<ScoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addRound: (teamAScore: number, teamBScore: number) => {
        const newRound: ScoreRound = {
          id: generateId(),
          teamAScore,
          teamBScore,
          createdAt: new Date().toISOString(),
        };

        const newTeamATotal = get().teamATotal + teamAScore;
        const newTeamBTotal = get().teamBTotal + teamBScore;

        let isGameOver = false;
        let winnerSide: WinnerSide | null = null;

        if (newTeamATotal >= TARGET_SCORE || newTeamBTotal >= TARGET_SCORE) {
          isGameOver = true;
          if (newTeamATotal >= TARGET_SCORE && newTeamBTotal >= TARGET_SCORE) {
            // Both exceeded: higher score wins
            winnerSide = newTeamATotal >= newTeamBTotal ? 'A' : 'B';
          } else {
            winnerSide = newTeamATotal >= TARGET_SCORE ? 'A' : 'B';
          }
        }

        set({
          teamATotal: newTeamATotal,
          teamBTotal: newTeamBTotal,
          rounds: [newRound, ...get().rounds],
          isGameOver,
          winnerSide,
        });
      },

      resetGame: () => {
        set({ ...initialState });
      },

      undoLastRound: () => {
        const rounds = get().rounds;
        if (rounds.length === 0) return;

        const lastRound = rounds[0];
        set({
          teamATotal: get().teamATotal - lastRound.teamAScore,
          teamBTotal: get().teamBTotal - lastRound.teamBScore,
          rounds: rounds.slice(1),
          isGameOver: false,
          winnerSide: null,
        });
      },

      dismissWinner: () => {
        set({ isGameOver: false, winnerSide: null });
      },
    }),
    {
      name: 'basra-score-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
