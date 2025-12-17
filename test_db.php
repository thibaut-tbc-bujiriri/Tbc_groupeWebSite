<?php
// Script de diagnostic de connexion
header('Content-Type: text/plain');

require_once __DIR__ . '/backend/config/env.php';

echo "--- test_db.php ---\n";

// 1. Check Extensions
echo "Checking PHP Extensions...\n";
$extensions = get_loaded_extensions();
if (!in_array('pdo_pgsql', $extensions)) {
    echo "ERROR: 'pdo_pgsql' extension is NOT loaded!\n";
    echo "This is required for Supabase (PostgreSQL).\n";
    echo "Please edit your php.ini file and uncomment: extension=pdo_pgsql\n";
} else {
    echo "OK: 'pdo_pgsql' extension is loaded.\n";
}

if (!in_array('pgsql', $extensions)) {
    echo "WARNING: 'pgsql' extension is NOT loaded (might be needed for some functions).\n";
}

// 2. Dump Config (Masked Password)
$host = getenv('DB_HOST');
$port = getenv('DB_PORT');
$db = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASSWORD');

echo "\nConfiguration:\n";
echo "Host: " . $host . "\n";
echo "Port: " . $port . "\n";
echo "DB: " . $db . "\n";
echo "User: " . $user . "\n";
echo "Pass: " . str_repeat('*', strlen($pass)) . " (Length: " . strlen($pass) . ")\n";

// 3. Attempt Connection
echo "\nAttempting Connection...\n";
try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$db";
    // Add sslmode=require for Supabase
    $dsn .= ";sslmode=require"; 
    
    echo "DSN: $dsn\n";
    
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "SUCCESS: Connected to database successfully!\n";
    
    $stmt = $pdo->query("SELECT version()");
    $version = $stmt->fetchColumn();
    echo "DB Version: " . $version . "\n";
    
} catch (PDOException $e) {
    echo "FAILURE: Connection failed!\n";
    echo "Error Message: " . $e->getMessage() . "\n";
    echo "Error Code: " . $e->getCode() . "\n";
}
?>
