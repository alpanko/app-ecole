import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Profile } from '../core/progress/progress.models';
import { ProgressService } from '../core/progress/progress.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="page">
      <section class="surface-card hero" aria-labelledby="hero-title">
        <p class="badge">Qui joue aujourd'hui ?</p>
        <h1 id="hero-title" class="heading-xl">Choisis ton explorateur</h1>
        <p class="text-lg">
          Selectionne un profil pour suivre la progression de chaque enfant et garder ses exploits en memoire.
        </p>

        <form class="create-form" (ngSubmit)="createProfile()">
          <label class="sr-only" for="child-name">Prenom de l'explorateur</label>
          <input
            id="child-name"
            name="child-name"
            type="text"
            [(ngModel)]="newChildName"
            placeholder="Prenom de l'explorateur"
            autocomplete="name"
            required
          />
          <button type="submit" class="btn btn--primary btn--pill">
            Creer un nouveau profil
          </button>
        </form>
        <p class="form-hint" *ngIf="creationError">{{ creationError }}</p>
      </section>

      <section class="page__section profiles-section" aria-label="Profils disponibles">
        <ng-container *ngIf="profiles$ | async as profiles; else loading">
          <ng-container *ngIf="profiles.length; else emptyState">
            <div class="profile-grid">
              <article
                class="surface-card surface-card--compact profile-card"
                *ngFor="let profile of profiles; trackBy: trackProfile"
              >
                <header class="profile-card__header">
                  <div>
                    <h2>{{ profile.name }}</h2>
                    <p class="profile-card__subtitle">
                      {{ profile.progress.global.totalAttempts }} questions jouees
                    </p>
                  </div>
                  <span class="pill score-pill">
                    {{ globalScore(profile) }} %
                    <small>niveau global</small>
                  </span>
                </header>

                <footer class="profile-card__actions">
                  <button class="btn btn--secondary btn--pill" type="button" (click)="selectProfile(profile)">
                    Continuer l'aventure
                  </button>
                </footer>
              </article>
            </div>
          </ng-container>
        </ng-container>
      </section>
    </div>

    <ng-template #loading>
      <section class="page__section empty-state">
        <p>Chargement des profils...</p>
      </section>
    </ng-template>

    <ng-template #emptyState>
      <section class="surface-card surface-card--compact empty-state">
        <h2>Cree ton premier explorateur</h2>
        <p>Ajoute un prenom ci-dessus pour commencer l'aventure et suivre ses progres.</p>
      </section>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .hero {
      max-width: 900px;
    }

    .hero::before,
    .hero::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      opacity: 0.32;
      filter: blur(0.5px);
      mix-blend-mode: screen;
    }

    .hero::before {
      width: 180px;
      height: 180px;
      background: rgba(79, 139, 255, 0.5);
      top: -60px;
      left: -40px;
    }

    .hero::after {
      width: 200px;
      height: 200px;
      background: rgba(255, 209, 102, 0.45);
      bottom: -80px;
      right: -50px;
    }

    .create-form {
      margin-top: clamp(22px, 4vw, 36px);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }

    .create-form input {
      flex: 1 1 280px;
      padding: 16px 18px;
      border-radius: var(--radius-md);
      border: 2px solid transparent;
      background: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .create-form input:focus {
      outline: none;
      border-color: rgba(79, 139, 255, 0.65);
      box-shadow: 0 0 0 4px rgba(79, 139, 255, 0.2);
    }

    .form-hint {
      margin-top: 12px;
      color: #b3261e;
      font-weight: 600;
    }

    .profiles-section {
      width: 100%;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: clamp(18px, 4vw, 24px);
    }

    .profile-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .profile-card__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .profile-card__subtitle {
      margin: 4px 0 0;
      color: var(--color-muted);
      font-size: 0.9rem;
    }

    .score-pill {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      background: rgba(79, 139, 255, 0.12);
      color: var(--color-primary);
      font-weight: 700;
    }

    .score-pill small {
      font-size: 0.7rem;
      font-weight: 600;
      color: rgba(33, 53, 71, 0.7);
    }

    .profile-card__actions {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }

    .empty-state {
      text-align: center;
      margin-top: 24px;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 640px) {
      .profile-card__header {
        flex-direction: column;
        align-items: flex-start;
      }

      .score-pill {
        align-self: flex-start;
      }
    }
  `]
})
export class HomeComponent {
  profiles$: Observable<Profile[]> = this.progressService.profiles$;
  newChildName = '';
  creationError: string | null = null;

  constructor(
    private readonly progressService: ProgressService,
    private readonly router: Router
  ) {}

  trackProfile(_: number, profile: Profile): string {
    return profile.id;
  }

  createProfile(): void {
    const trimmed = this.newChildName.trim();
    if (!trimmed) {
      this.creationError = 'Entre un prenom pour creer un profil.';
      return;
    }

    const profile = this.progressService.createProfile(trimmed);
    this.newChildName = '';
    this.creationError = null;
    this.navigateToMath(profile);
  }

  selectProfile(profile: Profile): void {
    this.progressService.selectProfile(profile.id);
    this.navigateToMath(profile);
  }

  globalScore(profile: Profile): number {
    return profile.progress.global.weightedSuccess;
  }

  private navigateToMath(profile: Profile): void {
    this.progressService.selectProfile(profile.id);
    this.router.navigate(['/math']);
  }
}
