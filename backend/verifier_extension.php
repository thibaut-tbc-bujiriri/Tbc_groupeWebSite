<?php
/**
 * Script pour vérifier si l'extension PostgreSQL est activée
 * Affiche des instructions claires si elle n'est pas activée
 */

header('Content-Type: application/json; charset=UTF-8');

$extensions = get_loaded_extensions();
$pdo_pgsql_loaded = in_array('pdo_pgsql', $extensions);
$pgsql_loaded = in_array('pgsql', $extensions);

$php_ini_path = php_ini_loaded_file();
$php_ini_scanned = php_ini_scanned_files();

$result = [
    "extension_pdo_pgsql" => [
        "loaded" => $pdo_pgsql_loaded,
        "status" => $pdo_pgsql_loaded ? "✅ Activée" : "❌ Non activée"
    ],
    "extension_pgsql" => [
        "loaded" => $pgsql_loaded,
        "status" => $pgsql_loaded ? "✅ Activée" : "⚠️ Non activée (optionnelle)"
    ],
    "php_ini" => [
        "loaded_file" => $php_ini_path,
        "scanned_files" => $php_ini_scanned
    ],
    "php_version" => PHP_VERSION,
    "all_extensions" => $extensions
];

if (!$pdo_pgsql_loaded) {
    http_response_code(500);
    $result["error"] = "Extension pdo_pgsql requise mais non chargée";
    $result["solution"] = [
        "step_1" => "Ouvrez le fichier php.ini",
        "php_ini_path" => $php_ini_path,
        "step_2" => "Cherchez ces lignes (Ctrl+F) :",
        "lines_to_find" => [
            ";extension=pdo_pgsql",
            ";extension=pgsql"
        ],
        "step_3" => "Décommentez-les (enlevez le ; au début) :",
        "lines_to_uncomment" => [
            "extension=pdo_pgsql",
            "extension=pgsql"
        ],
        "step_4" => "Sauvegardez le fichier",
        "step_5" => "Redémarrez Apache dans XAMPP Control Panel",
        "step_6" => "Vérifiez avec : php -m | findstr pdo_pgsql"
    ];
    
    // Vérifier si les DLL existent
    $ext_dir = ini_get('extension_dir');
    $dll_pdo_pgsql = $ext_dir . DIRECTORY_SEPARATOR . 'php_pdo_pgsql.dll';
    $dll_pgsql = $ext_dir . DIRECTORY_SEPARATOR . 'php_pgsql.dll';
    
    $result["dll_files"] = [
        "extension_dir" => $ext_dir,
        "php_pdo_pgsql.dll" => [
            "path" => $dll_pdo_pgsql,
            "exists" => file_exists($dll_pdo_pgsql)
        ],
        "php_pgsql.dll" => [
            "path" => $dll_pgsql,
            "exists" => file_exists($dll_pgsql)
        ]
    ];
    
    if (!file_exists($dll_pdo_pgsql)) {
        $result["dll_missing"] = "Les fichiers DLL PostgreSQL ne sont pas trouvés. Vous devrez peut-être installer PostgreSQL ou télécharger les extensions PHP avec support PostgreSQL.";
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);


