<?php
/**
 * API pour la gestion des administrateurs
 * Accès réservé aux super_admin uniquement
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

// Démarrer la session si elle n'est pas déjà démarrée
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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

// Vérifier l'authentification et le rôle
function checkSuperAdmin($db) {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role'])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Non authentifié"
        ]);
        exit();
    }
    
    if ($_SESSION['user_role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Accès refusé. Seuls les super administrateurs peuvent gérer les admins."
        ]);
        exit();
    }
    
    return true;
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
    
    // Méthode alternative : chercher le dernier élément numérique dans l'URL
    for ($i = count($uri_parts) - 1; $i >= 0; $i--) {
        if (is_numeric($uri_parts[$i])) {
            return (int)$uri_parts[$i];
        }
    }
    
    return null;
}

// Récupérer l'ID si présent dans l'URL
$id = extractIdFromUri('admins');

switch ($method) {
    case 'GET':
        checkSuperAdmin($db);
        if ($id) {
            getAdmin($db, $id);
        } else {
            getAdmins($db);
        }
        break;

    case 'POST':
        checkSuperAdmin($db);
        createAdmin($db);
        break;

    case 'PUT':
        checkSuperAdmin($db);
        if ($id) {
            updateAdmin($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID de l'admin requis"]);
        }
        break;

    case 'DELETE':
        checkSuperAdmin($db);
        if ($id) {
            deleteAdmin($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID de l'admin requis"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        break;
}

/**
 * Récupérer tous les administrateurs
 */
function getAdmins($db) {
    try {
        $query = "SELECT id, email, full_name, role, is_active, created_at, updated_at, last_login 
                  FROM users 
                  ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $admins,
            "count" => count($admins)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la récupération des admins",
            "error" => $e->getMessage()
        ]);
    }
}

/**
 * Récupérer un administrateur spécifique
 */
function getAdmin($db, $id) {
    try {
        if (!is_numeric($id) || $id <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID invalide"]);
            return;
        }
        
        $query = "SELECT id, email, full_name, role, is_active, created_at, updated_at, last_login 
                  FROM users 
                  WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$admin) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Admin non trouvé"]);
            return;
        }
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $admin
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la récupération de l'admin",
            "error" => $e->getMessage()
        ]);
    }
}

/**
 * Créer un nouvel administrateur
 */
function createAdmin($db) {
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
        
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['full_name']) || !isset($data['role'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Email, mot de passe, nom complet et rôle sont requis"]);
            return;
        }
        
        // Vérifier que l'email n'existe pas déjà
        $check_query = "SELECT id FROM users WHERE email = :email";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->bindParam(':email', $data['email']);
        $check_stmt->execute();
        
        if ($check_stmt->fetch()) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Cet email est déjà utilisé"]);
            return;
        }
        
        // Valider le rôle (ne pas permettre de créer un super_admin)
        $allowed_roles = ['admin', 'editor'];
        if (!in_array($data['role'], $allowed_roles)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Rôle invalide. Seuls 'admin' et 'editor' sont autorisés"]);
            return;
        }
        
        // Hasher le mot de passe
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $query = "INSERT INTO users (email, password_hash, full_name, role, is_active) 
                  VALUES (:email, :password_hash, :full_name, :role, 1)";
        
        $stmt = $db->prepare($query);
        
        $email = $data['email'];
        $full_name = $data['full_name'];
        $role = $data['role'];
        
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password_hash', $password_hash);
        $stmt->bindParam(':full_name', $full_name);
        $stmt->bindParam(':role', $role);
        
        if ($stmt->execute()) {
            $admin_id = $db->lastInsertId();
            
            // Récupérer l'admin créé
            $get_query = "SELECT id, email, full_name, role, is_active, created_at, updated_at, last_login 
                         FROM users 
                         WHERE id = :id";
            $get_stmt = $db->prepare($get_query);
            $get_stmt->bindParam(':id', $admin_id, PDO::PARAM_INT);
            $get_stmt->execute();
            $new_admin = $get_stmt->fetch(PDO::FETCH_ASSOC);
            
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Admin créé avec succès",
                "data" => $new_admin
            ]);
        } else {
            $errorInfo = $stmt->errorInfo();
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la création de l'admin",
                "error" => $errorInfo[2] ?? "Erreur inconnue"
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la création de l'admin",
            "error" => $e->getMessage()
        ]);
    }
}

