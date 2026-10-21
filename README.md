# 📍 SamaAdresse — Générateur de code-adresse géolocalisé pour le Sénégal

[![Université](https://img.shields.io/badge/UASZ-Ziguinchor-green.svg)](https://uasz.sn)
[![Licence](https://img.shields.io/badge/Licence-L3%20Ing%C3%A9nierie%20Informatique-blue.svg)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io)
[![PWA](https://img.shields.io/badge/Frontend-React%20PWA-cyan.svg)](https://react.dev)
[![OpenAPI 3.0](https://img.shields.io/badge/Swagger-OpenAPI%203.0-orange.svg)](http://localhost:8080/swagger-ui.html)
[![Tests Coverage](https://img.shields.io/badge/Tests%20Coverage-%E2%89%A5%2060%25-success.svg)]()

> **Projet 12 / 14 — Brief de Projets Pédagogiques**  
> **Université Assane Seck de Ziguinchor (UASZ)** — Semestre 2 · Année 2025-2026  
> **Module associé :** Gestion de Projet Informatique (GPI) & Génie Logiciel

---

## 📖 1. Problématique Métier

À Ziguinchor comme dans la majorité des villes du Sénégal, les maisons n'ont souvent pas de numéro de rue officiel, les quartiers informels ne sont pas cartographiés, et les livraisons (thiak-thiak), interventions d'urgence (SAMU, Pompiers) ou rendez-vous reposent sur des descriptions orales imprécises (*« après la mosquée, troisième maison à gauche après le manguier »*).

**SamaAdresse** résout cette fracture en attribuant à chaque porte d'entrée un **code court unique et mémorisable** (ex : `ZIG-KBG-4271`) combiné à :
* La capture satellite des coordonnées GPS ($5\text{ m} \times 5\text{ m}$).
* Une photo de façade et des repères visuels.
* Un **QR Code** imprimable et téléchargeable.
* Un partage par SMS automatisé (SendFlash / Twilio Sandbox).
* Une **PWA fonctionnant hors ligne** (Service Worker + Cache API).
* Une **API REST publique** documentée avec Swagger/OpenAPI 3.0.
* Une option de commande de plaque physique de rue via **Wave Mobile Money** (sandbox).

---

## 🏗️ 2. Architecture & Stack Technologique

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT (PWA)                          │
│   React 18 + TypeScript + Vite + TailwindCSS + Lucide Icons │
│   Leaflet / React-Leaflet (Cartographie OpenStreetMap)      │
│   Service Worker (Workbox / Cache API) + Mode Hors Ligne    │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (JWT Stateless)
┌──────────────────────────────▼──────────────────────────────┐
│                      BACKEND API REST                       │
│   Java 17 + Spring Boot 3.2.5                               │
│   Spring Security (JWT RBAC) + Spring Data JPA              │
│   SpringDoc OpenAPI 3.0 (Swagger-UI)                        │
│   Algorithme Géodésique (Base32, Haversine, Découpage)      │
│   Générateur QR Code vectoriel ZXing                        │
│   JUnit 5 + Mockito + JaCoCo (Couverture >= 60%)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    BASE DE DONNÉES & TIERS                  │
│   H2 In-Memory (Dev/Test) / PostgreSQL (Production)         │
│   OpenRouteService (Calcul d'itinéraire routier)            │
│   SendFlash / Twilio Sandbox (Simulation SMS)               │
│   Wave Sandbox (Paiement commande de plaque)                │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ 3. Démarrage Rapide (< 5 minutes)

### Prérequis
* **Java 17** ou supérieur (`temurin-17`)
* **Maven 3.8+**
* **Node.js 18+** & `npm`

### Étape 1 : Cloner le dépôt
```bash
git clone https://github.com/votre-compte/samaadresse.git
cd samaadresse
```

### Étape 2 : Démarrer le Backend Spring Boot
```bash
cd backend
mvn clean spring-boot:run
```
* L'API démarre sur : **`http://localhost:8080`**
* La documentation Swagger UI est accessible sur : **`http://localhost:8080/swagger-ui.html`**
* La console de base de données H2 est sur : **`http://localhost:8080/h2-console`**

### Étape 3 : Démarrer la PWA Frontend
Dans un second terminal :
```bash
cd frontend
npm install
npm run dev
```
* L'application web mobile est accessible sur : **`http://localhost:3000`**

---

## 🧪 4. Exécution des Tests et Couverture ($\ge 60\%$)

Pour lancer la suite de tests automatisés (unitaires + intégration) et générer le rapport officiel JaCoCo :
```bash
cd backend
mvn clean verify
```
Le rapport de couverture est généré à : `backend/target/site/jacoco/index.html`.

---

## 📡 5. Documentation de l'API REST (OpenAPI 3.0)

| Méthode | Endpoint | Rôle | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/auth/register` | Public | Inscription d'un propriétaire |
| `POST` | `/api/v1/auth/login` | Public | Authentification et obtention du token JWT |
| `GET` | `/api/v1/public/resolve/{code}` | Public | Résoudre un code SamaAdresse (GPS, photo, repères) |
| `GET` | `/api/v1/public/search` | Public | Rechercher dans l'annuaire public |
| `GET` | `/api/v1/public/itineraire` | Public | Calculer l'itinéraire routier vers l'adresse |
| `POST` | `/api/v1/public/share/sms` | Public | Envoyer un SMS de partage (SendFlash/Twilio) |
| `POST` | `/api/v1/adresses` | Propriétaire | Créer une adresse via GPS |
| `GET` | `/api/v1/adresses/mes-adresses`| Propriétaire | Lister ses adresses créées |
| `POST` | `/api/v1/adresses/commande-plaque` | Propriétaire | Commander une plaque physique (Wave Sandbox) |
| `GET` | `/api/v1/admin/stats` | Admin | Tableau de bord et statistiques |

---

## 📂 6. Structure du Projet et Documents GPI

Tous les dossiers de méthodologie et de gestion de projet (conformes au cours de GPI de l'UASZ) sont classés dans `docs/` :
* [01_charte_projet.md](file:///Users/amdymoustapha/.gemini/antigravity/scratch/samaadresse/docs/01_charte_projet.md) : Charte, Matrice des parties prenantes, Objectifs QCD.
* [02_cahier_des_charges.md](file:///Users/amdymoustapha/.gemini/antigravity/scratch/samaadresse/docs/02_cahier_des_charges.md) : Spécifications fonctionnelles et techniques.
* [03_backlog_user_stories.md](file:///Users/amdymoustapha/.gemini/antigravity/scratch/samaadresse/docs/03_backlog_user_stories.md) : Epics, User Stories, DoD et DoR (Scrum).
* [04_plan_de_tests.md](file:///Users/amdymoustapha/.gemini/antigravity/scratch/samaadresse/docs/04_plan_de_tests.md) : Stratégie de tests, matrice et couverture $\ge 60\%$.
