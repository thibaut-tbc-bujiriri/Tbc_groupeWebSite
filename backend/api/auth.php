<?php
/**
 * API pour l'authentification
 */

// Activer l'affichage des erreurs pour le débogage (désactiver en production)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Logger les erreurs pour le débogage
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');

// Gestionnaire d'erreurs global
set_error_handler(function($severity, $message, $file, $line) {
    if (error_reporting() & $severity) {
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
        exit;
    }
    return false;
});

// Gestionnaire d'exceptions global
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
    exit;
});

// Charger CORS en premier
require_once '../config/cors.php';

// Ensuite démarrer la session
session_start();

try {
    require_once '../config/database.php';
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    // Logger l'erreur
    error_log("Auth API - Erreur de connexion DB: " . $e->getMessage());
    
    // S'assurer que les headers sont envoyés avant le JSON
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
    }
    
    echo json_encode([
        "success" => false,
        "message" => "Erreur de connexion à la base de données Supabase",
        "error" => $e->getMessage(),
        "debug" => [
            "file" => basename($e->getFile()),
            "line" => $e->getLine()
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

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
        if (!headers_sent()) {
            http_response_code(400);
            header('Content-Type: application/json; charset=UTF-8');
        }
        echo json_encode(["success" => false, "message" => "Email et mot de passe requis"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        $query = "SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $data['email']);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Auth API - Erreur SQL: " . $e->getMessage());
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
        }
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la recherche de l'utilisateur",
            "error" => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    if (!$user) {
        if (!headers_sent()) {
            http_response_code(401);
            header('Content-Type: application/json; charset=UTF-8');
        }
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    if (!$user['is_active']) {
        if (!headers_sent()) {
            http_response_code(403);
            header('Content-Type: application/json; charset=UTF-8');
        }
        echo json_encode(["success" => false, "message" => "Compte désactivé"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    // Vérifier le mot de passe
    if (!password_verify($data['password'], $user['password_hash'])) {
        if (!headers_sent()) {
            http_response_code(401);
            header('Content-Type: application/json; charset=UTF-8');
        }
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    // Mettre à jour la dernière connexion
    try {
        $update_query = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = :id";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(':id', $user['id'], PDO::PARAM_INT);
        $update_stmt->execute();
    } catch (PDOException $e) {
        // Logger l'erreur mais ne pas bloquer la connexion
        error_log("Auth API - Erreur lors de la mise à jour last_login: " . $e->getMessage());
    }
    
    // Générer un token simple (en production, utilisez JWT)
    $token = bin2hex(random_bytes(32));
    
    // Stocker le token (simplifié - en production, utilisez une table de sessions)
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['token'] = $token;
    
    if (!headers_sent()) {
        http_response_code(200);
        header('Content-Type: application/json; charset=UTF-8');
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Connexion réussie",
        "data" => [
            "token" => $token,
            "user" => [
                "id" => (int)$user['id'],
                "email" => $user['email'],
                "full_name" => $user['full_name'],
                "role" => $user['role']
            ]
        ]
    ], JSON_UNESCAPED_UNICODE);
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

