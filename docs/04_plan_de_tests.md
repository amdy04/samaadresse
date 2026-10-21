# PROJET SAMADDRESSE — PLAN D'ASSURANCE QUALITÉ ET DE TESTS
**Projet de Fin d'Études (PFE) — Licence 3 Ingénierie Informatique**  
**Université Assane Seck de Ziguinchor (UASZ)** — Année Académique 2025-2026  
**Thèmes GPI associés :** Thème 10 (Qualité et Tests dans les Projets IT)

---

## 1. Stratégie de Test et Objectif de Couverture

* **Objectif imposé par l'UASZ :** $\ge 60\%$ de couverture de code par les tests.
* **Outils d'assurance qualité :**
  * **JUnit 5 & Mockito** : Tests unitaires de la logique métier (Services, algorithme géospatial).
  * **Spring Boot Test & MockMvc** : Tests d'intégration des contrôleurs REST et de la sécurité JWT.
  * **H2 in-memory Database** : Isolation des tests sans dépendance externe à un serveur PostgreSQL.
  * **JaCoCo (Java Code Coverage)** : Génération du rapport officiel de couverture de code (HTML / XML).

---

## 2. Matrice des Cas de Tests Critiques

| Réf. Test | Type | Composant testé | Scénario & Données | Résultat attendu |
| :--- | :--- | :--- | :--- | :--- |
| **TU-GEO-01** | Unitaire | `GeoGridService` | Coordonnées GPS dans le quartier Boucotte (12.5584, -16.2731) | Retourne un code préfixé par `ZIG-KBG-` de longueur 12 caractères |
| **TU-GEO-02** | Unitaire | `GeoGridService` | Coordonnées identiques appelées deux fois | Déterminisme : même code généré |
| **TU-QR-01** | Unitaire | `QrCodeService` | Génération pour l'URL `https://samaadresse.sn/adresses/ZIG-KBG-4271` | Image PNG valide au format Base64 |
| **TI-AUTH-01** | Intégration | `AuthController` | Inscription avec téléphone sénégalais (+221770000000) et mot de passe fort | Code HTTP 201 Created + Token JWT retourné |
| **TI-AUTH-02** | Intégration | `AuthController` | Connexion avec mot de passe incorrect | Code HTTP 401 Unauthorized |
| **TI-ADR-01** | Intégration | `AdresseController` | Création d'adresse par utilisateur authentifié | Code HTTP 201 Created + code géolocalisé persistant |
| **TI-PUB-01** | Intégration | `PublicApiController` | Résolution de code existant sans token JWT | Code HTTP 200 OK + données publiques complètes |
| **TI-PUB-02** | Intégration | `PublicApiController` | Résolution de code inexistant (`ZIG-XXX-0000`) | Code HTTP 404 Not Found avec message explicite |
| **TU-SMS-01** | Unitaire | `SmsService` | Simulation d'envoi de SMS de partage | Traçabilité de l'envoi et log du lien de consultation |

---

## 3. Critères d'Acceptation de la Qualité Logicielle
1. **Zéro régression** lors des fusions sur la branche `develop`.
2. **Temps d'exécution des tests** inférieur à 30 secondes pour le pipeline CI/CD.
3. **Rapport JaCoCo** produit automatiquement lors du `mvn clean verify` et consultable dans `target/site/jacoco/index.html`.
