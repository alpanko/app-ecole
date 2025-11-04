import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PracticeMode } from '../core/progress/progress.models';
import { ProgressService } from '../core/progress/progress.service';

type Question = {
  prompt: string;
  answer: number;
  table: number;
  multiplier: number;
  choices?: number[];
};

@Component({
  selector: 'app-math',
  template: `
    <div class="page">
      <section *ngIf="!showTable && !inQcm" class="surface-card hero" aria-labelledby="math-hero-title">
        <div class="active-profile" *ngIf="activeProfileName">
          <span class="pill">Explorateur : {{ activeProfileName }}</span>
        </div>
        <p class="badge badge--math">Mission Maths</p>
        <h1 id="math-hero-title" class="heading-xl">Choisis ton nombre prefere</h1>
        <p class="text-lg">
          Explore sa table, entraine-toi avec un quiz ou lance un test pour valider ta mission.
        </p>

        <div class="digit-grid" role="group" aria-label="Choisir un chiffre">
          <button
            *ngFor="let d of digits"
            class="btn btn--digit"
            type="button"
            (click)="selectDigit(d)"
            [class.btn--digit-active]="selectedDigit === d">
            {{ d }}
          </button>
        </div>

        <div class="hero__status" *ngIf="selectedDigit">
          <span class="pill">Chiffre selectionne : {{ selectedDigit }}</span>
        </div>

        <div class="cta-row" *ngIf="!showTable && !inQcm">
          <button class="btn btn--primary btn--wide" type="button" (click)="viewTable()" [disabled]="!selectedDigit">
            Voir la table
            <span>Affiche les 10 premiers resultats</span>
          </button>
          <button class="btn btn--secondary btn--wide" type="button" (click)="startTraining()" [disabled]="!selectedDigit">
            Entrainement
            <span>Quiz a choix multiples</span>
          </button>
          <button class="btn btn--ghost btn--wide" type="button" (click)="startTest()" [disabled]="!selectedDigit">
            Test
            <span>10 questions en reponse libre</span>
          </button>
        </div>

        <div class="global-test">
          <div>
            <h3>Test global</h3>
            <p>20 defis meles a toutes les tables, avec un focus sur les niveaux 6 a 9.</p>
          </div>
          <button class="btn btn--accent btn--wide" type="button" (click)="startGlobalTest()">
            Lancer le test global
            <span>20 questions au niveau des grands explorateurs</span>
          </button>
        </div>
      </section>

      <section *ngIf="showTable" class="surface-card surface-card--compact page__section table-card" aria-label="Table de multiplication">
        <header class="table-card__header">
          <h2>Table de {{ selectedDigit }}</h2>
          <button class="btn btn--pill btn--ghost" type="button" (click)="closeTable()">Fermer</button>
        </header>
        <ul class="table-card__list">
          <li *ngFor="let i of tableRange">
            <span>{{ selectedDigit }} x {{ i }}</span>
            <strong>{{ selectedDigit! * i }}</strong>
          </li>
        </ul>
      </section>

      <section *ngIf="inQcm" class="surface-card surface-card--compact page__section qcm-card" aria-live="polite">
        <header class="qcm-card__header">
          <div>
            <p class="badge badge--math">{{ isGlobalMode ? 'Test global' : (isTestMode ? 'Test de mission' : 'Mode entrainement') }}</p>
            <h2>{{ qcmTitle }}</h2>
          </div>
          <div class="progress">
            <span>{{ correctCount }} reussites</span>
            <span *ngIf="currentQuestion">Question {{ qIndex + 1 }} / {{ qTotal }}</span>
          </div>
          <button class="btn btn--pill btn--ghost qcm-card__close" type="button" (click)="exitQcm()">
            Fermer
          </button>
        </header>

        <ng-container *ngIf="currentQuestion as question; else missionResult">
          <p class="prompt">{{ question.prompt }}</p>

          <div *ngIf="!isTestMode" class="choice-grid">
            <button
              *ngFor="let c of (question.choices || [])"
              class="btn btn--choice"
              type="button"
              (click)="answer(c)"
              [disabled]="answered"
              [ngClass]="choiceClass(c)">
              {{ c }}
            </button>
          </div>

          <div *ngIf="isTestMode" class="written-answer">
            <input
              type="number"
              [(ngModel)]="writtenAnswer"
              [disabled]="answered"
              (keyup.enter)="submitWrittenAnswer()"
              placeholder="Ecris ta reponse"
              aria-label="Ta reponse" />
            <button class="btn btn--primary" type="button" (click)="submitWrittenAnswer()" [disabled]="answered || writtenAnswer === ''">
              Valider
            </button>
          </div>

          <p *ngIf="feedbackMessage" class="feedback">{{ feedbackMessage }}</p>
        </ng-container>

        <ng-template #missionResult>
          <div class="result">
            <h3>{{ isGlobalMode ? 'Test global termine !' : 'Mission terminee !' }}</h3>
            <p>Score final : <strong>{{ correctCount }} / {{ qTotal }}</strong></p>
            <div class="cta-row">
              <ng-container *ngIf="!isGlobalMode; else globalActions">
                <button class="btn btn--primary btn--pill" type="button" (click)="startTraining()">Rejouer en entrainement</button>
                <button class="btn btn--secondary btn--pill" type="button" (click)="startTest()">Recommencer le test</button>
              </ng-container>
              <ng-template #globalActions>
                <button class="btn btn--accent btn--pill" type="button" (click)="startGlobalTest()">Rejouer le test global</button>
              </ng-template>
              <button class="btn btn--ghost btn--pill" type="button" (click)="exitQcm()">Retour a l'accueil des missions</button>
            </div>
          </div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .hero {
      max-width: 860px;
    }

    .badge--math {
      background: rgba(79, 139, 255, 0.18);
      color: var(--color-primary);
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

    .active-profile {
      margin-bottom: 12px;
    }

    .digit-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
      gap: 12px;
      margin: clamp(20px, 3vw, 28px) 0;
    }

    .btn--digit {
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      padding: 14px 0;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.85);
      color: var(--color-text);
    }

    .btn--digit-active,
    .btn--digit.btn--digit-active {
      background: var(--color-primary);
      color: #fff;
      box-shadow: 0 12px 28px rgba(79, 139, 255, 0.3);
    }

    .btn--wide {
      min-width: 220px;
    }

    .hero__status {
      margin-bottom: clamp(12px, 3vw, 20px);
    }

    .global-test {
      margin-top: clamp(18px, 4vw, 28px);
      padding: clamp(18px, 3vw, 26px);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.78);
      box-shadow: 0 12px 28px rgba(33, 53, 71, 0.12);
      display: flex;
      gap: 20px;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .global-test h3 {
      margin: 0;
      font-size: 1.35rem;
      color: var(--color-primary);
    }

    .global-test p {
      margin: 6px 0 0;
      color: var(--color-muted);
      max-width: 360px;
    }

    .table-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
    }

    .table-card__header h2 {
      margin: 0;
    }

    .table-card__list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 12px;
    }

    .table-card__list li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.7);
      color: var(--color-text);
      font-weight: 600;
    }

    .table-card__list strong {
      font-size: 1.1rem;
    }

    .qcm-card__header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .qcm-card__header > div:first-child {
      flex: 1 1 220px;
      min-width: 200px;
    }

    .qcm-card__header h2 {
      margin: 8px 0 0;
    }

    .progress {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      font-weight: 600;
      color: var(--color-muted);
      margin-left: auto;
    }

    .qcm-card__close {
      margin-left: auto;
    }

    .choice-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      margin-bottom: 16px;
    }

    .btn--choice {
      justify-content: center;
      align-items: center;
      padding: 14px;
      font-size: 1.1rem;
      background: rgba(255, 255, 255, 0.82);
    }

    .btn--choice.correct {
      background: rgba(96, 206, 150, 0.3);
      color: #1b5e20;
    }

    .btn--choice.wrong {
      background: rgba(255, 138, 128, 0.35);
      color: #7f1d1d;
    }

    .written-answer {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }

    .written-answer input {
      flex: 1;
      min-width: 180px;
      padding: 14px 16px;
      font-size: 1.05rem;
      border-radius: var(--radius-sm);
      border: 2px solid transparent;
      background: rgba(255, 255, 255, 0.85);
      transition: border-color 0.2s ease;
    }

    .written-answer input:focus {
      outline: none;
      border-color: rgba(79, 139, 255, 0.75);
    }

    .feedback {
      font-weight: 600;
      color: var(--color-muted);
      margin: 0;
    }

    .result {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .result h3 {
      font-size: 1.6rem;
      margin: 0;
    }

    @media (max-width: 720px) {
      .qcm-card__header {
        gap: 12px;
      }

      .global-test {
        flex-direction: column;
        align-items: flex-start;
      }

      .progress {
        flex-direction: row;
        align-items: center;
        gap: 12px;
      }

      .qcm-card__close {
        width: 100%;
        justify-content: center;
      }

      .table-card__header {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 540px) {
      .btn--wide {
        width: 100%;
      }

      .digit-grid {
        grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
      }
    }
  `]
})
export class MathComponent implements OnInit, OnDestroy {
  digits = [2, 3, 4, 5, 6, 7, 8, 9];
  selectedDigit: number | null = null;
  showTable = false;
  tableRange = Array.from({ length: 10 }, (_, i) => i + 1);

