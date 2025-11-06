import type { Team as TeamType, Player, DraftPick } from '../../services/supabase';

export type Team = TeamType;

export interface DraftContextType {
  teams: Team[];
  players: Player[];
  draftPicks: DraftPick[];
  currentPick: number;
  isPaused: boolean;
  isStarted: boolean;
  timeLeft: number;
  isLoading: boolean;
  selectPlayer: (playerId: string) => Promise<void>;
  skipPick: () => void;
  startDraft: () => void;
  togglePause: () => void;
  resetDraft: () => Promise<void>;
}
