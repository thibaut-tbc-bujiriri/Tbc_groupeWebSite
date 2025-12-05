<?php
/**
 * API pour l'authentification
 */

// Charger CORS en premier
require_once '../config/cors.php';

// Ensuite démarrer la session
session_start();

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['action'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Action requise"]);
            exit();
        }
        
        if ($data['action'] === 'login') {
            login($db, $data);
        } elseif ($data['action'] === 'verify') {
            verifyToken($db, $data);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Action invalide"]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        break;
}

/**
 * Connexion utilisateur
 */
function login($db, $data) {
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email et mot de passe requis"]);
        return;
    }
    
    $query = "SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data['email']);
    $stmt->execute();
    
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect"]);
        return;
    }
    
    if (!$user['is_active']) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Compte désactivé"]);
        return;
    }
    
    // Vérifier le mot de passe
    if (!password_verify($data['password'], $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect"]);
        return;
    }
    
    // Mettre à jour la dernière connexion
    $update_query = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = :id";
    $update_stmt = $db->prepare($update_query);
    $update_stmt->bindParam(':id', $user['id'], PDO::PARAM_INT);
    $update_stmt->execute();
    
    // Générer un token simple (en production, utilisez JWT)
    $token = bin2hex(random_bytes(32));
    
    // Stocker le token (simplifié - en production, utilisez une table de sessions)
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['token'] = $token;
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Connexion réussie",
        "data" => [
            "token" => $token,
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "full_name" => $user['full_name'],
                "role" => $user['role']
            ]
        ]
    ]);
}

/**
 * Vérifier un token (simplifié)
 */
function verifyToken($db, $data) {
    // En production, vérifiez le token dans une table de sessions
    if (isset($_SESSION['token']) && isset($data['token']) && $_SESSION['token'] === $data['token']) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "authenticated" => true
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "authenticated" => false
        ]);
    }
}

?>

