import { Component } from '@angular/core';

type Question = { prompt: string; answer: number; choices: number[] };

@Component({
  selector: 'app-math',
  template: `
    <h2>Mathématiques</h2>
    <p><a routerLink="/">← Retour</a></p>

    <section class="select">
      <h3>Choisis un chiffre</h3>
      <div class="grid">
        <button *ngFor="let d of digits" (click)="selectDigit(d)" [class.active]="selectedDigit===d">{{d}}</button>
      </div>
      <div class="selected">{{ selectedDigit ? ('Chiffre sélectionné: ' + selectedDigit) : 'Aucun chiffre sélectionné' }}</div>
      <div class="actions">
        <button (click)="viewTable()" [disabled]="!selectedDigit">Voir la table</button>
        <button (click)="startTraining()" [disabled]="!selectedDigit">Entraînement (QCM)</button>
        <button (click)="startTest()" [disabled]="!selectedDigit">Test (10 questions)</button>
      </div>
    </section>

    <section *ngIf="showTable" class="table-view">
      <h3>Table de {{selectedDigit}}</h3>
      <ul>
        <li *ngFor="let i of tableRange">{{selectedDigit}} × {{i}} = {{selectedDigit * i}}</li>
      </ul>
      <button (click)="closeTable()">Fermer</button>
    </section>

    <section *ngIf="inQcm" class="qcm">
      <h3>{{ qcmTitle }}</h3>
      <div *ngIf="currentQuestion">
        <div class="prompt">{{ currentQuestion.prompt }}</div>
        <div class="choices">
          <button *ngFor="let c of currentQuestion.choices" (click)="answer(c)" [disabled]="answered" [ngClass]="choiceClass(c)">{{c}}</button>
        </div>
      </div>
      <div *ngIf="!currentQuestion">Terminé — score: {{correctCount}} / {{qTotal}}</div>
      <div class="controls" *ngIf="currentQuestion">
        <small>Question {{qIndex+1}} / {{qTotal}}</small>
      </div>
    </section>

    <style>
      .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}
      .grid button{padding:12px;border-radius:6px}
      .grid button.active{background:#1976d2;color:white}
      .actions{display:flex;gap:8px;margin-top:8px}
      .table-view ul{list-style:none;padding:0}
      .qcm .choices{display:flex;flex-direction:column;gap:8px;margin-top:12px}
      .qcm button.correct{background:#e6f4ea}
      .qcm button.wrong{background:#fdecea}
    </style>
  `
})
export class MathComponent {
  digits = [2,3,4,5,6,7,8,9];
  selectedDigit: number | null = null;
  showTable = false;
  tableRange = Array.from({length:10},(_,i)=>i+1);

  // QCM state
  inQcm = false;
  qcmTitle = '';
  qSet: Question[] = [];
  qIndex = 0;
  qTotal = 10;
  answered = false;
  correctCount = 0;

  get currentQuestion(): Question | null {
    return this.qSet[this.qIndex] ?? null;
  }

  selectDigit(d: number){ this.selectedDigit = d; }

  viewTable(){ if(!this.selectedDigit) return; this.showTable = true; }
  closeTable(){ this.showTable = false; }

  startTraining(){ if(!this.selectedDigit) return; this.prepareQcm(false); }
  startTest(){ if(!this.selectedDigit) return; this.prepareQcm(true); }

  prepareQcm(isTest: boolean){
    this.inQcm = true; this.qcmTitle = isTest? 'Test (10 questions)' : 'Entraînement (10 questions)';
    this.qSet = [];
    for(let i=0;i<this.qTotal;i++) this.qSet.push(this.genMulQuestion(this.selectedDigit!));
    this.qIndex = 0; this.answered = false; this.correctCount = 0;
  }

  genMulQuestion(n: number): Question {
    const a = n;
    const b = Math.floor(Math.random()*10)+1;
    const answer = a*b;
    const choices = new Set<number>([answer]);
    while(choices.size<4){
      const delta = Math.floor(Math.random()*10)+1;
      const val = answer + (Math.random()<0.5 ? delta : -delta);
      if(val>0) choices.add(val);
    }
    const shuffled = Array.from(choices).sort(()=>Math.random()-0.5);
    return { prompt: `${a} × ${b} = ?`, answer, choices: shuffled };
  }

  answer(choice: number){
    if(this.answered) return;
    this.answered = true;
    const q = this.currentQuestion!;
    if(choice === q.answer) this.correctCount++;
    // mark visually by leaving answered true and advancing after short delay
    setTimeout(()=>{
      this.answered = false;
      this.qIndex++;
      if(this.qIndex>=this.qTotal){ this.finishQcm(); }
    }, 500);
  }

  choiceClass(c: number){
    if(!this.answered) return '';
    const q = this.currentQuestion!;
    if(c===q.answer) return 'correct';
    return 'wrong';
  }

  finishQcm(){ this.inQcm = true; /* currentQuestion getter returns null */ }
}

