-- =====================================================
-- SCRIPT DE MIGRATION DES DONNÉES
-- MySQL vers Supabase (PostgreSQL)
-- =====================================================
--
-- INSTRUCTIONS :
-- 1. Exportez vos données MySQL au format CSV ou SQL
-- 2. Adaptez ce script selon vos données réelles
-- 3. Exécutez dans Supabase SQL Editor
-- =====================================================

-- =====================================================
-- MIGRATION DES UTILISATEURS
-- =====================================================
-- Si vous avez des utilisateurs existants dans MySQL,
-- exportez-les et insérez-les ici
--
-- Format d'insertion :
INSERT INTO
    users (
        email,
        password_hash,
        full_name,
        role,
        is_active,
        created_at,
        updated_at,
        last_login
    )
VALUES
    -- Exemple (remplacez par vos vraies données)
    -- ('email1@example.com', 'hash_bcrypt', 'Nom Complet', 'admin', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00', NULL),
    -- ('email2@example.com', 'hash_bcrypt', 'Nom Complet 2', 'editor', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00', NULL)
    ON CONFLICT (email) DO
UPDATE
SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- =====================================================
-- MIGRATION DES FORMATEURS
-- =====================================================
-- Exportez depuis MySQL :
-- SELECT * FROM trainers;
--
-- Puis insérez dans PostgreSQL :
INSERT INTO
    trainers (
        name,
        title,
        bio,
        bio_extended,
        image_url,
        image_base64,
        email,
        phone,
        is_active,
        display_order,
        created_by,
        created_at,
        updated_at
    )
VALUES
    -- Exemple (remplacez par vos vraies données)
    -- ('Nom Formateur', 'Titre', 'Bio courte', 'Bio étendue', 'url_image', 'base64_data', 'email@example.com', '+243 XXX XXX XXX', TRUE, 1, 1, '2024-01-01 00:00:00', '2024-01-01 00:00:00')
    ON CONFLICT DO NOTHING;
-- Si vous avez une contrainte unique

-- =====================================================
-- MIGRATION DES EXPÉRIENCES DES FORMATEURS
-- =====================================================
INSERT INTO
    trainer_experiences (
        trainer_id,
        year,
        title,
        description,
        display_order,
        created_at
    )
VALUES
    -- Exemple
    -- (1, '2020-2024', 'Développeur Full Stack', 'Description de l''expérience', 1, '2024-01-01 00:00:00')
    ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION DES COMPÉTENCES DES FORMATEURS
-- =====================================================
INSERT INTO
    trainer_skills (
        trainer_id,
        skill_name,
        skill_level,
        display_order,
        created_at
    )
VALUES
    -- Exemple
    -- (1, 'JavaScript', 95, 1, '2024-01-01 00:00:00'),
    -- (1, 'React', 90, 2, '2024-01-01 00:00:00')
    ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION DES TECHNOLOGIES DES FORMATEURS
-- =====================================================
INSERT INTO
    trainer_technologies (
        trainer_id,
        technology_name,
        display_order,
        created_at
    )
VALUES
    -- Exemple
    -- (1, 'React', 1, '2024-01-01 00:00:00'),
    -- (1, 'Node.js', 2, '2024-01-01 00:00:00')
    ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION DES SERVICES
-- =====================================================
-- Note: Les colonnes JSON dans MySQL doivent être converties en JSONB pour PostgreSQL
INSERT INTO
    services (
        title,
        description,
        icon_name,
        features,
        technologies,
        is_active,
        display_order,
        created_at,
        updated_at
    )
VALUES
    -- Exemple
    -- (
    --     'Titre Service',
    --     'Description du service',
    --     'IconName',
    --     '["Feature 1", "Feature 2"]'::jsonb,
    --     '["Tech 1", "Tech 2"]'::jsonb,
    --     TRUE,
    --     1,
    --     '2024-01-01 00:00:00',
    --     '2024-01-01 00:00:00'
    -- )
    ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION DES PROJETS PORTFOLIO
-- =====================================================
INSERT INTO
    portfolio_projects (
        title,
        description,
        image_url,
        image_base64,
        technologies,
        project_url,
        github_url,
        category,
        is_featured,
        is_active,
        display_order,
        created_at,
        updated_at
    )
VALUES
    -- Exemple
    -- (
    --     'Titre Projet',
    --     'Description du projet',
    --     'url_image',
    --     'base64_data',
    --     '["React", "Node.js"]'::jsonb,
    --     'https://project-url.com',
    --     'https://github.com/user/repo',
    --     'Web',
    --     TRUE,
    --     TRUE,
    --     1,
    --     '2024-01-01 00:00:00',
    --     '2024-01-01 00:00:00'
    -- )
    ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION DES MESSAGES DE CONTACT
-- =====================================================
INSERT INTO
    contact_messages (
        name,
        email,
        message,
        subject,
        phone,
        is_read,
        read_at,
        read_by,
        created_at
    )
VALUES
    -- Exemple
    -- ('Nom Client', 'client@example.com', 'Message du client', 'Sujet', '+243 XXX XXX XXX', FALSE, NULL, NULL, '2024-01-01 00:00:00')
    ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION DES PARAMÈTRES DU SITE
-- =====================================================
-- Les paramètres par défaut sont déjà insérés dans le script principal
-- Ajoutez ici vos paramètres personnalisés si nécessaire
INSERT INTO
    site_settings (
        setting_key,
        setting_value,
        setting_type,
        description
    )
VALUES
    -- Exemple
    -- ('custom_setting', 'Valeur personnalisée', 'text', 'Description')
    ON CONFLICT (setting_key) DO
UPDATE
SET
    setting_value = EXCLUDED.setting_value;

-- =====================================================
-- MIGRATION DES PROGRAMMES DE FORMATION
-- =====================================================
INSERT INTO
    training_programs (
        trainer_id,
        title,
        description,
        duration,
        price,
        icon_name,
        is_active,
        display_order,
        created_at,
        updated_at
    )
VALUES
    -- Exemple
    -- (1, 'Formation React', 'Description de la formation', '40 heures', 500.00, 'GraduationCap', TRUE, 1, '2024-01-01 00:00:00', '2024-01-01 00:00:00')
    ON CONFLICT DO NOTHING;

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================
--
-- 1. DATES :
--    - MySQL : '2024-01-01 00:00:00'
--    - PostgreSQL : '2024-01-01 00:00:00' (même format, mais utilise TIMESTAMPTZ)
--
-- 2. JSON :
--    - MySQL : JSON (peut être exporté comme texte)
--    - PostgreSQL : JSONB (convertir avec ::jsonb)
--    - Exemple : '["item1", "item2"]'::jsonb
--
-- 3. BOOLEAN :
--    - MySQL : TRUE/FALSE ou 1/0
--    - PostgreSQL : TRUE/FALSE (même chose)
--
-- 4. AUTO_INCREMENT :
--    - MySQL : AUTO_INCREMENT
--    - PostgreSQL : GENERATED BY DEFAULT AS IDENTITY
--    - Les IDs seront générés automatiquement
--
-- 5. ENUM :
--    - MySQL : ENUM('value1', 'value2')
--    - PostgreSQL : TYPE ENUM créé séparément
--
-- 6. LONGTEXT :
--    - MySQL : LONGTEXT
--    - PostgreSQL : TEXT (même chose, pas de limite pratique)