# AGENT_STEPS — Plan fonctionnel étape par étape (version produit)

But
- Fournir un parcours fonctionnel clair et priorisé pour construire l'application "app-ecole" du point de vue utilisateur et pédagogique. Ce document décrit "quoi" construire et dans quel ordre; les détails techniques viendront après.

MVP (priorité 1)
- Page d'accueil : choix de la matière (Mathématiques / Allemand).
- Mathématiques — Entraînement par table : choisir un chiffre (2–9), afficher la table complète et proposer des QCM simples.
- Mathématiques — Test rapide : session de 10 questions sur le chiffre choisi, score et feedback immédiat.
- Sauvegarde locale du score (pour affichage du taux de réussite simple).

Étape 1 — Définir les parcours utilisateur
1.1. Accueil
 - L'enfant choisit une matière. Interface simple, grandes cibles tactiles.
1.2. Entraînement (Math)
 - Sélection d'un chiffre (2–9).
 - Option : voir la table complète (ex. 4×1..4×10).
 - Option : lancer une série de QCM (nombre configurable, p.ex. 10).
1.3. Test (Math)
 - 10 questions générées aléatoirement basées sur le chiffre choisi.
 - À la fin, afficher score (ex. 7/10) et explication courte pour chaque erreur.
1.4. Problèmes (Math)
 - Petits problèmes textuels (FR/DE) où l'enfant écrit la réponse.
 - Correction et affichage d'une explication simple.

Étape 2 — Expérience Allemand (phase 1)
2.1. Vocabulaire
 - Catégories : École, Maison, Cuisine, Transport.
 - Pour chaque mot : image + mot en allemand (article + nom). Interface d'apprentissage et QCM d'identification d'image.
2.2. Histoires courtes
 - Textes courts avec 2–3 questions de compréhension.

Étape 3 — Progression et suivi
3.1. Sauvegarde des sessions
 - Enregistrer date, matière, type d'exercice, score.
3.2. Tableau de progression
 - Vue simple montrant taux de réussite par table (ex. Table de 4 : 85%).
 - Historique récent et meilleur score.

Étape 4 — Améliorations UX (après MVP)
- Ajouter corrections visuelles (animations, icônes de réussite/erreur).
- Mode enfant : police plus grande, couleurs, sons (optionnels).
- Accessibilité : navigation clavier, contrastes.

Étape 5 — Contenu et i18n
- Préparer tout le contenu textuel en FR/DE dès le départ : questions, énoncés de problèmes, labels UI.
- Stocker les packs de contenus (vocabulaire, problèmes) séparément pour faciliter ajout ultérieur.

Étape 6 — Tableaux de bord et insights pédagogiques
- Afficher par élève (ou appareil) : progression par table, taux moyen, tables les plus faibles.
- Indicateurs simples : temps moyen par question, questions les plus souvent ratées.

Livrables par jalon (sprint) — proposition
- Sprint 1 (MVP core, 1–2 semaines) : Accueil, Entraînement Math (voir table + QCM), Test Math 10 questions, sauvegarde locale des scores.
- Sprint 2 (1 semaine) : Problèmes texte + corrections, premier tableau de progression basique.
- Sprint 3 (1–2 semaines) : Allemand vocabulaire (images + QCM) et histoires simples.
- Sprint 4 (1 semaine) : UX polish, animations, accessibilité, réglages i18n.

Critères d'acceptation (exemples)
- Une session Test Math renvoie un score et conserve l'historique localement.
- Un QCM présente 1 question à la fois, accepte 1 réponse, et indique correction immédiate.
- Le tableau de progression liste au moins les 5 dernières sessions et calcule un pourcentage de réussite.

Risques et décisions à prendre
- Mode de stockage initial : local (localStorage) vs IndexedDB (pour scale/complexité). Choix à faire au moment du développement.
- Prioriser accessibilité et écran tablette dès le début si l'app cible tablettes Android.

Prochaine étape pour l'agent
- Confirmez le périmètre du MVP (les items listés dans "MVP" ci-dessus). Une fois validé, je traduis chaque étape fonctionnelle en tâches techniques et je peux scaffolder le squelette initial.

---
Donnez-moi vos retours : voulez-vous réduire ou étendre le MVP ? Souhaitez-vous que l'on commence par Math uniquement (phase 1) ou lancer Math+Allemand dès le premier sprint ?

---
Tâches découpées (version actionnable)

Sprint 1 — MVP core (Entraînement + Test Math)
- T1.1 Créer la branche `feat/mvp-math`.
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
