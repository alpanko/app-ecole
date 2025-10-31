# AGENT_STEPS — Plan fonctionnel étape par étape (version produit)

But
- Fournir un parcours fonctionnel clair et priorisé pour construire l'application "app-ecole" du point de vue utilisateur et pédagogique. Ce document décrit "quoi" construire et dans quel ordre; les détails techniques viendront après.

Prochaine étape pour l'agent
- Validez le périmètre du MVP (items listés dans "MVP"). Après validation, chaque tâche ci-dessous sera créée comme issue et on travaillera par branches courtes.

Découpage fin (tâches incrémentales testables après chaque étape)

Sprint 1 — MVP core (livrable testable après chaque micro-tâche)

T1.0 Préparation
- Créer branche: `feat/mvp-math/00-prepare`.
- Livrable testable: branche créée.

T1.1 Scaffolding minimal & page d'accueil
- Objectif: que l'application se lance et affiche une page d'accueil simple.
- Actions:
	- Créer une application minimale (ou scaffold) avec une page `/` contenant deux gros boutons: "Mathématiques" et "Allemand".
	- Rendre la page accessible via serveur de dev.
- Livrable testable: lancer le serveur dev et voir la page d'accueil (commande fournie dans la tâche technique).
	- Test manuel: démarrer le serveur, ouvrir `http://localhost:4200/` et vérifier que les deux boutons apparaissent.

T1.2 Navigation vers page Math
- Objectif: naviguer de l'accueil vers `/math`.
- Actions:
	- Ajouter route `/math` et une page placeholder "Mathématiques".
- Livrable testable: en cliquant sur "Mathématiques" on arrive sur `/math` et voit le placeholder.

T1.3 UI - Choix d'un chiffre (2..9)
- Objectif: permettre la sélection d'un chiffre pour la session.
- Actions:
	- Sur `/math`, afficher grille 2..9. Chaque case est cliquable et met à jour l'état local (session).
- Livrable testable: choisir un chiffre et afficher le chiffre sélectionné quelque part sur la page.

T1.4 Voir table complète
- Objectif: afficher la table 1..10 pour le chiffre sélectionné.
- Actions:
	- Ajouter un bouton "Voir la table" qui ouvre une vue listant `n x 1..10`.
- Livrable testable: bouton visible, clic affiche la table correctement.

T1.5 QCM d'entraînement (1 question) — pipeline minimal
- Objectif: implémenter le moteur QCM minimal pour 1 question (puis étendre à 10).
- Actions:
	- Créer un composant `QuestionCard` qui affiche une question, plusieurs choix et indique si la réponse est correcte.
	- Implémenter un générateur simple qui produit une question de multiplication pour le chiffre sélectionné.
- Livrable testable: démarrer une session d'entraînement avec 1 question; répondre et voir feedback immédiat.

T1.6 QCM d'entraînement (10 questions)
- Objectif: boucle de 10 questions avec score final.
- Actions:
	- Étendre le pipeline pour enchaîner 10 questions et afficher le score à la fin.
- Livrable testable: compléter 10 questions et voir un écran récapitulatif avec score.

T1.7 Test (10 questions aléatoires)
- Objectif: session test indépendante (questions aléatoires autour du chiffre sélectionné).
- Actions:
	- Implémenter génération aléatoire et écran de test séparé.
- Livrable testable: lancer "Test" et obtenir 10 questions différentes; terminer affiche le score.

T1.8 Sauvegarde locale (session unique)
- Objectif: enregistrer la session finale (date, type, chiffre, score) dans le stockage local.
- Actions:
	- Sauvegarder au format JSON en `localStorage`.
- Livrable testable: après une session, ouvrir l'écran "Progression" et voir la session enregistrée.

Sprint 2 — Améliorations (chaque tâche testable)

T2.1 Problèmes texte (1 problème)
- Objectif: proposer un problème textuel simple, saisir la réponse et corriger.
- Livrable testable: résoudre le problème et voir correction + explication.

T2.2 Historique / Progression
- Objectif: afficher la liste des sessions sauvegardées et un taux basique par chiffre.
- Livrable testable: écran Progression listant sessions et pourcentage de réussite par table.

T2.3 Export/Import JSON (optionnel)
- Objectif: pouvoir exporter l'historique et le réimporter sur un autre appareil.
- Livrable testable: exporter un fichier JSON et le réimporter, vérifier que les sessions apparaissent.

Sprint 3 — Allemand (démarrage par micro-tâches)

T3.1 Catalogue minimal (10 mots pour "Maison")
- Livrable testable: page vocabulaire affichant la liste de 10 images/mots.

T3.2 QCM image → mot (1 question)
- Livrable testable: lancer QCM pour 1 question d'image et obtenir feedback.

