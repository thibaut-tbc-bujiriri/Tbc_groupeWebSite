<?php
/**
 * API pour la gestion des administrateurs
 * Accessible uniquement par les super_admin
 */

require_once '../config/cors.php';
require_once '../config/database.php';

session_start();

// Vérifier que l'utilisateur est authentifié et est super_admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'super_admin') {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Accès refusé. Seuls les super administrateurs peuvent gérer les admins."
    ]);
    exit();
}

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

// Récupérer l'ID si présent dans l'URL (format: /api/admins/{id})
$id = extractIdFromUri('admins');

switch ($method) {
    case 'GET':
        if ($id) {
            getAdmin($db, $id);
        } else {
            getAdmins($db);
        }
        break;

    case 'POST':
        createAdmin($db);
        break;

    case 'PUT':
        if ($id) {
            updateAdmin($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID de l'admin requis"]);
        }
        break;

    case 'DELETE':
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
 * Récupérer tous les admins
 */
function getAdmins($db) {
    $query = "SELECT id, email, full_name, role, is_active, created_at, last_login 
              FROM users 
              WHERE role IN ('super_admin', 'admin', 'editor')
              ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $admins = $stmt->fetchAll();
    
    // Ne pas retourner les mots de passe
    foreach ($admins as &$admin) {
        unset($admin['password_hash']);
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $admins,
        "count" => count($admins)
    ]);
}

/**
 * Récupérer un admin spécifique
 */
function getAdmin($db, $id) {
    $query = "SELECT id, email, full_name, role, is_active, created_at, last_login 
              FROM users 
              WHERE id = :id AND role IN ('super_admin', 'admin', 'editor')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $admin = $stmt->fetch();
    
    if (!$admin) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Admin non trouvé"]);
        return;
    }
    
    unset($admin['password_hash']);
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $admin
    ]);
}

/**
 * Créer un nouvel admin
 */
function createAdmin($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['full_name'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email, mot de passe et nom complet sont requis"]);
        return;
    }
    
    // Valider le rôle (ne pas permettre de créer un super_admin)
    $role = isset($data['role']) && in_array($data['role'], ['admin', 'editor']) ? $data['role'] : 'editor';
    
    // Vérifier si l'email existe déjà
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $data['email']);
    $checkStmt->execute();
    
    if ($checkStmt->fetch()) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Cet email est déjà utilisé"]);
        return;
    }
    
    // Hasher le mot de passe
    $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
    
    $query = "INSERT INTO users (email, password_hash, full_name, role, is_active) 
              VALUES (:email, :password_hash, :full_name, :role, 1)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':password_hash', $password_hash);
    $stmt->bindParam(':full_name', $data['full_name']);
    $stmt->bindParam(':role', $role);
    
    if ($stmt->execute()) {
        $admin_id = $db->lastInsertId();
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Admin créé avec succès",
            "data" => ["id" => $admin_id]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la création de l'admin"]);
    }
}

/**
 * Mettre à jour un admin
 */
function updateAdmin($db, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID de l'admin requis"]);
        return;
    }
    
    // Ne pas permettre de modifier un super_admin (sauf si c'est soi-même)
    $checkQuery = "SELECT role FROM users WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $checkStmt->execute();
    $existing = $checkStmt->fetch();
    
    if (!$existing) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Admin non trouvé"]);
        return;
    }
    
    if ($existing['role'] === 'super_admin' && $id != $_SESSION['user_id']) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Vous ne pouvez pas modifier un super administrateur"]);
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
    
    if (isset($data['full_name'])) {
        $full_name = trim($data['full_name']);
        if (!empty($full_name)) {
            $fields[] = "full_name = :full_name";
            $params[':full_name'] = $full_name;
        }
    }
    
    if (isset($data['password']) && !empty(trim($data['password']))) {
        $fields[] = "password_hash = :password_hash";
        $params[':password_hash'] = password_hash(trim($data['password']), PASSWORD_DEFAULT);
    }
    
    if (isset($data['role']) && in_array($data['role'], ['admin', 'editor'])) {
        // Ne pas permettre de changer le rôle d'un super_admin
        if ($existing['role'] !== 'super_admin') {
            $fields[] = "role = :role";
            $params[':role'] = $data['role'];
        }
    }
    
    if (isset($data['is_active'])) {
        $fields[] = "is_active = :is_active";
        $params[':is_active'] = (bool)$data['is_active'];
    }
    
    // Toujours permettre la mise à jour si au moins un champ est fourni
    // Même si le nom est vide, on peut vouloir mettre à jour le rôle ou le mot de passe
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Aucun champ valide à mettre à jour",
            "debug" => [
                "received_data" => $data,
                "fields_count" => count($fields)
            ]
        ]);
        return;
    }
    
    $query = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = :id";
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Admin mis à jour avec succès"
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

/**
 * Supprimer un admin (soft delete)
 */
function deleteAdmin($db, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID de l'admin requis"]);
        return;
    }
    
    // Ne pas permettre de supprimer un super_admin
    $checkQuery = "SELECT role FROM users WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $checkStmt->execute();
    $existing = $checkStmt->fetch();
    
    if (!$existing) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Admin non trouvé"]);
        return;
    }
    
    if ($existing['role'] === 'super_admin') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Vous ne pouvez pas supprimer un super administrateur"]);
        return;
    }
    
    // Ne pas permettre de se supprimer soi-même
    if ($id == $_SESSION['user_id']) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Vous ne pouvez pas supprimer votre propre compte"]);
        return;
    }
    
    // Soft delete : désactiver le compte
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
            "message" => "Erreur lors de la suppression",
            "error" => $errorInfo[2] ?? "Erreur inconnue"
        ]);
    }
}

?>



