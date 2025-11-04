import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GlobalProgress,
  PracticeMode,
  Profile,
  ProgressState,
  SessionAnswerDetail,
  SessionSummary,
  TableProgress,
  createEmptyTableProgress,
  createEmptyUserProgress,
  createInitialState,
  TABLES
} from './progress.models';
import { PROGRESS_STORE, ProgressStore } from './progress.store';

interface ActiveSession {
  mode: PracticeMode;
  startedAt: string;
  answers: SessionAnswerDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly stateSubject = new BehaviorSubject<ProgressState>(createInitialState());
  private activeSession: ActiveSession | null = null;

  readonly state$ = this.stateSubject.asObservable();
  readonly profiles$ = this.state$.pipe(map((state) => state.profiles));
  readonly activeProfile$ = this.state$.pipe(
    map((state) => this.findProfileById(state, state.activeProfileId) ?? null)
  );

  constructor(@Inject(PROGRESS_STORE) private readonly store: ProgressStore) {
    this.bootstrap();
  }

  async bootstrap(): Promise<void> {
    const saved = await this.store.load();
    if (saved) {
      this.stateSubject.next(saved);
    } else {
      await this.persist();
    }
  }

  createProfile(name: string): Profile {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Le nom ne peut pas etre vide.');
    }

    const profile: Profile = {
      id: this.generateId(),
      name: trimmed,
      createdAt: new Date().toISOString(),
      progress: createEmptyUserProgress()
    };

    this.updateState((state) => ({
      ...state,
      profiles: [...state.profiles, profile],
      activeProfileId: profile.id
    }));

