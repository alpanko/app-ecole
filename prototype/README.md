# Prototype — app-ecole (MVP)

But
- Fournir un prototype léger, testable dans le navigateur, qui couvre les livrables T1.1→T1.6 :
  - Page d'accueil
  - Navigation vers Math
  - Choix d'un chiffre (2..9)
  - Voir la table complète
  - QCM d'entraînement et Test (10 questions)

Comment tester
1. Ouvrez `prototype/index.html` dans le navigateur (double-clic) ou lancez un serveur statique :

```powershell
cd prototype
npx http-server -p 4200
# puis ouvrir http://localhost:4200
```

2. Sur la page d'accueil cliquez sur "Mathématiques".
3. Sélectionnez un chiffre, puis cliquez sur "Voir la table" ou "Entraînement" / "Test".

Remarques
- Prototype en vanilla JS pour aller vite et tester le flux utilisateur de manière incrémentale.
- Après validation, on transformera ce prototype en application Angular conforme au plan.
