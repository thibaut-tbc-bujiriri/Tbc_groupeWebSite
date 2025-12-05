-- =====================================================
-- Base de données Tbc Groupe - Version phpMyAdmin
-- MySQL Database Schema
-- Version: 1.0 - Compatible phpMyAdmin
-- Date: 2024
-- =====================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS tbc_groupe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tbc_groupe;

-- =====================================================
-- Table: users (Utilisateurs/Administrateurs)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'editor',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: trainers (Formateurs)
-- =====================================================
CREATE TABLE IF NOT EXISTS trainers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    bio_extended TEXT,
    image_url VARCHAR(500),
    image_base64 LONGTEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: trainer_experiences (Expériences des formateurs)
-- =====================================================
CREATE TABLE IF NOT EXISTS trainer_experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trainer_id INT NOT NULL,
    year VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers (id) ON DELETE CASCADE,
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_display_order (display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: trainer_skills (Compétences des formateurs)
-- =====================================================
CREATE TABLE IF NOT EXISTS trainer_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trainer_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    skill_level INT NOT NULL CHECK (
        skill_level >= 0
        AND skill_level <= 100
    ),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers (id) ON DELETE CASCADE,
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_display_order (display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: trainer_technologies (Technologies maîtrisées)
-- =====================================================
CREATE TABLE IF NOT EXISTS trainer_technologies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trainer_id INT NOT NULL,
    technology_name VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers (id) ON DELETE CASCADE,
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_display_order (display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: services (Services de l'entreprise)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(100),
    features JSON,
    technologies JSON,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: portfolio_projects (Projets du portfolio)
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    image_base64 LONGTEXT,
    technologies JSON,
    project_url VARCHAR(500),
    github_url VARCHAR(500),
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_category (category),
    INDEX idx_display_order (display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: contact_messages (Messages de contact)
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    subject VARCHAR(255),
    phone VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    read_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (read_by) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: site_settings (Paramètres du site)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'text',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- Table: training_programs (Programmes de formation)
-- =====================================================
CREATE TABLE IF NOT EXISTS training_programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trainer_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(100),
    price DECIMAL(10, 2),
    icon_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers (id) ON DELETE SET NULL,
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_is_active (is_active),
    INDEX idx_display_order (display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- INSERTION DES DONNÉES PAR DÉFAUT
-- =====================================================

-- Insertion de l'administrateur par défaut
-- Mot de passe: thib@.32a (vous devez générer un hash bcrypt)
-- Exemple de hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO
    users (
        email,
        password_hash,
        full_name,
        role,
        is_active
    )
VALUES (
        'thibauttbcbujiriri@gmail.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'Thibaut Tbc Bujiriri',
        'admin',
        TRUE
    )
ON DUPLICATE KEY UPDATE
    email = email;

-- Insertion des paramètres du site
INSERT INTO
    site_settings (
        setting_key,
        setting_value,
        setting_type,
        description
    )
VALUES (
        'company_name',
        'Tbc Groupe',
        'text',
        'Nom de l''entreprise'
    ),
    (
        'company_email',
        'thibauttbcbujiriri@gmail.com',
        'email',
        'Email principal de l''entreprise'
    ),
    (
        'company_phone',
        '+243 979 823 604',
        'text',
        'Téléphone principal'
    ),
    (
        'company_address',
        'Office 2 – Kanisa La Mungu, Goma, Nord-Kivu',
        'text',
        'Adresse complète'
    ),
    (
        'company_city',
        'Goma',
        'text',
        'Ville'
    ),
    (
        'company_region',
        'Nord-Kivu',
        'text',
        'Province/Région'
    ),
    (
        'company_country',
        'République Démocratique du Congo',
        'text',
        'Pays'
    ),
    (
        'company_description',
        'Expert en développement d''applications web et mobile, référencement SEO et formations en développement web et mobile. Spécialisé en environnement JavaScript.',
        'textarea',
        'Description de l''entreprise'
    ),
    (
        'site_title',
        'Tbc Groupe - Développement Web & Mobile | Formations JavaScript',
        'text',
        'Titre du site'
    ),
    (
        'site_description',
        'Expert en développement d''applications web et mobile, référencement SEO et formations. Spécialisé en environnement JavaScript.',
        'textarea',
        'Description SEO du site'
    )
ON DUPLICATE KEY UPDATE
    setting_key = setting_key;

-- Insertion des services par défaut
INSERT INTO
    services (
        title,
        description,
        icon_name,
        features,
        technologies,
        is_active,
        display_order
    )
VALUES (
        'Développement Web',
        'Applications web modernes et performantes avec React, Node.js et les dernières technologies JavaScript.',
        'Code',
        JSON_ARRAY(
            'Applications web responsives',
            'Intégration d''APIs',
            'Optimisation des performances',
            'Maintenance et support'
        ),
        JSON_ARRAY(
            'React',
            'Node.js',
            'TypeScript',
            'Next.js',
            'Express'
        ),
        TRUE,
        1
    ),
    (
        'Développement Mobile',
        'Applications mobiles cross-platform et natives pour iOS et Android.',
        'Smartphone',
        JSON_ARRAY(
            'Applications iOS et Android',
            'Développement cross-platform',
            'Intégration de services cloud',
            'Publication sur les stores'
        ),
        JSON_ARRAY(
            'React Native',
            'Flutter',
            'Swift',
            'Kotlin'
        ),
        TRUE,
        2
    ),
    (
        'Référencement SEO',
        'Optimisation pour les moteurs de recherche et amélioration de votre visibilité en ligne.',
        'Search',
        JSON_ARRAY(
            'Audit SEO complet',
            'Optimisation du contenu',
            'Stratégie de link building',
            'Suivi et rapports d''analyse'
        ),
        JSON_ARRAY(
            'Google Analytics',
            'Google Search Console',
            'Ahrefs',
            'SEMrush'
        ),
        TRUE,
        3
    ),
    (
        'Formations',
        'Formations complètes en développement web et mobile, spécialisées en environnement JavaScript.',
        'GraduationCap',
        JSON_ARRAY(
            'Formations adaptées à tous les niveaux',
            'Programmes pratiques avec projets réels',
            'Support et suivi personnalisé',
            'Certification en fin de formation'
        ),
        JSON_ARRAY(
            'JavaScript',
            'React',
            'Node.js',
            'React Native',
            'TypeScript'
        ),
        TRUE,
        4
    )
ON DUPLICATE KEY UPDATE
    title = title;

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour les formateurs avec leur nombre d'expériences et compétences
CREATE OR REPLACE VIEW v_trainers_details AS
SELECT
    t.id,
    t.name,
    t.title,
    t.bio,
    t.bio_extended,
    t.image_url,
    t.image_base64,
    t.email,
    t.phone,
    t.is_active,
    t.display_order,
    COUNT(DISTINCT te.id) as experiences_count,
    COUNT(DISTINCT ts.id) as skills_count,
    COUNT(DISTINCT tt.id) as technologies_count,
    t.created_at,
    t.updated_at
FROM
    trainers t
    LEFT JOIN trainer_experiences te ON t.id = te.trainer_id
    LEFT JOIN trainer_skills ts ON t.id = ts.trainer_id
    LEFT JOIN trainer_technologies tt ON t.id = tt.trainer_id
WHERE
    t.is_active = TRUE
GROUP BY
    t.id;

-- Vue pour les messages de contact non lus
CREATE OR REPLACE VIEW v_unread_messages AS
SELECT cm.*, u.full_name as read_by_name
FROM contact_messages cm
    LEFT JOIN users u ON cm.read_by = u.id
WHERE
    cm.is_read = FALSE
ORDER BY cm.created_at DESC;

-- =====================================================
-- INDEX SUPPLÉMENTAIRES POUR PERFORMANCE
-- =====================================================

-- Index composites pour améliorer les performances des requêtes
CREATE INDEX idx_trainers_active_order ON trainers (is_active, display_order);

CREATE INDEX idx_services_active_order ON services (is_active, display_order);

CREATE INDEX idx_projects_active_featured ON portfolio_projects (is_active, is_featured);