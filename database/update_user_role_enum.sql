-- Script pour mettre à jour l'ENUM user_role pour inclure 'super_admin'
-- À exécuter dans Supabase SQL Editor si 'super_admin' n'existe pas déjà

-- Méthode 1: Si le type n'existe pas encore, il sera créé avec les 3 valeurs
-- (Le schéma principal devrait déjà le créer correctement)

-- Méthode 2: Si le type existe déjà avec seulement 'admin' et 'editor',
-- ajouter 'super_admin' (PostgreSQL ne permet pas de modifier un ENUM directement)
-- Il faut créer un nouveau type et migrer les données

-- Vérifier d'abord si 'super_admin' existe déjà
DO $$
BEGIN
    -- Essayer d'ajouter la valeur si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'super_admin' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
    ) THEN
        ALTER TYPE user_role ADD VALUE 'super_admin';
        RAISE NOTICE 'Valeur super_admin ajoutée à user_role';
    ELSE
        RAISE NOTICE 'La valeur super_admin existe déjà dans user_role';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erreur lors de l''ajout de super_admin: %', SQLERRM;
END $$;

-- Vérifier les valeurs disponibles
SELECT unnest(enum_range(NULL::user_role))::text AS role_value;




