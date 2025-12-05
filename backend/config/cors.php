<?php
/**
 * Configuration CORS pour permettre les requêtes depuis React
 */

// Définir les headers CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true"); // Important pour les sessions
header("Access-Control-Max-Age: 3600");

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Pour les autres requêtes, définir Content-Type
header("Content-Type: application/json; charset=UTF-8");

?>

