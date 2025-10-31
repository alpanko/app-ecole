# 🎓 Projet : Application d’étude pour enfant (Angular + future Android Tablet)

## 🌟 Objectif général

Développer une application Angular (convertible plus tard en application Android via Capacitor ou Ionic) destinée à aider un enfant à réviser différentes matières : **Mathématiques**, **Allemand**, et plus tard **Français**.

L’agent doit **concevoir et développer le projet par étapes**, en expliquant clairement chaque phase (architecture, composants, services, interfaces, logique métier, etc.).

---

## 🏰 Structure principale

L’application doit comporter une **page d’accueil principale** permettant de choisir la matière :

* **Mathématiques**
* **Allemand**
* (Français à venir)

---

## 📘 Partie 1 : Mathématiques

### 1⃣ Sections

* **Multiplications / Divisions**

  * **Sous-sections :**

    * Entraînement
    * Test

#### 🔹 Entraînement

* L’enfant choisit un **nombre (ex. 4)**.
* Il peut :

  * Voir la **table complète** (ex : 4x1 à 4x10)
  * Faire des **QCM** avec réponses multiples sur le chiffre choisi.
* Même principe pour la **division** :

  * QCM du type :

    * `4 × 5 = ?`
    * `20 ÷ 4 = ?`
    * `20 ÷ ? = 5`

#### 🔹 Test

* 10 questions aléatoires basées sur le chiffre choisi.
* Exemple :

  * Si l’enfant choisit **4**, les questions peuvent être :

    * `4 × 6 = ?`
    * `20 ÷ 4 = ?`
    * `28 ÷ ? = 7`
* Son **taux de réussite global** est enregistré et affiché à la fin.

#### 🔹 Entraînement global

* L’enfant ne choisit pas de chiffre spécifique.
* L’application pioche 20 questions couvrant les tables de **2 à 9**.
* Le taux de réussite global est enregistré et visible dans un tableau de progression.

---

### 2⃣ Section "Problèmes"

* Petits problèmes de mathématiques simples avec texte en **français et allemand**.
* Exemple :

  > Paul a 3 sacs de 4 pommes chacun. Combien de pommes a-t-il au total ?
* L’enfant doit écrire la réponse.
* Corrigé immédiat avec explication visuelle (optionnelle).

---

## 🇩🇪 Partie 2 : Allemand

### 1⃣ Section vocabulaire

* Catégories :

  * École
  * Maison
  * Cuisine
  * Transport
* Dans chaque séance :

  * Liste de **mots + images**.
  * Affichage d’une **image** → l’enfant doit donner le **nom en allemand**.
  * Exemple :

    * Image : une tasse → `die Tasse`
    * Image : une voiture → `das Auto`

### 2⃣ Section histoires simples

* Textes courts en **allemand** racontant des situations du quotidien.
* L’enfant lit le texte et répond à quelques questions de compréhension.
* Correction et score affiché à la fin.

---

## 🇫🇷 Partie 3 : Français (ajout ultérieur)

* Exercices de vocabulaire, conjugaison et lecture compréhensive.

---

## 🛠️ Exigences techniques

* **Framework :** Angular (version 17+)
* **Compatibilité future :** Ionic / Capacitor pour Android.
* **Langage :** TypeScript.
* **Architecture :**

  * Composants modulaires pour chaque matière.
  * Services partagés pour la gestion des scores et statistiques.
  * Stockage local via **IndexedDB** ou **LocalStorage**.
* **UI :** Material Design (Angular Material).
* **Internationalisation :** i18n pour support FR/DE.

---

## 🔄 Plan de développement (pour l’agent)

1. Créer le squelette Angular + routing + Material.
2. Implémenter la page d’accueil (choix de matière).
3. Créer le module **Mathématiques** avec sous-modules : multiplication, division, problèmes.
4. Créer les services de gestion de questions, réponses et statistiques.
5. Ajouter le module **Allemand** avec le vocabulaire et les histoires.
6. Implémenter la persistance locale.
7. Ajouter le tableau de bord de progression.
8. Optimiser pour tablette Android (responsive + Capacitor/Ionic).

---

## 🔗 But du prompt

Ce document doit être utilisé comme **prompt initial** à fournir à l’agent OpenAPI**, pour qu’il conçoive et développe pas à pas cette application Angular.

L’agent doit :

* Produire le code par modules.
* Donner des explications claires à chaque étape.
* Générer les composants, services, modèles et routes de manière incrémentale.
* Garantir la cohérence du projet et sa facilité d’adaptation future vers Android.

---
Voir le plan d'implémentation détaillé : `.github/AGENT_STEPS.md` (instructions pas-à-pas pour l'agent).
