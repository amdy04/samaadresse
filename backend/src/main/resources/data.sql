-- Seed data : Référentiel des Quartiers de Ziguinchor pour SamaAdresse
INSERT INTO quartiers (id, code_region, trigramme, nom, centre_latitude, centre_longitude, rayon_km)
VALUES 
(1, 'ZIG', 'KBG', 'Kandialang / Boucotte Grand', 12.5584, -16.2731, 3.0),
(2, 'ZIG', 'ESC', 'Escale / Centre-ville', 12.5833, -16.2719, 2.5),
(3, 'ZIG', 'NEM', 'Néma 1 & 2', 12.5650, -16.2600, 2.5),
(4, 'ZIG', 'STB', 'Santhiaba', 12.5750, -16.2800, 2.0),
(5, 'ZIG', 'LYD', 'Lyndiane', 12.5690, -16.2950, 2.5),
(6, 'ZIG', 'DIB', 'Diabir (Campus UASZ)', 12.5450, -16.2550, 3.0),
(7, 'ZIG', 'DJB', 'Djibock', 12.5480, -16.2300, 3.5),
(8, 'ZIG', 'BLF', 'Belfort', 12.5720, -16.2650, 2.0);

-- Utilisateurs de démonstration
INSERT INTO utilisateurs (id, nom_complet, telephone, email, mot_de_passe, role, actif, date_creation)
VALUES
(1, 'Admin SamaAdresse', '+221770000001', 'admin@samaadresse.sn', '$2a$10$e8Tgzv3QdJ7W2o9B7t3Q.ex/2E5N2wK.Q2/wV2e5n2Wk.Q2wV2e5n', 'ROLE_ADMIN', true, CURRENT_TIMESTAMP),
(2, 'Amadou Diallo', '+221771234567', 'amadou.diallo@gmail.com', '$2a$10$e8Tgzv3QdJ7W2o9B7t3Q.ex/2E5N2wK.Q2/wV2e5n2Wk.Q2wV2e5n', 'ROLE_PROPRIETAIRE', true, CURRENT_TIMESTAMP);

-- Adresses pré-chargées pour la démonstration du jury
INSERT INTO adresses (code_sama_adresse, titre, description_repere, type_lieu, latitude, longitude, precision_gps_metres, nom_proprietaire_affichable, photo_facade_url, qr_code_url, statut, vues_compteur, quartier_id, utilisateur_id, date_creation)
VALUES
('ZIG-KBG-4271', 'Maison Familiale Diallo', 'Grande porte métallique verte, face école primaire Boucotte, manguier centenaire', 'DOMICILE', 12.5584, -16.2731, 3.0, 'Amadou Diallo', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://samaadresse.sn/adresses/ZIG-KBG-4271', 'ACTIVE', 42, 1, 2, CURRENT_TIMESTAMP),
('ZIG-ESC-1042', 'Pharmacie de la Paix', 'En face de la station Total Escale, enseigne lumineuse verte visible de la route principale', 'SANTE', 12.5833, -16.2719, 2.0, 'Dr. Abdoulaye Sané', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://samaadresse.sn/adresses/ZIG-ESC-1042', 'ACTIVE', 128, 2, 1, CURRENT_TIMESTAMP),
('ZIG-DIB-9031', 'Campus UASZ - UFR Sciences & Technologies', 'Bâtiment administratif UFR ST, entrée principale face au grand amphi de Diabir', 'SERVICE_PUBLIC', 12.5450, -16.2550, 2.5, 'Université Assane Seck', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://samaadresse.sn/adresses/ZIG-DIB-9031', 'ACTIVE', 356, 6, 1, CURRENT_TIMESTAMP),
('ZIG-NEM-3024', 'Quincaillerie & Boutique Al-Baraka', 'Au carrefour Néma 2, enseigne bleue, parasol Orange Money / Wave', 'COMMERCE', 12.5650, -16.2600, 3.5, 'Modou Fall', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://samaadresse.sn/adresses/ZIG-NEM-3024', 'ACTIVE', 89, 3, 2, CURRENT_TIMESTAMP);
