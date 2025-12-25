-- =====================================================
-- Ajout des colonnes manquantes à training_programs
-- =====================================================

-- Ajouter la colonne level (niveau du programme)
ALTER TABLE training_programs 
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'debutant';

-- Ajouter la colonne max_participants (nombre maximum de participants)
ALTER TABLE training_programs 
ADD COLUMN IF NOT EXISTS max_participants INTEGER;

-- Ajouter la colonne topics (sujets abordés, stockés en JSONB)
ALTER TABLE training_programs 
ADD COLUMN IF NOT EXISTS topics JSONB DEFAULT '[]'::jsonb;

-- Commentaires pour documentation
COMMENT ON COLUMN training_programs.level IS 'Niveau du programme: debutant, intermediaire, avance, expert';
COMMENT ON COLUMN training_programs.max_participants IS 'Nombre maximum de participants';
COMMENT ON COLUMN training_programs.topics IS 'Liste des sujets abordés (tableau JSON)';

