// ============================================================
// Basra Manager — Data Models & Types
// ============================================================

/**
 * Represents a team of two players.
 */
export interface Team {
  id: string;
  player1: string;
  player2: string;
}

/**
 * A single round of scoring within a game.
 */
export interface ScoreRound {
  id: string;
  teamAScore: number;
  teamBScore: number;
  createdAt: string; // ISO 8601 date string for serialization
}

/**
 * Record of a completed match between two teams.
 */
export interface MatchRecord {
  id: string;
  winnerTeam: Team;
  loserTeam: Team;
  winnerScore: number;
  loserScore: number;
  rounds: ScoreRound[];
  playedAt: string; // ISO 8601 date string
}

/**
 * Tournament leaderboard entry for a team.
 */
export interface TournamentEntry {
  teamId: string;
  team: Team;
  gamesPlayed: number;
  wins: number;
  losses: number;
}

/**
 * Which side won the game: Team A or Team B.
 */
export type WinnerSide = 'A' | 'B';

/**
 * Score store state shape.
 */
export interface ScoreState {
  teamATotal: number;
  teamBTotal: number;
  rounds: ScoreRound[];
  isGameOver: boolean;
  winnerSide: WinnerSide | null;

  addRound: (teamAScore: number, teamBScore: number) => void;
  resetGame: () => void;
  undoLastRound: () => void;
  dismissWinner: () => void;
}

/**
 * Rotation store state shape.
 */
export interface RotationState {
  teams: Team[];
  matchHistory: MatchRecord[];

  addTeam: (player1: string, player2: string) => void;
  editTeam: (id: string, player1: string, player2: string) => void;
  deleteTeam: (id: string) => void;
  reorderTeams: (teams: Team[]) => void;
  rotateAfterWin: (
    winnerSide: WinnerSide,
    winnerScore: number,
    loserScore: number,
    rounds: ScoreRound[]
  ) => void;
  resetAll: () => void;
}

/**
 * Tournament store state shape.
 */
export interface TournamentState {
  entries: TournamentEntry[];

  recordMatch: (winner: Team, loser: Team) => void;
  resetTournament: () => void;
}
