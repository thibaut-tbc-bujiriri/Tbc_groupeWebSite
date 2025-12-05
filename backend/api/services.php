<?php
/**
 * API pour les services
 */

require_once '../config/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Fonction pour extraire l'ID de l'URL
function extractIdFromUri($resourceName) {
    $request_uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($request_uri, PHP_URL_PATH);
    $uri_parts = explode('/', trim($path, '/'));
    
    // Trouver la position de la ressource dans l'URL
    $resourceIndex = array_search($resourceName, $uri_parts);
    
    if ($resourceIndex !== false && isset($uri_parts[$resourceIndex + 1])) {
        $nextPart = $uri_parts[$resourceIndex + 1];
        if (is_numeric($nextPart)) {
            return (int)$nextPart;
        }
    }
    return null;
}

// Récupérer l'ID si présent dans l'URL (après /api/services/{id})
$id = extractIdFromUri('services');

switch ($method) {
    case 'GET':
        if ($id) {
            getService($db, $id);
        } else {
            getServices($db);
        }
        break;

    case 'POST':
        createService($db);
        break;

    case 'PUT':
        if ($id) {
            updateService($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du service requis"]);
        }
        break;

    case 'DELETE':
        if ($id) {
            deleteService($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du service requis"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        break;
}

/**
 * Récupérer tous les services actifs
 */
function getServices($db) {
    $query = "SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $services = $stmt->fetchAll();
    
    // Décoder les champs JSON
    foreach ($services as &$service) {
        if (!empty($service['features'])) {
            $service['features'] = json_decode($service['features'], true);
        }
        if (!empty($service['technologies'])) {
            $service['technologies'] = json_decode($service['technologies'], true);
        }
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $services,
        "count" => count($services)
    ]);
}

function getService($db, $id) {
    $query = "SELECT * FROM services WHERE id = :id AND is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $service = $stmt->fetch();
    
    if (!$service) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Service non trouvé"]);
        return;
    }
    
    if (!empty($service['features'])) {
        $service['features'] = json_decode($service['features'], true);
    }
    if (!empty($service['technologies'])) {
        $service['technologies'] = json_decode($service['technologies'], true);
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $service
    ]);
}

function createService($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['title']) || !isset($data['description'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Titre et description sont requis"]);
        return;
    }
    
    $query = "INSERT INTO services (title, description, icon_name, features, technologies, is_active, display_order) 
              VALUES (:title, :description, :icon_name, :features, :technologies, 1, :display_order)";
    
    $stmt = $db->prepare($query);
    
    $features = isset($data['features']) && is_array($data['features']) 
        ? json_encode($data['features']) 
        : null;
    $technologies = isset($data['technologies']) && is_array($data['technologies']) 
        ? json_encode($data['technologies']) 
        : null;
    $display_order = isset($data['display_order']) ? (int)$data['display_order'] : 0;
    
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':icon_name', $data['icon_name'] ?? null);
    $stmt->bindParam(':features', $features);
    $stmt->bindParam(':technologies', $technologies);
    $stmt->bindParam(':display_order', $display_order);
    
    if ($stmt->execute()) {
        $service_id = $db->lastInsertId();
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Service créé avec succès",
            "data" => ["id" => $service_id]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la création du service"]);
    }
}

function updateService($db, $id) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $fields = [];
    if (isset($data['title'])) $fields[] = "title = :title";
    if (isset($data['description'])) $fields[] = "description = :description";
    if (isset($data['icon_name'])) $fields[] = "icon_name = :icon_name";
    if (isset($data['features'])) $fields[] = "features = :features";
    if (isset($data['technologies'])) $fields[] = "technologies = :technologies";
    if (isset($data['is_active'])) $fields[] = "is_active = :is_active";
    if (isset($data['display_order'])) $fields[] = "display_order = :display_order";
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Aucun champ à mettre à jour"]);
        return;
    }
    
    $query = "UPDATE services SET " . implode(", ", $fields) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    
    foreach ($data as $key => $value) {
        if (in_array($key, ['title', 'description', 'icon_name'])) {
            $stmt->bindValue(':' . $key, $value);
        } elseif ($key === 'features' && is_array($value)) {
            $stmt->bindValue(':' . $key, json_encode($value));
        } elseif ($key === 'technologies' && is_array($value)) {
            $stmt->bindValue(':' . $key, json_encode($value));
        } elseif ($key === 'is_active') {
            $stmt->bindValue(':' . $key, (bool)$value, PDO::PARAM_BOOL);
        } elseif ($key === 'display_order') {
            $stmt->bindValue(':' . $key, (int)$value, PDO::PARAM_INT);
        }
    }
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Service mis à jour avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
    }
}

function deleteService($db, $id) {
    $query = "UPDATE services SET is_active = 0 WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Service supprimé avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la suppression"]);
    }
}

?>

