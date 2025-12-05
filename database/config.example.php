<?php
/**
 * Configuration de connexion à la base de données
 * 
 * IMPORTANT: Renommez ce fichier en config.php et remplissez les informations
 * Ne commitez JAMAIS le fichier config.php avec vos identifiants réels
 */

return [
    'host' => 'localhost',
    'database' => 'tbc_groupe',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
];

