<?php
/**
 * API pour la gestion des programmes de formation
 */

require_once '../config/database.php';
require_once '../config/cors.php';

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
    
    // Méthode alternative : chercher le dernier élément numérique dans l'URL
    // Utile pour les ressources avec tirets comme "training-programs"
    for ($i = count($uri_parts) - 1; $i >= 0; $i--) {
        if (is_numeric($uri_parts[$i])) {
            return (int)$uri_parts[$i];
        }
    }
    
    return null;
}

// Récupérer l'ID si présent dans l'URL
$id = extractIdFromUri('training-programs');

switch ($method) {
    case 'GET':
        if ($id) {
            getProgram($db, $id);
        } else {
            $trainer_id = isset($_GET['trainer_id']) ? (int)$_GET['trainer_id'] : null;
            getPrograms($db, $trainer_id);
        }
        break;

    case 'POST':
        createProgram($db);
        break;

    case 'PUT':
        if ($id) {
            updateProgram($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du programme requis"]);
        }
        break;

    case 'DELETE':
        if ($id) {
            deleteProgram($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du programme requis"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        break;
}

function getPrograms($db, $trainer_id = null) {
    if ($trainer_id) {
        $query = "SELECT * FROM training_programs WHERE trainer_id = :trainer_id AND is_active = 1 ORDER BY display_order ASC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':trainer_id', $trainer_id, PDO::PARAM_INT);
    } else {
        $query = "SELECT * FROM training_programs WHERE is_active = 1 ORDER BY display_order ASC";
        $stmt = $db->prepare($query);
    }
    
    $stmt->execute();
    $programs = $stmt->fetchAll();
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $programs,
        "count" => count($programs)
    ]);
}

function getProgram($db, $id) {
    $query = "SELECT * FROM training_programs WHERE id = :id AND is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $program = $stmt->fetch();
    
    if (!$program) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Programme non trouvé"]);
        return;
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $program
    ]);
}

function createProgram($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['title']) || !isset($data['description'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Titre et description sont requis"]);
        return;
    }
    
    $query = "INSERT INTO training_programs (trainer_id, title, description, duration, price, icon_name, is_active, display_order) 
              VALUES (:trainer_id, :title, :description, :duration, :price, :icon_name, 1, :display_order)";
    
    $stmt = $db->prepare($query);
    
    $display_order = isset($data['display_order']) ? (int)$data['display_order'] : 0;
    $price = isset($data['price']) ? (float)$data['price'] : null;
    
    $stmt->bindParam(':trainer_id', $data['trainer_id'] ?? null);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':duration', $data['duration'] ?? null);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':icon_name', $data['icon_name'] ?? null);
    $stmt->bindParam(':display_order', $display_order);
    
    if ($stmt->execute()) {
        $program_id = $db->lastInsertId();
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Programme créé avec succès",
            "data" => ["id" => $program_id]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la création du programme"]);
    }
}

function updateProgram($db, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID du programme requis"]);
        return;
    }
    
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Données JSON invalides"]);
        return;
    }
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Aucune donnée fournie"]);
        return;
    }
    
    $fields = [];
    $params = [];
    
    if (isset($data['trainer_id'])) {
        $fields[] = "trainer_id = :trainer_id";
        $params[':trainer_id'] = $data['trainer_id'] ? (int)$data['trainer_id'] : null;
    }
    if (isset($data['title'])) {
        $fields[] = "title = :title";
        $params[':title'] = $data['title'];
    }
    if (isset($data['description'])) {
        $fields[] = "description = :description";
        $params[':description'] = $data['description'];
    }
    if (isset($data['duration'])) {
        $fields[] = "duration = :duration";
        $params[':duration'] = $data['duration'];
    }
    if (isset($data['price'])) {
        $fields[] = "price = :price";
        $params[':price'] = $data['price'] ? (float)$data['price'] : null;
    }
    if (isset($data['icon_name'])) {
        $fields[] = "icon_name = :icon_name";
        $params[':icon_name'] = $data['icon_name'];
    }
    if (isset($data['is_active'])) {
        $fields[] = "is_active = :is_active";
        $params[':is_active'] = (bool)$data['is_active'];
    }
    if (isset($data['display_order'])) {
        $fields[] = "display_order = :display_order";
        $params[':display_order'] = (int)$data['display_order'];
    }
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Aucun champ à mettre à jour"]);
        return;
    }
    
    $query = "UPDATE training_programs SET " . implode(", ", $fields) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Programme mis à jour avec succès"
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Erreur lors de la mise à jour",
            "error" => $errorInfo[2] ?? "Erreur inconnue"
        ]);
    }
}

function deleteProgram($db, $id) {
    $query = "UPDATE training_programs SET is_active = 0 WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Programme supprimé avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la suppression"]);
    }
}

?>



