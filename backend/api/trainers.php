<?php
/**
 * API pour la gestion des formateurs
 */

// Désactiver l'affichage des erreurs pour éviter de polluer le JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Capturer toutes les erreurs et les retourner en JSON
set_error_handler(function($severity, $message, $file, $line) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
    }
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur",
        "error" => $message,
        "file" => basename($file),
        "line" => $line
    ]);
    exit();
});

// Capturer les exceptions non attrapées
set_exception_handler(function($exception) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
    }
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur",
        "error" => $exception->getMessage(),
        "file" => basename($exception->getFile()),
        "line" => $exception->getLine()
    ]);
    exit();
});

require_once '../config/cors.php';
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur de connexion à la base de données",
        "error" => $e->getMessage()
    ]);
    exit();
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

// Récupérer l'ID si présent dans l'URL (format: /api/trainers/{id})
$id = extractIdFromUri('trainers');

switch ($method) {
    case 'GET':
        try {
            if ($id) {
                // Récupérer un formateur spécifique
                getTrainer($db, $id);
            } else {
                // Récupérer tous les formateurs
                getTrainers($db);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la récupération",
                "error" => $e->getMessage()
            ]);
        }
        break;

    case 'POST':
        // Créer un nouveau formateur
        createTrainer($db);
        break;

    case 'PUT':
        if ($id) {
            // Mettre à jour un formateur
            updateTrainer($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du formateur requis"]);
        }
        break;

    case 'DELETE':
        if ($id) {
            // Supprimer un formateur
            deleteTrainer($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du formateur requis"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        break;
}

/**
 * Récupérer tous les formateurs actifs
 */
function getTrainers($db) {
    $query = "SELECT * FROM trainers WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $trainers = $stmt->fetchAll();
    
    // Récupérer les expériences, compétences et technologies pour chaque formateur
    foreach ($trainers as &$trainer) {
        $trainer['experiences'] = getTrainerExperiences($db, $trainer['id']);
        $trainer['skills'] = getTrainerSkills($db, $trainer['id']);
        $trainer['technologies'] = getTrainerTechnologies($db, $trainer['id']);
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $trainers,
        "count" => count($trainers)
    ]);
}

/**
 * Récupérer un formateur spécifique
 */
function getTrainer($db, $id) {
    $query = "SELECT * FROM trainers WHERE id = :id AND is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $trainer = $stmt->fetch();
    
    if (!$trainer) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Formateur non trouvé"]);
        return;
    }
    
    $trainer['experiences'] = getTrainerExperiences($db, $id);
    $trainer['skills'] = getTrainerSkills($db, $id);
    $trainer['technologies'] = getTrainerTechnologies($db, $id);
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $trainer
    ]);
}

/**
 * Créer un nouveau formateur
 */
function createTrainer($db) {
    try {
        $rawInput = file_get_contents("php://input");
        
        if ($rawInput === false || $rawInput === '') {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Aucune donnée reçue"]);
            return;
        }
        
        $data = json_decode($rawInput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                "success" => false, 
                "message" => "Données JSON invalides",
                "json_error" => json_last_error_msg()
            ]);
            return;
        }
        
        if (!$data || !is_array($data)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Aucune donnée fournie"]);
            return;
        }
        
        if (!isset($data['name']) || !isset($data['title']) || !isset($data['bio'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Nom, titre et bio sont requis"]);
            return;
        }
        
        $query = "INSERT INTO trainers (name, title, bio, bio_extended, image_url, image_base64, email, phone, is_active, display_order) 
                  VALUES (:name, :title, :bio, :bio_extended, :image_url, :image_base64, :email, :phone, 1, :display_order)";
        
        $stmt = $db->prepare($query);
        
        if (!$stmt) {
            $errorInfo = $db->errorInfo();
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Erreur lors de la préparation de la requête",
                "error" => $errorInfo[2] ?? "Erreur inconnue"
            ]);
            return;
        }
        
        $display_order = isset($data['display_order']) ? (int)$data['display_order'] : 0;
        
        // Préparer les valeurs pour éviter les problèmes de référence
        $name = $data['name'];
        $title = $data['title'];
        $bio = $data['bio'];
        $bio_extended = $data['bio_extended'] ?? null;
        $image_url = $data['image_url'] ?? null;
        $image_base64 = $data['image_base64'] ?? null;
        $email = $data['email'] ?? null;
        $phone = $data['phone'] ?? null;
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':bio', $bio);
        $stmt->bindParam(':bio_extended', $bio_extended);
        $stmt->bindParam(':image_url', $image_url);
        $stmt->bindParam(':image_base64', $image_base64);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':display_order', $display_order, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $trainer_id = $db->lastInsertId();
            
            // Insérer expériences, compétences et technologies si fournies
            // Utiliser un try-catch pour éviter que les erreurs polluent la réponse JSON
            try {
                if (isset($data['experiences']) && is_array($data['experiences']) && !empty($data['experiences'])) {
                    insertExperiences($db, $trainer_id, $data['experiences']);
                }
                if (isset($data['skills']) && is_array($data['skills']) && !empty($data['skills'])) {
                    insertSkills($db, $trainer_id, $data['skills']);
                }
                if (isset($data['technologies']) && is_array($data['technologies']) && !empty($data['technologies'])) {
                    insertTechnologies($db, $trainer_id, $data['technologies']);
                }
            } catch (Exception $e) {
                // Logger l'erreur mais continuer quand même
                error_log("Erreur lors de l'insertion des données associées: " . $e->getMessage());
            }
            
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Formateur créé avec succès",
                "data" => ["id" => $trainer_id]
            ]);
        } else {
            $errorInfo = $stmt->errorInfo();
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Erreur lors de la création du formateur",
                "error" => $errorInfo[2] ?? "Erreur inconnue"
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur de base de données",
            "error" => $e->getMessage()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur serveur",
            "error" => $e->getMessage()
        ]);
    }
}

