<?php
/**
 * API pour les messages de contact
 */

// Désactiver l'affichage des erreurs PHP pour éviter tout output HTML
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Capturer toutes les erreurs et les retourner en JSON
set_error_handler(function($severity, $message, $file, $line) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
    }
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur",
        "error" => $message
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
        "error" => $exception->getMessage()
    ]);
    exit();
});

// Démarrer la session si elle n'est pas déjà démarrée (pour l'authentification)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Charger CORS pour définir les headers correctement
require_once '../config/cors.php';
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur de connexion à la base de données"
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

// Récupérer l'ID si présent dans l'URL (format: /api/contact/{id})
$id = extractIdFromUri('contact');

switch ($method) {
    case 'GET':
        // Récupérer les messages (avec pagination optionnelle)
        $is_read = isset($_GET['is_read']) ? (int)$_GET['is_read'] : null;
        getMessages($db, $is_read);
        break;

    case 'POST':
        // Créer un nouveau message
        createMessage($db);
        break;

    case 'PUT':
        // Marquer un message comme lu
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id']) && isset($data['action']) && $data['action'] === 'mark_read') {
            markAsRead($db, $data['id']);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Paramètres invalides"]);
        }
        break;

    case 'DELETE':
        // Supprimer un message (seulement pour super_admin)
        if ($id) {
            deleteMessage($db, $id);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du message requis"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        break;
}

/**
 * Récupérer les messages
 */
function getMessages($db, $is_read = null) {
    if ($is_read !== null) {
        $query = "SELECT * FROM contact_messages WHERE is_read = :is_read ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':is_read', $is_read, PDO::PARAM_BOOL);
    } else {
        $query = "SELECT * FROM contact_messages ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
    }
    
    $stmt->execute();
    $messages = $stmt->fetchAll();
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $messages,
        "count" => count($messages)
    ]);
}

/**
 * Créer un nouveau message
 */
function createMessage($db) {
    try {
        $rawInput = file_get_contents("php://input");
        $data = json_decode($rawInput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Format JSON invalide: " . json_last_error_msg()
            ]);
            return;
        }
        
        if (!isset($data['name']) || empty($data['name'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Le nom est requis"]);
            return;
        }
        
        if (!isset($data['email']) || empty($data['email'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "L'email est requis"]);
            return;
        }
        
        if (!isset($data['message']) || empty($data['message'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Le message est requis"]);
            return;
        }
        
        // Valider l'email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Format d'email invalide"]);
            return;
        }
        
        $query = "INSERT INTO contact_messages (name, email, message, subject, phone) 
                  VALUES (:name, :email, :message, :subject, :phone)";
        
        $stmt = $db->prepare($query);
        
        $subject = isset($data['subject']) && !empty($data['subject']) ? $data['subject'] : null;
        $phone = isset($data['phone']) && !empty($data['phone']) ? $data['phone'] : null;
        
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':message', $data['message']);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':phone', $phone);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Message envoyé avec succès"
            ]);
        } else {
            $errorInfo = $stmt->errorInfo();
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Erreur lors de l'envoi du message",
                "error" => $errorInfo[2] ?? "Erreur inconnue"
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur serveur: " . $e->getMessage()
        ]);
    }
}

/**
 * Marquer un message comme lu
 */
function markAsRead($db, $message_id) {
    $query = "UPDATE contact_messages SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $message_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Message marqué comme lu"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
    }
}

/**
 * Supprimer un message (seulement pour super_admin)
 */
function deleteMessage($db, $message_id) {
    // Vérifier que l'utilisateur est authentifié et est super_admin
    // La session a déjà été démarrée en haut du fichier
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'super_admin') {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Accès refusé. Seuls les super administrateurs peuvent supprimer des messages."
        ]);
        return;
    }
    
    // Vérifier que le message existe
    $checkQuery = "SELECT id FROM contact_messages WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $message_id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Message non trouvé"]);
        return;
    }
    
    // Supprimer le message
    $query = "DELETE FROM contact_messages WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $message_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Message supprimé avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la suppression"]);
    }
}

?>

