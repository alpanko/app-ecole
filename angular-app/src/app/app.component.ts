import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Profile, TABLES } from './core/progress/progress.models';
import { ProgressService } from './core/progress/progress.service';

interface TableMasteryView {
  table: number;
  mastery: number;
  attempts: number;
}

interface SessionView {
  mode: string;
  correct: number;
  questions: number;
  date: string;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="app-frame">
      <header class="app-header" aria-label="Navigation principale">
        <button
          *ngIf="showBackButton"
          type="button"
          class="app-header__back btn btn--ghost btn--pill"
          (click)="goBack()">
          Retour
        </button>
        <h1 class="app-header__title">{{ headerTitle }}</h1>
        <span class="app-header__spacer" aria-hidden="true"></span>

        <div class="profile-menu" *ngIf="activeProfile">
          <button class="profile-trigger" type="button" (click)="toggleProfilePanel()">
            <span class="profile-trigger__avatar">{{ profileInitials }}</span>
            <span class="profile-trigger__name">{{ activeProfile.name }}</span>
          </button>
          <div class="profile-panel" *ngIf="profilePanelOpen">
            <header class="profile-panel__header">
              <div>
                <h2>{{ activeProfile.name }}</h2>
                <p>Explorateur depuis le {{ profileCreatedAt }}</p>
              </div>
              <button type="button" class="btn btn--ghost btn--pill" (click)="closeProfilePanel()">Fermer</button>
            </header>

            <section class="profile-panel__section">
              <h3>Progression globale</h3>
              <div class="profile-summary">
                <div>
                  <span class="profile-summary__label">Reussite ponderee</span>
                  <strong>{{ activeProfile.progress.global.weightedSuccess }} %</strong>
                </div>
                <div>
                  <span class="profile-summary__label">Questions jouees</span>
                  <strong>{{ activeProfile.progress.global.totalAttempts }}</strong>
                </div>
                <div>
                  <span class="profile-summary__label">Reponses correctes</span>
                  <strong>{{ activeProfile.progress.global.totalCorrect }}</strong>
                </div>
              </div>
            </section>

            <section class="profile-panel__section">
              <h3>Maitrise par table</h3>
              <ul class="profile-table-list">
                <li *ngFor="let item of tableMastery">
                  <span>Table de {{ item.table }}</span>
                  <div class="profile-table-list__stats">
                    <span>{{ item.mastery }} %</span>
                    <small>{{ item.attempts }} questions</small>
                  </div>
                </li>
              </ul>
            </section>

            <section class="profile-panel__section">
              <h3>Dernieres sessions</h3>
              <ng-container *ngIf="recentSessions.length; else noSessions">
                <ul class="profile-session-list">
                  <li *ngFor="let session of recentSessions">
                    <div>
                      <strong>{{ session.mode }}</strong>
                      <small>{{ session.date }}</small>
                    </div>
                    <span>{{ session.correct }} / {{ session.questions }}</span>
                  </li>
                </ul>
              </ng-container>
              <ng-template #noSessions>
                <p class="profile-panel__empty">Aucune session enregistree pour le moment.</p>
              </ng-template>
            </section>
          </div>
        </div>
      </header>
      <main class="app-shell">
        <router-outlet></router-outlet>
      </main>
      <div
        class="profile-backdrop"
        *ngIf="profilePanelOpen"
        (click)="closeProfilePanel()"
        aria-hidden="true">
      </div>
    </div>
  `,
  styles: [``]
})
export class AppComponent implements OnDestroy {
  showBackButton = false;
  headerTitle = 'Ecole des Explorateurs';
  activeProfile: Profile | null = null;
  profilePanelOpen = false;

  private readonly destroy$ = new Subject<void>();
  private readonly titleMap: Record<string, string> = {
    '': 'Ecole des Explorateurs',
    math: 'Mission Maths'
  };

  constructor(private readonly router: Router, private readonly progressService: ProgressService) {
    this.router.events
      .pipe(filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe((event) => {
        const currentPath = event.urlAfterRedirects.replace(/^\//, '');
        this.showBackButton = currentPath.length > 0;
        this.headerTitle = this.titleMap[currentPath] ?? 'Ecole des Explorateurs';
        this.profilePanelOpen = false;
      });

    this.progressService.activeProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.activeProfile = profile;
        if (!profile) {
          this.profilePanelOpen = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get profileInitials(): string {
    if (!this.activeProfile) {
      return '';
    }
    const parts = this.activeProfile.name.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());
    return initials.join('') || this.activeProfile.name.charAt(0).toUpperCase();
  }

  get profileCreatedAt(): string {
    if (!this.activeProfile) return '';
    const date = new Date(this.activeProfile.createdAt);
    return date.toLocaleDateString();
  }

  get tableMastery(): TableMasteryView[] {
    if (!this.activeProfile) return [];
    return TABLES.map((table) => {
      const entry = this.activeProfile!.progress.tables[table];
      return {
        table,
        mastery: entry?.masteryScore ?? 0,
        attempts: entry?.attempts ?? 0
      };
    });
  }

  get recentSessions(): SessionView[] {
    if (!this.activeProfile) return [];
    return [...this.activeProfile.progress.global.sessions]
      .slice(-5)
      .reverse()
      .map((session) => ({
        mode: this.sessionLabel(session.mode),
        correct: session.correct,
        questions: session.questions,
        date: new Date(session.date).toLocaleDateString()
      }));
  }

  toggleProfilePanel(): void {
    if (!this.activeProfile) return;
    this.profilePanelOpen = !this.profilePanelOpen;
  }

  closeProfilePanel(): void {
    this.profilePanelOpen = false;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private sessionLabel(mode: string): string {
    switch (mode) {
      case 'training':
        return 'Entrainement';
      case 'test':
        return 'Test';
      case 'global':
        return 'Test global';
      default:
        return mode;
    }
  }
}
