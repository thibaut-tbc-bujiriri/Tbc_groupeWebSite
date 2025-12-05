<?php
/**
 * API pour la gestion des paramètres du site
 */

require_once '../config/database.php';
require_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Fonction pour extraire la clé de l'URL
function extractKeyFromUri($resourceName) {
    $request_uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($request_uri, PHP_URL_PATH);
    $uri_parts = explode('/', trim($path, '/'));
    
    // Trouver la position de la ressource dans l'URL
    $resourceIndex = array_search($resourceName, $uri_parts);
    
    if ($resourceIndex !== false && isset($uri_parts[$resourceIndex + 1])) {
        return $uri_parts[$resourceIndex + 1];
    }
    return null;
}

// Récupérer la clé si présente dans l'URL
$key = extractKeyFromUri('settings');

switch ($method) {
    case 'GET':
        if ($key) {
            getSetting($db, $key);
        } else {
            getSettings($db);
        }
        break;

    case 'POST':
        createSetting($db);
        break;

    case 'PUT':
        if ($key) {
            updateSetting($db, $key);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Clé du paramètre requise"]);
        }
        break;

    case 'DELETE':
        if ($key) {
            deleteSetting($db, $key);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Clé du paramètre requise"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        break;
}

function getSettings($db) {
    $query = "SELECT * FROM site_settings ORDER BY setting_key ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $settings = $stmt->fetchAll();
    
    // Organiser par clé
    $settingsArray = [];
    foreach ($settings as $setting) {
        $settingsArray[$setting['setting_key']] = $setting;
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $settingsArray,
        "count" => count($settings)
    ]);
}

function getSetting($db, $key) {
    $query = "SELECT * FROM site_settings WHERE setting_key = :key";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':key', $key);
    $stmt->execute();
    
    $setting = $stmt->fetch();
    
    if (!$setting) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Paramètre non trouvé"]);
        return;
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $setting
    ]);
}

function createSetting($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['setting_key']) || !isset($data['setting_value'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Clé et valeur sont requis"]);
        return;
    }
    
    $query = "INSERT INTO site_settings (setting_key, setting_value, setting_type, description) 
              VALUES (:setting_key, :setting_value, :setting_type, :description)
              ON DUPLICATE KEY UPDATE setting_value = :setting_value, setting_type = :setting_type, description = :description";
    
    $stmt = $db->prepare($query);
    
    $setting_type = $data['setting_type'] ?? 'text';
    
    $stmt->bindParam(':setting_key', $data['setting_key']);
    $stmt->bindParam(':setting_value', $data['setting_value']);
    $stmt->bindParam(':setting_type', $setting_type);
    $stmt->bindParam(':description', $data['description'] ?? null);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Paramètre créé/mis à jour avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la création du paramètre"]);
    }
}

function updateSetting($db, $key) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $fields = [];
    if (isset($data['setting_value'])) $fields[] = "setting_value = :setting_value";
    if (isset($data['setting_type'])) $fields[] = "setting_type = :setting_type";
    if (isset($data['description'])) $fields[] = "description = :description";
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Aucun champ à mettre à jour"]);
        return;
    }
    
    $query = "UPDATE site_settings SET " . implode(", ", $fields) . " WHERE setting_key = :key";
    $stmt = $db->prepare($query);
    
    if (isset($data['setting_value'])) $stmt->bindParam(':setting_value', $data['setting_value']);
    if (isset($data['setting_type'])) $stmt->bindParam(':setting_type', $data['setting_type']);
    if (isset($data['description'])) $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':key', $key);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Paramètre mis à jour avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
    }
}

function deleteSetting($db, $key) {
    $query = "DELETE FROM site_settings WHERE setting_key = :key";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':key', $key);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Paramètre supprimé avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la suppression"]);
    }
}

?>