  inQcm = false;
  qcmTitle = '';
  qSet: Question[] = [];
  qIndex = 0;
  qTotal = 10;
  answered = false;
  correctCount = 0;
  isTestMode = false;
  isGlobalMode = false;
  writtenAnswer = '';
  feedbackMessage = '';
  activeProfileName = '';
  currentMode: PracticeMode | null = null;
  globalQuestionCount = 20;

  private readonly destroy$ = new Subject<void>();
  private readonly globalTablePool = [6, 7, 8, 9, 6, 7, 8, 9, 5, 4, 3, 2];
  private readonly hardMultipliers = [5, 6, 7, 8, 9];

  get currentQuestion(): Question | null {
    return this.qSet[this.qIndex] ?? null;
  }

  constructor(
    private readonly progressService: ProgressService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.progressService.activeProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        if (!profile) {
          this.router.navigate(['/']);
          return;
        }
        this.activeProfileName = profile.name;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectDigit(d: number): void {
    this.selectedDigit = d;
  }

  viewTable(): void {
    if (!this.selectedDigit) {
      return;
    }
    this.showTable = true;
    this.inQcm = false;
    this.progressService.cancelSession();
    this.currentMode = null;
  }

  closeTable(): void {
    this.showTable = false;
  }

  startTraining(): void {
    if (!this.selectedDigit) {
      return;
    }
    this.prepareQcm('training');
  }

  startTest(): void {
    if (!this.selectedDigit) {
      return;
    }
    this.prepareQcm('test');
  }

  startGlobalTest(): void {
    this.selectedDigit = null;
    this.prepareQcm('global');
  }

  prepareQcm(mode: PracticeMode): void {
    if (mode !== 'global' && !this.selectedDigit) {
      return;
    }

    this.progressService.beginSession(mode);
    this.currentMode = mode;
    this.inQcm = true;
    this.showTable = false;
    this.isGlobalMode = mode === 'global';
    this.isTestMode = mode !== 'training';
    this.qTotal = this.isGlobalMode ? this.globalQuestionCount : 10;
    this.qcmTitle = this.isGlobalMode
      ? 'Test global (20 questions)'
      : mode === 'test'
        ? 'Test (10 questions)'
        : 'Entrainement (10 questions)';

    if (this.isGlobalMode) {
      this.qSet = this.buildGlobalQuestions();
    } else {
      this.qSet = this.buildSingleTableQuestions(this.selectedDigit!, mode === 'training');
    }
    this.qTotal = this.qSet.length;

    this.qIndex = 0;
    this.answered = false;
    this.correctCount = 0;
    this.writtenAnswer = '';
    this.feedbackMessage = '';
  }

  answer(choice: number): void {
    if (this.answered || !this.currentQuestion) {
      return;
    }
    this.answered = true;

    const question = this.currentQuestion;
    const isCorrect = choice === question.answer;
    if (isCorrect) {
      this.correctCount++;
    }
    this.registerAnswer(question, isCorrect);

    setTimeout(() => {
      this.answered = false;
      this.qIndex++;
      if (this.qIndex >= this.qTotal) {
        this.finishQcm();
      }
    }, 500);
  }

  submitWrittenAnswer(): void {
    if (this.answered || !this.currentQuestion) {
      return;
    }

    const numericAnswer = Number(this.writtenAnswer);
    if (Number.isNaN(numericAnswer)) {
      this.feedbackMessage = 'Entre un nombre valide';
      return;
    }

    this.answered = true;
    const question = this.currentQuestion;
    const isCorrect = numericAnswer === question.answer;
    if (isCorrect) {
      this.correctCount++;
      this.feedbackMessage = 'Bravo ! Bonne reponse.';
    } else {
      this.feedbackMessage = `Incorrect. La bonne reponse etait ${question.answer}.`;
    }

    this.registerAnswer(question, isCorrect);

    setTimeout(() => {
      this.answered = false;
      this.feedbackMessage = '';
      this.writtenAnswer = '';
      this.qIndex++;
      if (this.qIndex >= this.qTotal) {
        this.finishQcm();
      }
    }, 1200);
  }

  choiceClass(choice: number): string {
    if (!this.answered || !this.currentQuestion) {
      return '';
    }
    return choice === this.currentQuestion.answer ? 'correct' : 'wrong';
  }

  finishQcm(): void {
    if (this.currentMode) {
      this.progressService.completeSession({ mode: this.currentMode });
    }
    this.currentMode = null;
    this.answered = false;
    this.writtenAnswer = '';
    this.feedbackMessage = '';
  }

  exitQcm(): void {
    this.progressService.cancelSession();
    this.currentMode = null;
    this.inQcm = false;
    this.showTable = false;
    this.answered = false;
    this.qSet = [];
    this.qIndex = 0;
    this.correctCount = 0;
    this.writtenAnswer = '';
    this.feedbackMessage = '';
    this.isGlobalMode = false;
    this.isTestMode = false;
  }

  private buildSingleTableQuestions(table: number, withChoices: boolean): Question[] {
    const multipliers = this.shuffle(Array.from({ length: 10 }, (_, i) => i + 1));
    return multipliers.slice(0, this.qTotal).map((multiplier) => this.createQuestion(table, multiplier, withChoices));
  }

  private buildGlobalQuestions(): Question[] {
    const questions: Question[] = [];
    const usedCombos = new Set<string>();
    let attempts = 0;
    const maxAttempts = 500;

    while (questions.length < this.globalQuestionCount && attempts < maxAttempts) {
      attempts++;
      const table = this.globalTablePool[Math.floor(Math.random() * this.globalTablePool.length)];
      const multiplier =
        table >= 6
          ? this.randomIntBetween(3, 9)
          : this.hardMultipliers[Math.floor(Math.random() * this.hardMultipliers.length)];
      const key = this.comboKey(table, multiplier);
      if (usedCombos.has(key)) {
        continue;
      }
      usedCombos.add(key);
      questions.push(this.createQuestion(table, multiplier, false));
    }

    if (questions.length < this.globalQuestionCount) {
      const allCombos = this.buildAllGlobalCombos();
      for (const combo of allCombos) {
        const key = this.comboKey(combo.table, combo.multiplier);
        if (usedCombos.has(key)) {
          continue;
        }
        usedCombos.add(key);
        questions.push(this.createQuestion(combo.table, combo.multiplier, false));
        if (questions.length >= this.globalQuestionCount) {
          break;
        }
      }
    }

    return questions;
  }

  private createQuestion(table: number, multiplier: number, withChoices: boolean): Question {
    const answer = table * multiplier;
    const flip = Math.random() < 0.5;
    const left = flip ? multiplier : table;
    const right = flip ? table : multiplier;

    let choices: number[] | undefined;
    if (withChoices) {
      const choiceSet = new Set<number>([answer]);
      while (choiceSet.size < 4) {
        const delta = this.randomIntBetween(1, 10);
        const val = answer + (Math.random() < 0.5 ? -delta : delta);
        if (val > 0) {
          choiceSet.add(val);
        }
      }
      choices = this.shuffle(Array.from(choiceSet));
    }

    return {
      prompt: `${left} x ${right} = ?`,
      answer,
      table,
      multiplier,
      choices
    };
  }

  private registerAnswer(question: Question, correct: boolean): void {
    const mode = this.currentMode ?? 'training';
    this.progressService.recordAnswer({
      table: question.table,
      multiplier: question.multiplier,
      correct,
      mode
    });
  }

  private randomIntBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private shuffle<T>(items: T[]): T[] {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private comboKey(table: number, multiplier: number): string {
    const a = Math.min(table, multiplier);
    const b = Math.max(table, multiplier);
    return `${a}x${b}`;
  }

  private buildAllGlobalCombos(): Array<{ table: number; multiplier: number }> {
    const combos: Array<{ table: number; multiplier: number }> = [];
    for (const t of [2, 3, 4, 5]) {
      for (const m of this.hardMultipliers) {
        combos.push({ table: t, multiplier: m });
      }
    }
    for (const t of [6, 7, 8, 9]) {
      for (let m = 3; m <= 9; m++) {
        combos.push({ table: t, multiplier: m });
      }
    }
    return combos;
  }
}