    return profile;
  }

  renameProfile(id: string, name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    this.updateProfile(id, (profile) => ({
      ...profile,
      name: trimmed
    }));
  }

  selectProfile(id: string): void {
    this.updateState((state) => ({
      ...state,
      activeProfileId: this.findProfileById(state, id) ? id : null
    }));
    this.activeSession = null;
  }

  removeProfile(id: string): void {
    this.updateState((state) => {
      const profiles = state.profiles.filter((p) => p.id !== id);
      const activeProfileId =
        state.activeProfileId === id ? (profiles[0]?.id ?? null) : state.activeProfileId;
      return {
        ...state,
        profiles,
        activeProfileId
      };
    });
    this.activeSession = null;
  }

  beginSession(mode: PracticeMode): void {
    this.activeSession = {
      mode,
      startedAt: new Date().toISOString(),
      answers: []
    };
  }

  recordAnswer(payload: { table: number; multiplier: number; correct: boolean; mode: PracticeMode }): void {
    const profile = this.getActiveProfileSnapshot();
    if (!profile) return;

    if (!this.activeSession || this.activeSession.mode !== payload.mode) {
      this.beginSession(payload.mode);
    }

    const timestamp = new Date().toISOString();
    this.activeSession!.answers.push({
      table: payload.table,
      multiplier: payload.multiplier,
      correct: payload.correct
    });

    this.updateProfile(profile.id, (current) => {
      const tableEntry = current.progress.tables[payload.table] ?? createEmptyTableProgress(payload.table);
      const updatedTable = this.updateTableProgress(tableEntry, payload.correct, timestamp);
      const tables = {
        ...current.progress.tables,
        [payload.table]: updatedTable
      };

      const global = this.updateGlobalProgress(
        {
          ...current.progress.global
        },
        tables,
        payload.table,
        payload.correct
      );

      return {
        ...current,
        progress: {
          tables,
          global
        }
      };
    });
  }

  completeSession(details?: { mode?: PracticeMode; date?: string }): void {
    const profile = this.getActiveProfileSnapshot();
    const session = this.activeSession;
    if (!profile || !session || session.answers.length === 0) {
      this.activeSession = null;
      return;
    }

    const mode = details?.mode ?? session.mode;
    const date = details?.date ?? new Date().toISOString();
    const questions = session.answers.length;
    const correct = session.answers.filter((answer) => answer.correct).length;

    const summary: SessionSummary = {
      mode,
      questions,
      correct,
      date,
      details: [...session.answers]
    };

    this.updateProfile(profile.id, (current) => {
      const sessions = [...current.progress.global.sessions, summary].slice(-50);
      const weightedSuccess = this.computeWeightedSuccess(current.progress.tables);
      const totalAttempts = current.progress.global.totalAttempts;
      const totalCorrect = current.progress.global.totalCorrect;

      return {
        ...current,
        progress: {
          tables: current.progress.tables,
          global: {
            totalAttempts,
            totalCorrect,
            weightedSuccess,
            sessions
          }
        }
      };
    });

    this.activeSession = null;
  }

  cancelSession(): void {
    this.activeSession = null;
  }

  resetProgress(profileId: string): void {
    this.updateProfile(profileId, (profile) => ({
      ...profile,
      progress: createEmptyUserProgress()
    }));
    if (this.activeSession) {
      this.cancelSession();
    }
  }

  getActiveProfileSnapshot(): Profile | null {
    const state = this.stateSubject.value;
    return this.findProfileById(state, state.activeProfileId) ?? null;
  }

  private updateTableProgress(
    table: TableProgress,
    correct: boolean,
    timestamp: string
  ): TableProgress {
    const attempts = table.attempts + 1;
    const correctCount = correct ? table.correct + 1 : table.correct;
    const streak = correct ? table.streak + 1 : 0;

    const updated: TableProgress = {
      ...table,
      attempts,
      correct: correctCount,
      streak,
      lastPlayed: timestamp
    };

    return {
      ...updated,
      masteryScore: this.computeMasteryScore(updated, timestamp)
    };
  }

  private updateGlobalProgress(
    global: GlobalProgress,
    tables: Record<number, TableProgress>,
    table: number,
    correct: boolean
  ): GlobalProgress {
    const totalAttempts = global.totalAttempts + 1;
    const totalCorrect = correct ? global.totalCorrect + 1 : global.totalCorrect;
    const weightedSuccess = this.computeWeightedSuccess(tables);

    return {
      totalAttempts,
      totalCorrect,
      weightedSuccess,
      sessions: global.sessions
    };
  }

  private computeMasteryScore(table: TableProgress, timestamp: string): number {
    if (table.attempts === 0) {
      return 0;
    }

    const accuracy = table.correct / table.attempts;

    let recencyFactor = 1;
    if (table.lastPlayed) {
      const last = new Date(table.lastPlayed).getTime();
      const now = new Date(timestamp).getTime();
      const days = (now - last) / (1000 * 60 * 60 * 24);
      recencyFactor = Math.max(0.2, Math.min(1, 1 - days / 14));
    }

    const streakFactor = 1 + Math.min(table.streak, 5) * 0.04;
    const rawScore = accuracy * recencyFactor * streakFactor;
    return Math.round(Math.min(1, rawScore) * 100);
  }

  private computeWeightedSuccess(tables: Record<number, TableProgress>): number {
    let weightedAttempts = 0;
    let weightedCorrect = 0;
    for (const t of TABLES) {
      const entry = tables[t];
      if (!entry || entry.attempts === 0) continue;
      const weight = this.tableWeight(t);
      weightedAttempts += entry.attempts * weight;
      weightedCorrect += entry.correct * weight;
    }
    if (weightedAttempts === 0) return 0;
    return Math.round((weightedCorrect / weightedAttempts) * 100);
  }

  private tableWeight(table: number): number {
    if (table >= 6) return 1.4;
    if (table >= 4) return 1.0;
    return 0.8;
  }

  private updateProfile(id: string, updater: (profile: Profile) => Profile): void {
    this.updateState((state) => {
      const index = state.profiles.findIndex((p) => p.id === id);
      if (index === -1) {
        return state;
      }
      const updatedProfile = updater(state.profiles[index]);
      const profiles = [...state.profiles];
      profiles[index] = updatedProfile;
      return {
        ...state,
        profiles
      };
    });
  }

  private updateState(updater: (state: ProgressState) => ProgressState): void {
    const current = this.stateSubject.value;
    const updated = updater(current);
    if (updated !== current) {
      this.stateSubject.next(updated);
      this.persist();
    }
  }

  private async persist(): Promise<void> {
    await this.store.save(this.stateSubject.value);
  }

  private findProfileById(state: ProgressState, id: string | null): Profile | undefined {
    if (!id) return undefined;
    return state.profiles.find((profile) => profile.id === id);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `profile-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
