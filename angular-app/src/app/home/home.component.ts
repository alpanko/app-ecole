import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <h1>app-ecole (Prototype Angular)</h1>
    <div style="display:flex;gap:12px">
      <button routerLink="/math">Mathématiques</button>
      <button (click)="alert('Allemand: à venir')">Allemand</button>
    </div>
  `
})
export class HomeComponent {}
