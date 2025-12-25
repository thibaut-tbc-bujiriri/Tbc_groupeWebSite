-- ============================================
-- Fonctions d'authentification Supabase
-- À exécuter dans le SQL Editor de Supabase
-- ============================================

-- Extension pgcrypto pour bcrypt (normalement déjà activée dans Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- Fonction pour vérifier le mot de passe
-- ============================================
CREATE OR REPLACE FUNCTION verify_password(input_password TEXT, stored_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier si le hash est au format bcrypt
    IF stored_hash LIKE '$2%' THEN
        -- Comparaison bcrypt
        RETURN stored_hash = crypt(input_password, stored_hash);
    ELSE
        -- Fallback pour les mots de passe non hashés (développement uniquement)
        RETURN input_password = stored_hash;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- ============================================
-- Fonction pour hasher un nouveau mot de passe
-- ============================================
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf', 10));
END;
$$;

-- ============================================
-- Fonction de connexion complète
-- ============================================
CREATE OR REPLACE FUNCTION authenticate_user(user_email TEXT, user_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
    result JSON;
BEGIN
    -- Rechercher l'utilisateur
    SELECT id, email, password_hash, full_name, role, is_active
    INTO user_record
    FROM users
    WHERE email = user_email;

    -- Utilisateur non trouvé
    IF user_record IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Email ou mot de passe incorrect'
        );
    END IF;

    -- Compte désactivé
    IF NOT user_record.is_active THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Compte désactivé'
        );
    END IF;

    -- Vérifier le mot de passe
    IF NOT verify_password(user_password, user_record.password_hash) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Email ou mot de passe incorrect'
        );
    END IF;

    -- Mettre à jour la dernière connexion
    UPDATE users 
    SET last_login = NOW() 
    WHERE id = user_record.id;

    -- Retourner les données utilisateur
    RETURN json_build_object(
        'success', true,
        'message', 'Connexion réussie',
        'user', json_build_object(
            'id', user_record.id,
            'email', user_record.email,
            'full_name', user_record.full_name,
            'role', user_record.role
        )
    );
END;
$$;

-- ============================================
-- Trigger pour hasher automatiquement les mots de passe
-- ============================================
CREATE OR REPLACE FUNCTION hash_password_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Si le mot de passe est fourni et n'est pas déjà hashé
    IF NEW.password_hash IS NOT NULL AND NEW.password_hash != '' THEN
        IF NOT NEW.password_hash LIKE '$2%' THEN
            NEW.password_hash := crypt(NEW.password_hash, gen_salt('bf', 10));
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS hash_password_before_insert ON users;
DROP TRIGGER IF EXISTS hash_password_before_update ON users;

-- Créer les triggers
CREATE TRIGGER hash_password_before_insert
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION hash_password_trigger();

CREATE TRIGGER hash_password_before_update
    BEFORE UPDATE OF password_hash ON users
    FOR EACH ROW
    WHEN (OLD.password_hash IS DISTINCT FROM NEW.password_hash)
    EXECUTE FUNCTION hash_password_trigger();

-- ============================================
-- Permissions RLS (Row Level Security)
-- ============================================

-- Activer RLS sur les tables principales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs (lecture publique limitée)
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- Politiques pour les formateurs (lecture publique)
CREATE POLICY "Trainers are publicly readable" ON trainers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Trainers can be modified by authenticated users" ON trainers
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Politiques pour les services (lecture publique)
CREATE POLICY "Services are publicly readable" ON services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Services can be modified by authenticated users" ON services
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Politiques pour le portfolio (lecture publique)
CREATE POLICY "Portfolio is publicly readable" ON portfolio_projects
    FOR SELECT USING (is_active = true);

CREATE POLICY "Portfolio can be modified by authenticated users" ON portfolio_projects
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Politiques pour les messages de contact (écriture publique, lecture admin)
CREATE POLICY "Anyone can create contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages readable by authenticated" ON contact_messages
    FOR SELECT USING (auth.role() = 'service_role' OR auth.role() = 'anon');

CREATE POLICY "Contact messages can be modified" ON contact_messages
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Politiques pour les paramètres (lecture publique si is_public)
CREATE POLICY "Public settings are readable" ON site_settings
    FOR SELECT USING (is_public = true OR auth.role() = 'service_role' OR auth.role() = 'anon');

CREATE POLICY "Settings can be modified by authenticated users" ON site_settings
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Politiques pour les programmes de formation
CREATE POLICY "Training programs are publicly readable" ON training_programs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Training programs can be modified" ON training_programs
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- ============================================
-- Créer un utilisateur admin de test
-- ============================================
-- Note: Exécutez ceci une seule fois pour créer un admin de test
-- Le mot de passe sera automatiquement hashé par le trigger

-- INSERT INTO users (email, password_hash, full_name, role, is_active)
-- VALUES ('admin@tbcgroupe.com', 'admin123', 'Administrateur', 'super_admin', true)
-- ON CONFLICT (email) DO UPDATE SET
--     password_hash = EXCLUDED.password_hash,
--     full_name = EXCLUDED.full_name,
--     role = EXCLUDED.role;

-- ============================================
-- Pour réinitialiser un mot de passe admin
-- ============================================
-- UPDATE users 
-- SET password_hash = 'nouveaumotdepasse' 
-- WHERE email = 'admin@tbcgroupe.com';


