-- Script de mise à jour des rôles pour le système de gestion des admins
-- Tbc Groupe - Mise à jour des rôles utilisateurs

USE tbc_groupe;

-- Modifier la table users pour ajouter 'super_admin' comme rôle
ALTER TABLE users
MODIFY COLUMN role ENUM(
    'super_admin',
    'admin',
    'editor'
) DEFAULT 'editor';

-- Mettre à jour l'utilisateur principal en super_admin
UPDATE users
SET role = 'super_admin'
WHERE
    email = 'thibauttbcbujiriri@gmail.com';

-- Vérifier la mise à jour
SELECT id, email, full_name, role, is_active FROM users;