/**
 * Mettre à jour un administrateur
 */
function updateAdmin($db, $id) {
    try {
        if (!is_numeric($id) || $id <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID invalide"]);
            return;
        }
        
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
        
        if (!$data || !is_array($data)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Données invalides"]);
            return;
        }
        
        // Vérifier que l'admin existe
        $check_query = "SELECT id, role FROM users WHERE id = :id";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $check_stmt->execute();
        $existing_admin = $check_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$existing_admin) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Admin non trouvé"]);
            return;
        }
        
        // Ne pas permettre de modifier un super_admin
        if ($existing_admin['role'] === 'super_admin') {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Impossible de modifier un super administrateur"]);
            return;
        }
        
        // Construire la requête de mise à jour dynamiquement
        $update_fields = [];
        $params = [];
        
        if (isset($data['full_name'])) {
            $update_fields[] = "full_name = :full_name";
            $params['full_name'] = $data['full_name'];
        }
        
        if (isset($data['password']) && !empty(trim($data['password']))) {
            $update_fields[] = "password_hash = :password_hash";
            $params['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        if (isset($data['role'])) {
            // Valider le rôle (ne pas permettre de promouvoir en super_admin)
            $allowed_roles = ['admin', 'editor'];
            if (!in_array($data['role'], $allowed_roles)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Rôle invalide. Seuls 'admin' et 'editor' sont autorisés"]);
                return;
            }
            $update_fields[] = "role = :role";
            $params['role'] = $data['role'];
        }
        
        if (isset($data['is_active'])) {
            $update_fields[] = "is_active = :is_active";
            $params['is_active'] = (bool)$data['is_active'] ? 1 : 0;
        }
        
        if (empty($update_fields)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Aucune donnée à mettre à jour"]);
            return;
        }
        
        $query = "UPDATE users SET " . implode(", ", $update_fields) . " WHERE id = :id";
        $stmt = $db->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            // Récupérer l'admin mis à jour
            $get_query = "SELECT id, email, full_name, role, is_active, created_at, updated_at, last_login 
                         FROM users 
                         WHERE id = :id";
            $get_stmt = $db->prepare($get_query);
            $get_stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $get_stmt->execute();
            $updated_admin = $get_stmt->fetch(PDO::FETCH_ASSOC);
            
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Admin mis à jour avec succès",
                "data" => $updated_admin
            ]);
        } else {
            $errorInfo = $stmt->errorInfo();
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la mise à jour de l'admin",
                "error" => $errorInfo[2] ?? "Erreur inconnue"
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la mise à jour de l'admin",
            "error" => $e->getMessage()
        ]);
    }
}

/**
 * Désactiver un administrateur (soft delete)
 */
function deleteAdmin($db, $id) {
    try {
        if (!is_numeric($id) || $id <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID invalide"]);
            return;
        }
        
        // Vérifier que l'admin existe
        $check_query = "SELECT id, role FROM users WHERE id = :id";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $check_stmt->execute();
        $existing_admin = $check_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$existing_admin) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Admin non trouvé"]);
            return;
        }
        
        // Ne pas permettre de désactiver un super_admin
        if ($existing_admin['role'] === 'super_admin') {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Impossible de désactiver un super administrateur"]);
            return;
        }
        
        // Ne pas permettre de se désactiver soi-même
        if (isset($_SESSION['user_id']) && (int)$id === (int)$_SESSION['user_id']) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Vous ne pouvez pas vous désactiver vous-même"]);
            return;
        }
        
        // Soft delete : mettre is_active à 0
        $query = "UPDATE users SET is_active = 0 WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Admin désactivé avec succès"
            ]);
        } else {
            $errorInfo = $stmt->errorInfo();
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de la désactivation de l'admin",
                "error" => $errorInfo[2] ?? "Erreur inconnue"
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la désactivation de l'admin",
            "error" => $e->getMessage()
        ]);
    }
}

?>
