<?php
/**
 * API pour la gestion du portfolio
 */

// Désactiver l'affichage des erreurs pour éviter qu'elles polluent la réponse JSON
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Gestionnaire d'erreurs global
set_error_handler(function($severity, $message, $file, $line) {
    if (error_reporting() & $severity) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            "success" => false,
            "message" => "Erreur serveur: " . $message
        ]);
        exit;
    }
    return false;
});

// Gestionnaire d'exceptions global
set_exception_handler(function($exception) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur: " . $exception->getMessage()
    ]);
    exit;
});

require_once '../config/cors.php';
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "message" => "Erreur de connexion à la base de données",
        "error" => $e->getMessage()
    ]);
    exit;
}

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

// Récupérer l'ID si présent dans l'URL
$id = extractIdFromUri('portfolio');

switch ($method) {
    case 'GET':
        if ($id) {
            getProject($db, $id);
        } else {
            getProjects($db);
        }
        break;

    case 'POST':
        createProject($db);
        break;

    case 'PUT':
        if ($id) {
            updateProject($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du projet requis"]);
        }
        break;

    case 'DELETE':
        if ($id) {
            deleteProject($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du projet requis"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        break;
}

function getProjects($db) {
    $query = "SELECT * FROM portfolio_projects WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $projects = $stmt->fetchAll();
    
    // Décoder les champs JSON
    foreach ($projects as &$project) {
        if (!empty($project['technologies'])) {
            $project['technologies'] = json_decode($project['technologies'], true);
        }
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $projects,
        "count" => count($projects)
    ]);
}

function getProject($db, $id) {
    $query = "SELECT * FROM portfolio_projects WHERE id = :id AND is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $project = $stmt->fetch();
    
    if (!$project) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Projet non trouvé"]);
        return;
    }
    
    if (!empty($project['technologies'])) {
        $project['technologies'] = json_decode($project['technologies'], true);
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $project
    ]);
}

function createProject($db) {
    try {
        $json_input = file_get_contents("php://input");
        if ($json_input === false) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Impossible de lire les données"]);
            return;
        }
        
        $data = json_decode($json_input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "JSON invalide: " . json_last_error_msg()]);
            return;
        }
        
        if (!$data || !isset($data['title']) || !isset($data['description'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Titre et description sont requis"]);
            return;
        }
        
        $query = "INSERT INTO portfolio_projects (title, description, image_url, image_base64, technologies, project_url, github_url, category, is_featured, is_active, display_order) 
                  VALUES (:title, :description, :image_url, :image_base64, :technologies, :project_url, :github_url, :category, :is_featured, 1, :display_order)";
        
        $stmt = $db->prepare($query);
        
        if (!$stmt) {
            $errorInfo = $db->errorInfo();
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Erreur de préparation de la requête",
                "error" => $errorInfo[2] ?? "Erreur inconnue"
            ]);
            return;
        }
        
        // Préparer les valeurs dans des variables pour bindParam
        $title = trim($data['title']);
        $description = trim($data['description']);
        $image_url = isset($data['image_url']) && !empty(trim($data['image_url'])) ? trim($data['image_url']) : null;
        $image_base64 = isset($data['image_base64']) && !empty(trim($data['image_base64'])) ? trim($data['image_base64']) : null;
        
        // Valider la taille de l'image base64 (max ~5MB en base64 = ~3.75MB en binaire)
        if ($image_base64 && strlen($image_base64) > 7000000) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "L'image est trop grande (max 5MB)"]);
            return;
        }
        
        $technologies = null;
        if (isset($data['technologies']) && is_array($data['technologies']) && !empty($data['technologies'])) {
            $technologies = json_encode($data['technologies']);
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Format de technologies invalide"]);
                return;
            }
        }
        
        $project_url = isset($data['project_url']) && !empty(trim($data['project_url'])) ? trim($data['project_url']) : null;
        $github_url = isset($data['github_url']) && !empty(trim($data['github_url'])) ? trim($data['github_url']) : null;
        $category = isset($data['category']) && !empty(trim($data['category'])) ? trim($data['category']) : null;
        $is_featured = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;
        $display_order = isset($data['display_order']) ? (int)$data['display_order'] : 0;
        
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':image_url', $image_url);
        $stmt->bindParam(':image_base64', $image_base64);
        $stmt->bindParam(':technologies', $technologies);
        $stmt->bindParam(':project_url', $project_url);
        $stmt->bindParam(':github_url', $github_url);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':is_featured', $is_featured, PDO::PARAM_BOOL);
        $stmt->bindParam(':display_order', $display_order, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $project_id = $db->lastInsertId();
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Projet créé avec succès",
                "data" => ["id" => $project_id]
            ]);
        } else {
            $errorInfo = $stmt->errorInfo();
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la création du projet",
                "error" => $errorInfo[2] ?? "Erreur inconnue"
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur serveur: " . $e->getMessage()
        ]);
    } catch (Error $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur serveur: " . $e->getMessage()
        ]);
    }
}

function updateProject($db, $id) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $fields = [];
    if (isset($data['title'])) $fields[] = "title = :title";
    if (isset($data['description'])) $fields[] = "description = :description";
    if (isset($data['image_url'])) $fields[] = "image_url = :image_url";
    if (isset($data['image_base64'])) $fields[] = "image_base64 = :image_base64";
    if (isset($data['technologies'])) $fields[] = "technologies = :technologies";
    if (isset($data['project_url'])) $fields[] = "project_url = :project_url";
    if (isset($data['github_url'])) $fields[] = "github_url = :github_url";
    if (isset($data['category'])) $fields[] = "category = :category";
    if (isset($data['is_featured'])) $fields[] = "is_featured = :is_featured";
    if (isset($data['is_active'])) $fields[] = "is_active = :is_active";
    if (isset($data['display_order'])) $fields[] = "display_order = :display_order";
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Aucun champ à mettre à jour"]);
        return;
    }
    
    $query = "UPDATE portfolio_projects SET " . implode(", ", $fields) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    
    foreach ($data as $key => $value) {
        if (in_array($key, ['title', 'description', 'image_url', 'image_base64', 'project_url', 'github_url', 'category'])) {
            $stmt->bindValue(':' . $key, $value);
        } elseif ($key === 'technologies' && is_array($value)) {
            $stmt->bindValue(':' . $key, json_encode($value));
        } elseif ($key === 'is_featured' || $key === 'is_active') {
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
            "message" => "Projet mis à jour avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
    }
}

function deleteProject($db, $id) {
    $query = "UPDATE portfolio_projects SET is_active = 0 WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Projet supprimé avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la suppression"]);
    }
}

?>



