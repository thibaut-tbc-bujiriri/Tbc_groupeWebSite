-- Script SQL direct pour corriger le mot de passe et le rôle du super admin
-- IMPORTANT : Vous devez d'abord générer un hash avec PHP, puis l'insérer ici
-- OU exécutez fix-password-and-test.php qui le fera automatiquement

USE tbc_groupe;

-- Vérifier la structure de la table
SHOW COLUMNS FROM users WHERE Field = 'role';

-- Si la structure ne supporte pas super_admin, exécutez d'abord :
ALTER TABLE users
MODIFY COLUMN role ENUM(
    'super_admin',
    'admin',
    'editor'
) DEFAULT 'editor';

-- Générer un hash pour le mot de passe 'thib@.32a'
-- Utilisez ce script PHP pour générer le hash :
-- <?php echo password_hash('thib@.32a', PASSWORD_DEFAULT); ?>
-- Puis remplacez le hash ci-dessous

-- Pour le moment, on va créer/mettre à jour avec un hash temporaire
-- NOTE: Le hash ci-dessous est un exemple - vous DEVEZ le remplacer par un vrai hash

-- Option 1 : Si le compte existe, le mettre à jour
UPDATE users
SET
    password_hash = '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    role = 'super_admin',
    full_name = 'Thibaut Tbc Bujiriri',
    is_active = 1
WHERE
    email = 'thibauttbcbujiriri@gmail.com';

-- Option 2 : Si le compte n'existe pas, le créer (décommentez si nécessaire)
-- INSERT INTO users (email, password_hash, full_name, role, is_active)
-- VALUES (
--     'thibauttbcbujiriri@gmail.com',
--     '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
--     'Thibaut Tbc Bujiriri',
--     'super_admin',
--     1
-- )
-- ON DUPLICATE KEY UPDATE
--     password_hash = VALUES(password_hash),
--     role = VALUES(role),
--     full_name = VALUES(full_name),
--     is_active = VALUES(is_active);

-- Vérifier le résultat
SELECT
    id,
    email,
    full_name,
    role,
    is_active
FROM users
WHERE
    email = 'thibauttbcbujiriri@gmail.com';