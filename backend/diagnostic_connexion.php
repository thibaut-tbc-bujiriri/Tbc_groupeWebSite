<?php
/**
 * Script de diagnostic complet pour la connexion Supabase
 * Affiche toutes les informations de diagnostic
 */

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagnostic Connexion Supabase</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 20px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .section {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        h2 { color: #555; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .success { color: #28a745; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .warning { color: #ffc107; font-weight: bold; }
        .info { color: #17a2b8; }
        pre {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            border-left: 4px solid #007bff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #007bff;
            color: white;
        }
        .test-result {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .test-success { background: #d4edda; border-left: 4px solid #28a745; }
        .test-error { background: #f8d7da; border-left: 4px solid #dc3545; }
        .test-warning { background: #fff3cd; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <h1>🔍 Diagnostic de Connexion Supabase</h1>
    
    <?php
    require_once __DIR__ . '/config/env.php';
    
    // Section 1: Vérification des extensions PHP
    echo '<div class="section">';
    echo '<h2>1. Extensions PHP</h2>';
    
    $extensions = get_loaded_extensions();
    $pdo_pgsql = in_array('pdo_pgsql', $extensions);
    $pgsql = in_array('pgsql', $extensions);
    
    if ($pdo_pgsql) {
        echo '<div class="test-result test-success">✅ Extension <strong>pdo_pgsql</strong> est chargée</div>';
    } else {
        echo '<div class="test-result test-error">❌ Extension <strong>pdo_pgsql</strong> n\'est PAS chargée</div>';
        echo '<div class="warning">⚠️ Action requise : Activez l\'extension dans php.ini</div>';
        echo '<pre>; Dans php.ini, décommentez :
extension=pdo_pgsql
extension=pgsql

Puis redémarrez Apache</pre>';
    }
    
    if ($pgsql) {
        echo '<div class="test-result test-success">✅ Extension <strong>pgsql</strong> est chargée</div>';
    } else {
        echo '<div class="test-result test-warning">⚠️ Extension <strong>pgsql</strong> n\'est pas chargée (optionnelle)</div>';
    }
    echo '</div>';
    
    // Section 2: Configuration
    echo '<div class="section">';
    echo '<h2>2. Configuration</h2>';
    
    $host = getenv('DB_HOST');
    $port = getenv('DB_PORT');
    $db_name = getenv('DB_NAME');
    $username = getenv('DB_USER');
    $password = getenv('DB_PASSWORD');
    
    echo '<table>';
    echo '<tr><th>Paramètre</th><th>Valeur</th><th>Statut</th></tr>';
    echo '<tr><td>Host</td><td>' . htmlspecialchars($host) . '</td><td>' . ($host ? '✅' : '❌') . '</td></tr>';
    echo '<tr><td>Port</td><td>' . htmlspecialchars($port) . '</td><td>' . ($port ? '✅' : '❌') . '</td></tr>';
    echo '<tr><td>Database</td><td>' . htmlspecialchars($db_name) . '</td><td>' . ($db_name ? '✅' : '❌') . '</td></tr>';
    echo '<tr><td>Username</td><td>' . htmlspecialchars($username) . '</td><td>' . ($username ? '✅' : '❌') . '</td></tr>';
    echo '<tr><td>Password</td><td>' . str_repeat('*', strlen($password)) . ' (' . strlen($password) . ' caractères)</td><td>' . ($password ? '✅' : '❌') . '</td></tr>';
    echo '</table>';
    echo '</div>';
    
    // Section 3: Test de connexion
    echo '<div class="section">';
    echo '<h2>3. Test de Connexion</h2>';
    
    if (!$pdo_pgsql) {
        echo '<div class="test-result test-error">❌ Impossible de tester la connexion : Extension pdo_pgsql non chargée</div>';
    } else {
        try {
            // Test avec sslmode=require
            echo '<h3>Test 1 : Connexion avec SSL (sslmode=require)</h3>';
            $dsn1 = "pgsql:host=$host;port=$port;dbname=$db_name;sslmode=require";
            $pdo1 = new PDO($dsn1, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            echo '<div class="test-result test-success">✅ Connexion réussie avec SSL</div>';
            
            // Test de requête
            $stmt = $pdo1->query("SELECT version()");
            $version = $stmt->fetchColumn();
            echo '<div class="info">Version PostgreSQL : ' . htmlspecialchars($version) . '</div>';
            
            // Vérifier les tables
            $stmt = $pdo1->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            echo '<h3>Tables trouvées (' . count($tables) . ')</h3>';
            if (count($tables) > 0) {
                echo '<ul>';
                foreach ($tables as $table) {
                    echo '<li>' . htmlspecialchars($table) . '</li>';
                }
                echo '</ul>';
            } else {
                echo '<div class="test-result test-warning">⚠️ Aucune table trouvée. Exécutez le script SQL dans Supabase.</div>';
            }
            
            // Vérifier la table users
            if (in_array('users', $tables)) {
                $stmt = $pdo1->query("SELECT COUNT(*) FROM users");
                $userCount = $stmt->fetchColumn();
                echo '<div class="test-result test-success">✅ Table users existe (' . $userCount . ' utilisateur(s))</div>';
                
                // Vérifier le type ENUM
                $stmt = $pdo1->query("SELECT unnest(enum_range(NULL::user_role))::text AS role_value");
                $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);
                echo '<div class="info">Rôles disponibles : ' . implode(', ', $roles) . '</div>';
                
                if (in_array('super_admin', $roles)) {
                    echo '<div class="test-result test-success">✅ Le rôle super_admin existe</div>';
                } else {
                    echo '<div class="test-result test-error">❌ Le rôle super_admin n\'existe pas</div>';
                    echo '<pre>ALTER TYPE user_role ADD VALUE IF NOT EXISTS \'super_admin\';</pre>';
                }
            } else {
                echo '<div class="test-result test-error">❌ Table users n\'existe pas</div>';
                echo '<div class="warning">⚠️ Exécutez le script migration_complete_supabase.sql dans Supabase</div>';
            }
            
        } catch (PDOException $e) {
            echo '<div class="test-result test-error">❌ Erreur de connexion avec SSL</div>';
            echo '<pre>Erreur : ' . htmlspecialchars($e->getMessage()) . '
Code : ' . $e->getCode() . '</pre>';
            
            // Test sans SSL
            echo '<h3>Test 2 : Connexion sans SSL (sslmode=prefer)</h3>';
            try {
                $dsn2 = "pgsql:host=$host;port=$port;dbname=$db_name;sslmode=prefer";
                $pdo2 = new PDO($dsn2, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                echo '<div class="test-result test-success">✅ Connexion réussie sans SSL (utilisez sslmode=prefer)</div>';
                echo '<div class="warning">⚠️ Note : Supabase recommande SSL, mais la connexion fonctionne sans</div>';
            } catch (PDOException $e2) {
                echo '<div class="test-result test-error">❌ Erreur de connexion sans SSL aussi</div>';
                echo '<pre>Erreur : ' . htmlspecialchars($e2->getMessage()) . '
Code : ' . $e2->getCode() . '</pre>';
            }
        }
    }
    echo '</div>';
    
    // Section 4: Recommandations
    echo '<div class="section">';
    echo '<h2>4. Recommandations</h2>';
    echo '<ul>';
    
    if (!$pdo_pgsql) {
        echo '<li class="error">❌ <strong>URGENT</strong> : Activez l\'extension pdo_pgsql dans php.ini</li>';
    }
    
    if (empty($host) || empty($username) || empty($password)) {
        echo '<li class="error">❌ Vérifiez que tous les identifiants sont configurés dans env.local.php</li>';
    }
    
    if (!isset($tables) || count($tables) === 0) {
        echo '<li class="warning">⚠️ Exécutez le script migration_complete_supabase.sql dans Supabase SQL Editor</li>';
    }
    
    if (isset($tables) && !in_array('users', $tables)) {
        echo '<li class="error">❌ La table users n\'existe pas. Exécutez le script de migration.</li>';
    }
    
    echo '</ul>';
    echo '</div>';
    ?>
    
</body>
</html>


