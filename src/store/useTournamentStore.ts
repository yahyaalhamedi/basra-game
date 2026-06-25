// ============================================================
// Basra Manager — Tournament Store (Zustand + AsyncStorage)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TournamentState, TournamentEntry, Team } from '../models/types';

const initialState = {
  entries: [] as TournamentEntry[],
};

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      recordMatch: (winner: Team, loser: Team) => {
        const entries = [...get().entries];

        // Find or create winner entry
        const winnerIdx = entries.findIndex((e) => e.teamId === winner.id);
        if (winnerIdx >= 0) {
          entries[winnerIdx] = {
            ...entries[winnerIdx],
            team: { ...winner }, // Update name in case it was edited
            gamesPlayed: entries[winnerIdx].gamesPlayed + 1,
            wins: entries[winnerIdx].wins + 1,
          };
        } else {
          entries.push({
            teamId: winner.id,
            team: { ...winner },
            gamesPlayed: 1,
            wins: 1,
            losses: 0,
          });
        }

        // Find or create loser entry
        const loserIdx = entries.findIndex((e) => e.teamId === loser.id);
        if (loserIdx >= 0) {
          entries[loserIdx] = {
            ...entries[loserIdx],
            team: { ...loser },
            gamesPlayed: entries[loserIdx].gamesPlayed + 1,
            losses: entries[loserIdx].losses + 1,
          };
        } else {
          entries.push({
            teamId: loser.id,
            team: { ...loser },
            gamesPlayed: 1,
            wins: 0,
            losses: 1,
          });
        }

        set({ entries });
      },

      resetTournament: () => {
        set({ ...initialState });
      },

      getLeaderboard: () => {
        return [...get().entries].sort((a, b) => {
          // Sort by win percentage descending, then by total wins descending
          const aPct = a.gamesPlayed > 0 ? a.wins / a.gamesPlayed : 0;
          const bPct = b.gamesPlayed > 0 ? b.wins / b.gamesPlayed : 0;
          if (bPct !== aPct) return bPct - aPct;
          return b.wins - a.wins;
        });
      },
    }),
    {
      name: 'basra-tournament-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
