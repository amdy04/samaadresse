# PROJET SAMADDRESSE — PRODUCT BACKLOG & USER STORIES
**Projet de Fin d'Études (PFE) — Licence 3 Ingénierie Informatique**  
**Université Assane Seck de Ziguinchor (UASZ)** — Année Académique 2025-2026  
**Thèmes GPI associés :** Thème 4 (Méthodes Agiles : Scrum et Kanban)

---

## 1. Définition of Done (DoD) & Définition of Ready (DoR)

### Définition of Ready (DoR)
Une User Story est prête à être développée si :
1. Le persona et le bénéfice utilisateur sont clairement formulés (`En tant que... Je veux... Afin de...`).
2. Les critères d'acceptation (format Given/When/Then) sont définis.
3. Les maquettes ou endpoints nécessaires sont identifiés.
4. L'estimation en Story Points (suite de Fibonacci) est validée.

### Définition of Done (DoD)
Une User Story est considérée comme terminée si :
1. Le code source respecte les normes Clean Code et SOLID.
2. Les tests unitaires et d'intégration associés sont écrits et passent avec succès.
3. L'API est documentée sur Swagger (OpenAPI 3.0).
4. Le code est revu et fusionné sur la branche `develop`.
5. L'interface mobile-first est validée sur écran de $360\text{ px}$.

---

## 2. Epics et User Stories

### EPIC 1 : Cœur Géospatial & Adressage Numérique

#### US-1.1 : Génération automatique de code d'adresse
* **En tant que** propriétaire / résident,
* **Je veux** générer un code numérique unique à partir de ma position GPS,
* **Afin d'** obtenir une adresse simple et courte partageable avec mes contacts.
* **Critères d'acceptation :**
  * *Given* une position GPS valide capturée à Ziguinchor (ex: Lat: 12.5584, Lng: -16.2731),
  * *When* je demande la génération de mon adresse,
  * *Then* le système calcule le quartier de rattachement (`KBG`), détermine la cellule géodésique et retourne un code unique de format `ZIG-KBG-4271` en moins de 3 secondes.

#### US-1.2 : Fiche adresse enrichie
* **En tant que** propriétaire,
* **Je veux** joindre une photo de façade et une description visuelle (repères),
* **Afin d'** aider les livreurs et visiteurs à reconnaître ma porte d'entrée.

#### US-1.3 : Génération et impression du QR Code
* **En tant que** propriétaire,
* **Je veux** télécharger ou imprimer un QR code vectoriel de mon adresse,
* **Afin de** l'afficher sur le portail de ma maison ou devant mon commerce.

---

### EPIC 2 : Consultation Publique & Navigation

#### US-2.1 : Résolution d'adresse et fiche publique
* **En tant que** livreur (thiak-thiak) ou visiteur,
* **Je veux** saisir un code SamaAdresse ou scanner un QR Code,
* **Afin d'** accéder immédiatement à la fiche du lieu sans avoir besoin de créer un compte.

#### US-2.2 : Calcul d'itinéraire temps réel
* **En tant que** visiteur / coursier,
* **Je veux** calculer l'itinéraire routier entre ma position et la SamaAdresse cible,
* **Afin d'** être guidé avec le tracé sur la carte OpenStreetMap via OpenRouteService.

#### US-2.3 : Mode hors ligne (Offline PWA)
* **En tant qu'** utilisateur avec une connexion réseau instable,
* **Je veux** consulter les fiches adresses récemment ouvertes même sans connexion Internet,
* **Afin de** retrouver mon chemin même en zone blanche.

---

### EPIC 3 : Sécurité, Administration & Services à Valeur Ajoutée

#### US-3.1 : Authentification sécurisée JWT
* **En tant qu'** utilisateur,
* **Je veux** créer un compte avec mon numéro de téléphone et me connecter en toute sécurité,
* **Afin de** gérer mes adresses et modifier leurs informations.

#### US-3.2 : Modération et signalement
* **En tant qu'** administrateur,
* **Je veux** consulter la liste des adresses signalées pour coordonnées erronées ou abus,
* **Afin de** valider, corriger ou suspendre l'adresse.

#### US-3.3 : Simulation commande de plaque physique (Wave)
* **En tant que** propriétaire,
* **Je veux** commander une plaque métallique gravée avec mon code et QR Code,
* **Afin de** matérialiser mon adresse, avec paiement simulé via Wave Mobile Money sandbox.
