<?php
/**
 * Script de test pour l'API d'authentification
 * Teste la connexion à Supabase et la requête de login
 */

// Activer l'affichage des erreurs pour le débogage
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

header('Content-Type: text/html; charset=UTF-8');

echo "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Test Auth API</title>";
echo "<style>body{font-family:Arial;margin:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} pre{background:#f5f5f5;padding:10px;border-radius:5px;}</style></head><body>";
echo "<h1>🔍 Test de l'API d'authentification</h1>";

// Test 1: Vérifier les extensions PHP
echo "<h2>1. Vérification des extensions PHP</h2>";
$extensions = get_loaded_extensions();
if (in_array('pdo_pgsql', $extensions)) {
    echo "<div class='success'>✅ Extension pdo_pgsql chargée</div>";
} else {
    echo "<div class='error'>❌ Extension pdo_pgsql NON chargée - Activez-la dans php.ini</div>";
}

// Test 2: Vérifier la connexion à la base de données
echo "<h2>2. Test de connexion à Supabase</h2>";
try {
    require_once '../config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    echo "<div class='success'>✅ Connexion à Supabase réussie</div>";
    
    // Test 3: Vérifier la structure de la table users
    echo "<h2>3. Vérification de la table users</h2>";
    $stmt = $db->query("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' cellpadding='5'><tr><th>Colonne</th><th>Type</th></tr>";
    foreach ($columns as $col) {
        echo "<tr><td>{$col['column_name']}</td><td>{$col['data_type']} ({$col['udt_name']})</td></tr>";
    }
    echo "</table>";
    
    // Test 4: Vérifier le type ENUM pour role
    echo "<h2>4. Vérification du type ENUM 'user_role'</h2>";
    $stmt = $db->query("SELECT unnest(enum_range(NULL::user_role))::text AS role_value");
    $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<div class='info'>Rôles disponibles dans l'ENUM: " . implode(', ', $roles) . "</div>";
    
    if (in_array('super_admin', $roles)) {
        echo "<div class='success'>✅ Le rôle 'super_admin' est disponible</div>";
    } else {
        echo "<div class='error'>❌ Le rôle 'super_admin' n'est PAS disponible dans l'ENUM</div>";
        echo "<div class='info'>Vous devez exécuter cette commande SQL dans Supabase :</div>";
        echo "<pre>ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';</pre>";
    }
    
    // Test 5: Vérifier si des utilisateurs existent
    echo "<h2>5. Vérification des utilisateurs</h2>";
    $stmt = $db->query("SELECT id, email, full_name, role, is_active FROM users LIMIT 5");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) > 0) {
        echo "<div class='success'>✅ " . count($users) . " utilisateur(s) trouvé(s)</div>";
        echo "<table border='1' cellpadding='5'><tr><th>ID</th><th>Email</th><th>Nom</th><th>Rôle</th><th>Actif</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['email']}</td>";
            echo "<td>{$user['full_name']}</td>";
            echo "<td>{$user['role']}</td>";
            echo "<td>" . ($user['is_active'] ? 'Oui' : 'Non') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<div class='error'>❌ Aucun utilisateur trouvé dans la table users</div>";
    }
    
    // Test 6: Simuler une requête de login
    echo "<h2>6. Test de requête SELECT pour login</h2>";
    $testEmail = 'thibauttbcbujiriri@gmail.com';
    $query = "SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $testEmail);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "<div class='success'>✅ Utilisateur trouvé avec l'email: {$testEmail}</div>";
        echo "<div class='info'>Rôle: {$user['role']}</div>";
        echo "<div class='info'>Actif: " . ($user['is_active'] ? 'Oui' : 'Non') . "</div>";
    } else {
        echo "<div class='error'>❌ Aucun utilisateur trouvé avec l'email: {$testEmail}</div>";
    }
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Erreur: " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<div class='error'>Fichier: " . htmlspecialchars($e->getFile()) . "</div>";
    echo "<div class='error'>Ligne: " . $e->getLine() . "</div>";
}

// Test 7: Vérifier les headers CORS
echo "<h2>7. Vérification CORS</h2>";
echo "<div class='info'>Les headers CORS sont configurés dans config/cors.php</div>";

echo "</body></html>";
?>


