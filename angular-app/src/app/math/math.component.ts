import { Component } from '@angular/core';

@Component({
  selector: 'app-math',
  template: `
    <h2>Mathématiques</h2>
    <p>Prototype: choisissez un chiffre dans la grille (2..9) et utilisez la vue prototype pour tester.</p>
    <p><a routerLink="/">← Retour</a></p>
  `
})
export class MathComponent {}