T3.3 Répéter pour 10 questions
- Livrable testable: session de 10 questions vocabulaire avec score.

Sprint 4 — i18n et histoires

T4.1 Préparer fichiers FR/DE pour les contenus dynamiques
- Livrable testable: basculer la langue dans l'UI et voir les contenus changer.

T4.2 Ajouter 3 histoires courtes + 2 questions chacune
- Livrable testable: lire histoire et répondre aux 2 questions; réponses évaluées.

Sprint 5 — UX / Accessibilité / Polish

T5.1 Polissage visuel (couleurs, taille, icônes)
- Livrable testable: interface plus lisible et adaptée tablette.

T5.2 Accessibilité basique
- Livrable testable: vérifier navigation clavier, labels et contrastes.

Processus de validation à la fin de chaque tâche
- Chaque tâche doit avoir une issue et une branche dédiée (`feat/<sprint>-<T#>`).
- Faire un petit commit, ouvrir une PR vers `main` avec la description et les étapes de test manuel.

Proposition suivante
- Je peux automatiser la création d'issues GitHub pour T1.0..T1.8 et créer la branche `feat/mvp-math/00-prepare`. Souhaitez-vous que je fasse cela maintenant ?
	- Critère: branche créée sur le repo.
- T1.2 Écran Accueil
	- Créer page avec deux gros boutons: "Mathématiques", "Allemand".
	- Critère: accessible depuis `/` et navigation vers les pages.
- T1.3 Math - Choix d'un chiffre
	- UI: grille 2..9, chaque case sélectionnable.
	- Critère: sélection enregistrée pour la session.
- T1.4 Math - Voir table complète
	- Générer affichage 1..10 pour le chiffre choisi.
	- Critère: présence d'un bouton "Voir la table" et affichage correct.
- T1.5 Math - QCM d'entraînement (10 questions)
	- Afficher une question, 3–4 choix, feedback immédiat.
	- Critère: cycle questions → réponses → score local.
- T1.6 Math - Test (10 questions aléatoires)
	- Même mécanique que T1.5 mais questions aléatoires autour du chiffre.
	- Critère: session termine avec écran récapitulatif (score, bonnes/mauvaises réponses).
- T1.7 Sauvegarde locale simple
	- Stocker chaque session (date, type, chiffre, score) dans le stockage local.
	- Critère: possibilité d'afficher l'historique des sessions.

Sprint 2 — Problèmes & Dashboard
- T2.1 Problèmes texte (Math)
	- Interface: énoncé + champ de saisie, validation de la réponse.
	- Critère: correction automatique et explication affichée.
- T2.2 Historique/Progression
	- Créer écran "Progression" listant sessions récentes et taux par chiffre.
	- Critère: afficher au moins 5 dernières sessions et pourcentages par table.
- T2.3 Simple export/import (optionnel)
	- Permettre export JSON de l'historique local.

Sprint 3 — Allemand (vocabulaire)
- T3.1 Vocabulaire - catalogue
	- Préparer 1 catégorie (ex: Maison) avec 10 mots + images.
	- Critère: assets présents et chargés depuis `assets/`.
- T3.2 Vocabulaire - apprentissage
	- Afficher image → révéler mot en allemand.
	- Critère: bouton "Montrer la réponse" et répétition.
- T3.3 Vocabulaire - QCM
	- QCM image→choix de mots (3–4 options).
	- Critère: fonctionne comme les QCM Math.

Sprint 4 — Histoires courtes + i18n
- T4.1 Histoires simples (DE)
	- Ajouter 3 histoires courtes + 2 questions de compréhension chacune.
	- Critère: lecture et réponses sauvegardées.
- T4.2 i18n content
	- Organiser tous les textes dynamiques en FR/DE via fichiers `assets/i18n/*.json`.
	- Critère: bascule langue et contenu traduit.

Sprint 5 — UX polish et accessibilité
- T5.1 Polissage visuel
	- Améliorer boutons, espaces, icônes et corrections visuelles.
	- Critère: interface adaptée tablette (taille des cibles).
- T5.2 Accessibilité
	- Vérifier contrastes, texte agrandissable et navigation clavier.
	- Critère: respect basique WCAG (contraste, labels).

Checklist PR (pour chaque feature branch)
- Créer PR vers `main` avec description des changements.
- Inclure captures d'écran ou GIFs courts montrant le flux utilisateur.
- Indiquer comment tester manuellement (étapes rapides).

Notes
- Chaque tâche T* doit être petite et testable manuellement en < 1 heure d'effort idéalement.
- Dites-moi si vous voulez que je transforme ces tâches en issues GitHub et que je crée les branches initiales.
