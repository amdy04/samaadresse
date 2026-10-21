# PROJET SAMADDRESSE — CAHIER DES CHARGES FONCTIONNEL ET TECHNIQUE
**Projet de Fin d'Études (PFE) — Licence 3 Ingénierie Informatique**  
**Université Assane Seck de Ziguinchor (UASZ)** — Année Académique 2025-2026  
**Thèmes GPI associés :** Thème 2 (Cadrage et Recueil des exigences)

---

## 1. Exigences Fonctionnelles Minimales (EF)

* **EF-01 : Capture GPS et Génération de code**
  * L'application doit pouvoir capturer automatiquement les coordonnées GPS de l'appareil (avec précision en mètres) ou permettre une saisie/ajustement sur carte.
  * L'algorithme doit générer un code unique court au format `REG-QUA-CELL` (ex : `ZIG-KBG-4271`).

* **EF-02 : Fiche Adresse et Médias**
  * Association d'une photo de la façade du bâtiment (téléversement ou prise de vue directe).
  * Description textuelle précise avec points de repère visuels.
  * Typologie du lieu : Domicile, Commerce, Institution/Service public, Santé, Culte.

* **EF-03 : Générateur de QR Code**
  * Génération automatique à la création d'un QR code vectoriel redirigeant vers l'URL publique de la fiche adresse.
  * Possibilité de télécharger ou d'imprimer directement le QR code (format affiche / plaque).

* **EF-04 : Partage Multi-canal**
  * Copie en un clic du code court et du lien web.
  * Déclenchement d'un SMS automatique pré-rempli (via API SendFlash / Twilio Sandbox) vers le destinataire.

* **EF-05 : Fiche Adresse Publique & Itinéraire**
  * Fiche accessible sans obligation de connexion.
  * Carte interactive Leaflet OpenStreetMap centrée sur l'adresse.
  * Bouton "Itinéraire" calculant le tracé depuis la position GPS actuelle jusqu'à la destination via OpenRouteService.

* **EF-06 : Annuaire et Moteur de Recherche**
  * Recherche par code SamaAdresse exact (`ZIG-KBG-4271`).
  * Recherche par quartier (ex: Boucotte, Kandialang, Escale).
  * Recherche par nom du titulaire ou type de lieu.

* **EF-07 : Mode Hors Ligne (PWA)**
  * Une adresse consultée au moins une fois doit être mise en cache dans le navigateur (Cache API & IndexedDB) et demeurer visible même en mode avion / absence de réseau.

* **EF-08 : API REST Publique de Résolution**
  * Endpoint public `GET /api/v1/public/resolve/{code}` renvoyant la latitude, longitude, nom, quartier et photo.
  * Documentation interactive Swagger / OpenAPI 3.0.

* **EF-09 : Commande de Plaque Physique (Option Premium)**
  * Simulation de commande d'une plaque gravée pour sa porte.
  * Paiement simulé via Wave Mobile Money (Sandbox).

---

## 2. Exigences Non Fonctionnelles (ENF)

* **ENF-01 : Performance** : Génération du code d'adresse en moins de 3 secondes sans connexion réseau stable.
* **ENF-02 : Ergonomie & Responsive** : Interface mobile-first utilisable sur écran de largeur $\ge 360\text{ px}$ sans aucun ascenseur horizontal.
* **ENF-03 : Sécurité** : Chiffrement des mots de passe (BCrypt), tokens JWT stateless avec expiration, rôles RBAC stricts (`ROLE_PUBLIC`, `ROLE_PROPRIETAIRE`, `ROLE_ADMIN`).
* **ENF-04 : Testabilité** : Couverture de tests unitaires et d'intégration $\ge 60\%$.
* **ENF-05 : Déployabilité** : Déploiement cloud continu sur offre gratuite (Render/Railway pour le backend, Vercel pour le frontend).
