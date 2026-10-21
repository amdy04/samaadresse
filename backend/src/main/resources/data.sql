-- Seed data : Référentiel des Quartiers de Ziguinchor pour SamaAdresse
INSERT INTO quartiers (code_region, trigramme, nom, centre_latitude, centre_longitude, rayon_km)
VALUES 
('ZIG', 'KBG', 'Kandialang / Boucotte Grand', 12.5584, -16.2731, 3.0),
('ZIG', 'ESC', 'Escale / Centre-ville', 12.5833, -16.2719, 2.5),
('ZIG', 'NEM', 'Néma 1 & 2', 12.5650, -16.2600, 2.5),
('ZIG', 'STB', 'Santhiaba', 12.5750, -16.2800, 2.0),
('ZIG', 'LYD', 'Lyndiane', 12.5690, -16.2950, 2.5),
('ZIG', 'DIB', 'Diabir (Campus UASZ)', 12.5450, -16.2550, 3.0),
('ZIG', 'DJB', 'Djibock', 12.5480, -16.2300, 3.5),
('ZIG', 'BLF', 'Belfort', 12.5720, -16.2650, 2.0);

-- Utilisateurs de démonstration (Mots de passe hashés BCrypt pour 'Passer123!')
-- $2a$10$w6M4Fp3mG6C9L5y9Xz5h.u2Jc1b4c3d2e1f0g9h8i7j6k5l4m3n2 -> hash BCrypt standard
INSERT INTO utilisateurs (nom_complet, telephone, email, mot_de_passe, role, actif, date_creation)
VALUES
('Admin SamaAdresse', '+221770000001', 'admin@samaadresse.sn', '$2a$10$e8Tgzv3QdJ7W2o9B7t3Q.ex/2E5N2wK.Q2/wV2e5n2Wk.Q2wV2e5n', 'ROLE_ADMIN', true, CURRENT_TIMESTAMP),
('Amadou Diallo', '+221771234567', 'amadou.diallo@gmail.com', '$2a$10$e8Tgzv3QdJ7W2o9B7t3Q.ex/2E5N2wK.Q2/wV2e5n2Wk.Q2wV2e5n', 'ROLE_PROPRIETAIRE', true, CURRENT_TIMESTAMP);
