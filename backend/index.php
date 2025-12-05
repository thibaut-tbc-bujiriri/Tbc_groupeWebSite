<?php
/**
 * Point d'entrée principal de l'API
 * Tbc Groupe - Backend PHP
 */

// Démarrer la session pour l'authentification
session_start();

// Inclure la configuration CORS
require_once 'config/cors.php';

// Routeur simple
$request_uri = $_SERVER['REQUEST_URI'];
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));

// Déterminer le endpoint
$endpoint = $uri_parts[1] ?? '';

switch ($endpoint) {
    case 'api':
        $resource = $uri_parts[2] ?? '';
        
        switch ($resource) {
            case 'trainers':
                require_once 'api/trainers.php';
                break;
            case 'auth':
                require_once 'api/auth.php';
                break;
            case 'contact':
                require_once 'api/contact.php';
                break;
            case 'services':
                require_once 'api/services.php';
                break;
            case 'portfolio':
                require_once 'api/portfolio.php';
                break;
            case 'training-programs':
                require_once 'api/training-programs.php';
                break;
            case 'settings':
                require_once 'api/settings.php';
                break;
            case 'admins':
                require_once 'api/admins.php';
                break;
            default:
                http_response_code(404);
                echo json_encode([
                    "success" => false,
                    "message" => "Endpoint non trouvé"
                ]);
                break;
        }
        break;
        
    default:
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "API Tbc Groupe - Backend PHP",
            "version" => "1.0",
            "endpoints" => [
                "/api/trainers - Gestion des formateurs",
                "/api/auth - Authentification",
                "/api/contact - Messages de contact",
                "/api/services - Services de l'entreprise",
                "/api/portfolio - Gestion du portfolio",
                "/api/training-programs - Programmes de formation",
                "/api/settings - Paramètres du site",
                "/api/admins - Gestion des administrateurs (super_admin seulement)"
            ]
        ]);
        break;
}

?>

