<?php
/**
 * Script de test de connexion à Supabase
 * Retourne du JSON pour faciliter le débogage
 */

header('Content-Type: application/json; charset=UTF-8');

// Vérifier d'abord si l'extension est chargée
$extensions = get_loaded_extensions();
$pdo_pgsql_loaded = in_array('pdo_pgsql', $extensions);

if (!$pdo_pgsql_loaded) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Extension pdo_pgsql non chargée",
        "error" => "could not find driver",
        "solution" => [
            "1" => "Ouvrez le fichier php.ini : C:\\xampp\\php\\php.ini",
            "2" => "Décommentez (enlevez le ;) ces lignes :",
            "3" => "   extension=pdo_pgsql",
            "4" => "   extension=pgsql",
            "5" => "Redémarrez Apache dans XAMPP"
        ],
        "php_ini_path" => php_ini_loaded_file(),
        "extensions_loaded" => $extensions
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// Si l'extension est chargée, tester la connexion
require_once __DIR__ . '/config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        // Test de requête
        $query = "SELECT count(*) as count FROM users";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $query = "SELECT email, role FROM users LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Test de version PostgreSQL
        $query = "SELECT version()";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $version = $stmt->fetchColumn();
        
        // Lister les tables
        $query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Connexion réussie à Supabase",
            "data" => [
                "users_count" => (int)$row['count'],
                "first_user" => $user ? [
                    "email" => $user['email'],
                    "role" => $user['role']
                ] : null,
                "postgres_version" => $version,
                "tables_count" => count($tables),
                "tables" => $tables
            ]
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Échec de la connexion (Objet null)"
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur de connexion à Supabase",
        "error" => $e->getMessage(),
        "code" => $e->getCode(),
        "file" => basename($e->getFile()),
        "line" => $e->getLine()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
