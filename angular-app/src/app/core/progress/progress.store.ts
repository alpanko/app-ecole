import { Injectable, InjectionToken } from '@angular/core';
import {
  ProgressState,
  PROGRESS_STATE_VERSION,
  createInitialState
} from './progress.models';

export interface ProgressStore {
  load(): Promise<ProgressState | null>;
  save(state: ProgressState): Promise<void>;
  clear(): Promise<void>;
}

export const PROGRESS_STORE = new InjectionToken<ProgressStore>('PROGRESS_STORE');

const STORAGE_KEY = 'app-ecole-progress';

@Injectable()
export class LocalStorageProgressStore implements ProgressStore {
  async load(): Promise<ProgressState | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as ProgressState | { version: number };
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        (parsed as ProgressState).version !== PROGRESS_STATE_VERSION
      ) {
        return null;
      }

      return parsed as ProgressState;
    } catch (error) {
      console.warn('Progress store load error', error);
      return null;
    }
  }

  async save(state: ProgressState): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Progress store save error', error);
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function createDefaultState(): ProgressState {
  return createInitialState();
}
