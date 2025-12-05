-- =====================================================
-- Procédures stockées et Triggers - Version phpMyAdmin
-- À exécuter APRÈS avoir créé les tables
-- =====================================================

USE tbc_groupe;

-- =====================================================
-- PROCÉDURES STOCKÉES
-- =====================================================

-- Procédure pour marquer un message comme lu
DROP PROCEDURE IF EXISTS sp_mark_message_read;

CREATE PROCEDURE sp_mark_message_read(
    IN p_message_id INT,
    IN p_user_id INT
)
BEGIN
    UPDATE contact_messages
    SET is_read = TRUE,
        read_at = CURRENT_TIMESTAMP,
        read_by = p_user_id
    WHERE id = p_message_id;
END;

-- Procédure pour obtenir les statistiques du site
DROP PROCEDURE IF EXISTS sp_get_site_stats;

CREATE PROCEDURE sp_get_site_stats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM trainers WHERE is_active = TRUE) as active_trainers,
        (SELECT COUNT(*) FROM services WHERE is_active = TRUE) as active_services,
        (SELECT COUNT(*) FROM portfolio_projects WHERE is_active = TRUE) as active_projects,
        (SELECT COUNT(*) FROM contact_messages WHERE is_read = FALSE) as unread_messages,
        (SELECT COUNT(*) FROM contact_messages) as total_messages;
END;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger pour mettre à jour updated_at automatiquement pour trainers
DROP TRIGGER IF EXISTS tr_trainers_update;

CREATE TRIGGER tr_trainers_update
BEFORE UPDATE ON trainers
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;

-- Trigger pour mettre à jour updated_at automatiquement pour services
DROP TRIGGER IF EXISTS tr_services_update;

CREATE TRIGGER tr_services_update
BEFORE UPDATE ON services
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;

-- Trigger pour mettre à jour updated_at automatiquement pour portfolio_projects
DROP TRIGGER IF EXISTS tr_portfolio_projects_update;

CREATE TRIGGER tr_portfolio_projects_update
BEFORE UPDATE ON portfolio_projects
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;