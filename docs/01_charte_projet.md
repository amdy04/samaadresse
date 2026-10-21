# PROJET SAMADDRESSE — CHARTE DE PROJET
**Projet de Fin d'Études (PFE) — Licence 3 Ingénierie Informatique**  
**Université Assane Seck de Ziguinchor (UASZ)** — Année Académique 2025-2026  
**Thèmes GPI associés :** Thème 1 (Fondements) & Thème 2 (Cadrage et Initialisation)

---

## 1. Contexte et Justification
Dans la commune de Ziguinchor et dans les villes secondaires du Sénégal, le repérage urbain reste informel :
* Absence de numérotation standardisée des habitations et commerces.
* Difficulté majeure pour les services de secours (SAMU, Sapeurs-Pompiers) à intervenir rapidement.
* Retards et surcoûts logistiques pour les livreurs (thiak-thiak), le commerce en ligne et les services postaux.
* Exclusion administrative de nombreux citoyens incapables de fournir un justificatif de domicile précis.

**SamaAdresse** (« Mon Adresse » en wolof) apporte une réponse numérique souveraine, mobile et résiliente en attribuant à chaque porte d'entrée un code géographique court, mémorisable, partageable et vérifiable.

---

## 2. Objectifs du Projet (Triangle QCD)

### Qualité (Q)
* Générer des codes courts de format standardisé (ex: `ZIG-KBG-4271`) avec une précision spatiale de $5\text{ m}$.
* Disponibilité hors ligne (PWA installable avec Service Worker et cache local).
* 100 % des endpoints documentés selon le standard OpenAPI 3.0 / Swagger.
* Taux de couverture de tests supérieur ou égal à 60 %.

### Coût (C)
* Coût de développement et d'hébergement : **0 FCFA** (exploitation exclusive de solutions Open Source et de tiers gratuits : OpenStreetMap, Render, Railway, Vercel).
* Modèle économique futur : vente de plaques de rue émaillées personnalisées via Mobile Money (Wave sandbox).

### Délai (D)
* Durée totale : 6 semaines découpées en 3 Sprints Scrum de 2 semaines chacun.
* Soutenance finale : Présentation orale de 10 minutes (5 min démo live + 5 min questions).

---

## 3. Matrice des Parties Prenantes (Pouvoir / Intérêt)

| Partie Prenante | Rôle | Pouvoir | Intérêt | Stratégie d'engagement |
| :--- | :--- | :---: | :---: | :--- |
| **Jury & Enseignants UASZ** | Évaluateurs académiques | Élevé | Élevé | Respecter scrupuleusement les contraintes techniques du brief |
| **Citoyens / Propriétaires** | Utilisateurs cibles (création d'adresse) | Moyen | Élevé | Interface simple en wolof/français, zéro friction, PWA légère |
| **Livreurs & Secours** | Utilisateurs opérationnels (recherche d'adresse) | Moyen | Élevé | Résolution instantanée du code et itinéraire précis |
| **Services Municipaux** | Autorités urbaines | Élevé | Moyen | Annuaire public et export des données pour l'urbanisme |

---

## 4. Périmètre du Projet (In-Scope / Out-of-Scope)

### Dans le périmètre (In-Scope)
* Algorithme autonome de découpage géographique et calcul de code géodésique.
* Générateur et lecteur de QR Code pour impression et affichage physique.
* Partage multi-canal (SMS via SendFlash/Twilio Sandbox, lien direct, QR Code).
* Fiche adresse publique avec cartographie Leaflet et calcul d'itinéraire OpenRouteService.
* Espace propriétaire sécurisé (JWT) et tableau de bord administration.
* Mode hors ligne PWA (Service Worker) pour consultation d'adresses sans Internet.
* API REST publique documentée avec Swagger.

### Hors périmètre (Out-of-Scope pour la V1)
* Déploiement matériel de capteurs IoT.
* Paiement réel en production (simulation stricte via Wave Sandbox).

---

## 5. Facteurs Clés de Succès (FCS)
1. **Démonstration live sans accroc** lors des 5 minutes de la soutenance (capture GPS -> code -> QR code -> itinéraire).
2. **Fonctionnement hors ligne prouvé** en coupant le Wi-Fi / 4G sur smartphone.
3. **Qualité de code irréprochable** (Clean Code, architecture en couches, tests automatisés $\ge 60\%$).
