export type PracticeMode = 'training' | 'test' | 'global';

export interface TableProgress {
  table: number;
  attempts: number;
  correct: number;
  masteryScore: number;
  lastPlayed: string | null;
  streak: number;
}

export interface SessionAnswerDetail {
  table: number;
  multiplier: number;
  correct: boolean;
}

export interface SessionSummary {
  mode: PracticeMode;
  questions: number;
  correct: number;
  date: string;
  details: SessionAnswerDetail[];
}

export interface GlobalProgress {
  totalAttempts: number;
  totalCorrect: number;
  weightedSuccess: number;
  sessions: SessionSummary[];
}

export interface UserProgress {
  tables: Record<number, TableProgress>;
  global: GlobalProgress;
}

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
  progress: UserProgress;
}

export interface ProgressState {
  version: number;
  profiles: Profile[];
  activeProfileId: string | null;
}

export const PROGRESS_STATE_VERSION = 1;

export const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];

export function createEmptyTableProgress(table: number): TableProgress {
  return {
    table,
    attempts: 0,
    correct: 0,
    masteryScore: 0,
    lastPlayed: null,
    streak: 0
  };
}

export function createEmptyUserProgress(): UserProgress {
  const tables: Record<number, TableProgress> = {};
  for (const t of TABLES) {
    tables[t] = createEmptyTableProgress(t);
  }
  return {
    tables,
    global: {
      totalAttempts: 0,
      totalCorrect: 0,
      weightedSuccess: 0,
      sessions: []
    }
  };
}

export function createInitialState(): ProgressState {
  return {
    version: PROGRESS_STATE_VERSION,
    profiles: [],
    activeProfileId: null
  };
}