/**
 * Mettre à jour un formateur
 */
function updateTrainer($db, $id) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $fields = [];
    if (isset($data['name'])) $fields[] = "name = :name";
    if (isset($data['title'])) $fields[] = "title = :title";
    if (isset($data['bio'])) $fields[] = "bio = :bio";
    if (isset($data['bio_extended'])) $fields[] = "bio_extended = :bio_extended";
    if (isset($data['image_url'])) $fields[] = "image_url = :image_url";
    if (isset($data['image_base64'])) $fields[] = "image_base64 = :image_base64";
    if (isset($data['email'])) $fields[] = "email = :email";
    if (isset($data['phone'])) $fields[] = "phone = :phone";
    if (isset($data['is_active'])) $fields[] = "is_active = :is_active";
    if (isset($data['display_order'])) $fields[] = "display_order = :display_order";
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Aucun champ à mettre à jour"]);
        return;
    }
    
    $query = "UPDATE trainers SET " . implode(", ", $fields) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    
    foreach ($data as $key => $value) {
        if (in_array($key, ['name', 'title', 'bio', 'bio_extended', 'image_url', 'image_base64', 'email', 'phone'])) {
            $stmt->bindValue(':' . $key, $value);
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
            "message" => "Formateur mis à jour avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
    }
}

/**
 * Supprimer un formateur (soft delete)
 */
function deleteTrainer($db, $id) {
    $query = "UPDATE trainers SET is_active = 0 WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Formateur supprimé avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la suppression"]);
    }
}

// Fonctions helper

function getTrainerExperiences($db, $trainer_id) {
    $query = "SELECT * FROM trainer_experiences WHERE trainer_id = :trainer_id ORDER BY display_order ASC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':trainer_id', $trainer_id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll();
}

function getTrainerSkills($db, $trainer_id) {
    $query = "SELECT * FROM trainer_skills WHERE trainer_id = :trainer_id ORDER BY display_order ASC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':trainer_id', $trainer_id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll();
}

function getTrainerTechnologies($db, $trainer_id) {
    $query = "SELECT * FROM trainer_technologies WHERE trainer_id = :trainer_id ORDER BY display_order ASC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':trainer_id', $trainer_id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll();
}

function insertExperiences($db, $trainer_id, $experiences) {
    if (empty($experiences) || !is_array($experiences)) {
        return;
    }
    
    $query = "INSERT INTO trainer_experiences (trainer_id, year, title, description, display_order) 
              VALUES (:trainer_id, :year, :title, :description, :display_order)";
    $stmt = $db->prepare($query);
    
    foreach ($experiences as $index => $exp) {
        if (!isset($exp['year']) || !isset($exp['title'])) {
            continue; // Ignorer les expériences incomplètes
        }
        // Préparer les valeurs pour éviter les problèmes de référence
        $year = $exp['year'];
        $title = $exp['title'];
        $description = $exp['description'] ?? null;
        
        $stmt->bindParam(':trainer_id', $trainer_id, PDO::PARAM_INT);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindValue(':display_order', $index, PDO::PARAM_INT);
        $stmt->execute();
    }
}

function insertSkills($db, $trainer_id, $skills) {
    if (empty($skills) || !is_array($skills)) {
        return;
    }
    
    $query = "INSERT INTO trainer_skills (trainer_id, skill_name, skill_level, display_order) 
              VALUES (:trainer_id, :skill_name, :skill_level, :display_order)";
    $stmt = $db->prepare($query);
    
    foreach ($skills as $index => $skill) {
        if (!isset($skill['name']) || !isset($skill['level'])) {
            continue; // Ignorer les compétences incomplètes
        }
        // Préparer les valeurs pour éviter les problèmes de référence
        $skill_name = $skill['name'];
        $skill_level = (int)$skill['level'];
        
        $stmt->bindParam(':trainer_id', $trainer_id, PDO::PARAM_INT);
        $stmt->bindParam(':skill_name', $skill_name);
        $stmt->bindParam(':skill_level', $skill_level, PDO::PARAM_INT);
        $stmt->bindValue(':display_order', $index, PDO::PARAM_INT);
        $stmt->execute();
    }
}

function insertTechnologies($db, $trainer_id, $technologies) {
    if (empty($technologies) || !is_array($technologies)) {
        return;
    }
    
    $query = "INSERT INTO trainer_technologies (trainer_id, technology_name, display_order) 
              VALUES (:trainer_id, :technology_name, :display_order)";
    $stmt = $db->prepare($query);
    
    foreach ($technologies as $index => $tech) {
        $name = is_array($tech) ? ($tech['name'] ?? '') : (string)$tech;
        if (empty($name)) {
            continue; // Ignorer les technologies vides
        }
        $stmt->bindParam(':trainer_id', $trainer_id, PDO::PARAM_INT);
        $stmt->bindParam(':technology_name', $name);
        $stmt->bindValue(':display_order', $index, PDO::PARAM_INT);
        $stmt->execute();
    }
}

?>

