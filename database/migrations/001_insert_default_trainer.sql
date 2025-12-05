-- Migration: Insertion du formateur par défaut (Thibaut Tbc Bujiriri)
-- Date: 2024

USE tbc_groupe;

-- Insertion du formateur par défaut
INSERT INTO
    trainers (
        name,
        title,
        bio,
        bio_extended,
        image_url,
        email,
        phone,
        is_active,
        display_order
    )
VALUES (
        'Thibaut Tbc Bujiriri',
        'Formateur & Développeur Fullstack JavaScript',
        'Passionné par le développement web et mobile, je partage mon expertise et mon expérience à travers des formations complètes et pratiques. Mon objectif est de former la prochaine génération de développeurs JavaScript compétents et autonomes.',
        'Avec plusieurs années d''expérience en développement fullstack et en formation, j''ai accompagné de nombreux étudiants dans leur parcours vers la maîtrise des technologies modernes. Ma pédagogie privilégie la pratique et la réalisation de projets concrets.',
        '/images/thibaut-profile.jpg',
        'thibauttbcbujiriri@gmail.com',
        '+243 979 823 604',
        TRUE,
        1
    )
ON DUPLICATE KEY UPDATE
    name = name;

-- Récupérer l'ID du formateur inséré (nécessite d'être exécuté séparément ou via une procédure)
SET @trainer_id = LAST_INSERT_ID();

-- Insertion des expériences
INSERT INTO
    trainer_experiences (
        trainer_id,
        year,
        title,
        description,
        display_order
    )
VALUES (
        @trainer_id,
        '2020 - Présent',
        'Formateur Fullstack JavaScript',
        'Formation de développeurs aux technologies modernes du web et du mobile dans l''écosystème JavaScript.',
        1
    ),
    (
        @trainer_id,
        '2018 - Présent',
        'Développeur Fullstack JavaScript',
        'Développement d''applications web et mobile pour diverses entreprises et startups.',
        2
    );

-- Insertion des compétences
INSERT INTO
    trainer_skills (
        trainer_id,
        skill_name,
        skill_level,
        display_order
    )
VALUES (
        @trainer_id,
        'React / React Native',
        95,
        1
    ),
    (
        @trainer_id,
        'Node.js / Express',
        90,
        2
    ),
    (
        @trainer_id,
        'JavaScript / TypeScript',
        95,
        3
    ),
    (
        @trainer_id,
        'MongoDB / PostgreSQL',
        85,
        4
    ),
    (
        @trainer_id,
        'Next.js / Vue.js',
        88,
        5
    ),
    (
        @trainer_id,
        'Git / GitHub',
        90,
        6
    );

-- Insertion des technologies
INSERT INTO
    trainer_technologies (
        trainer_id,
        technology_name,
        display_order
    )
VALUES (
        @trainer_id,
        'JavaScript ES6+',
        1
    ),
    (@trainer_id, 'TypeScript', 2),
    (@trainer_id, 'React', 3),
    (
        @trainer_id,
        'React Native',
        4
    ),
    (@trainer_id, 'Next.js', 5),
    (@trainer_id, 'Node.js', 6),
    (@trainer_id, 'Express', 7),
    (@trainer_id, 'Vue.js', 8),
    (@trainer_id, 'Angular', 9),
    (@trainer_id, 'MongoDB', 10),
    (@trainer_id, 'PostgreSQL', 11),
    (@trainer_id, 'Firebase', 12),
    (@trainer_id, 'GraphQL', 13),
    (@trainer_id, 'REST APIs', 14),
    (@trainer_id, 'Git', 15),
    (@trainer_id, 'Docker', 16),
    (@trainer_id, 'AWS', 17),
    (
        @trainer_id,
        'TailwindCSS',
        18
    );

-- Insertion des programmes de formation
INSERT INTO
    training_programs (
        trainer_id,
        title,
        description,
        duration,
        icon_name,
        is_active,
        display_order
    )
VALUES (
        @trainer_id,
        'Formation JavaScript Fondamentaux',
        'Maîtrisez les bases du JavaScript moderne : variables, fonctions, objets, arrays, async/await, etc.',
        '4 semaines',
        'BookOpen',
        TRUE,
        1
    ),
    (
        @trainer_id,
        'Formation React & React Native',
        'Apprenez à développer des applications web et mobile avec React et React Native.',
        '8 semaines',
        'Code',
        TRUE,
        2
    ),
    (
        @trainer_id,
        'Formation Fullstack JavaScript',
        'Formation complète pour devenir développeur fullstack : frontend, backend, base de données.',
        '12 semaines',
        'Rocket',
        TRUE,
        3
    ),
    (
        @trainer_id,
        'Formation Node.js & Express',
        'Créez des APIs RESTful et des applications backend performantes avec Node.js et Express.',
        '6 semaines',
        'Users',
        TRUE,
        4
    );