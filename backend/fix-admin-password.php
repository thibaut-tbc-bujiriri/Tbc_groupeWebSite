<?php
/**
 * Script pour corriger le mot de passe et le rôle du super admin
 */

header('Content-Type: text/html; charset=UTF-8');

require_once 'config/database.php';

$email = 'thibauttbcbujiriri@gmail.com';
$password = 'thib@.32a';
$full_name = 'Thibaut Tbc Bujiriri';

echo "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Correction du mot de passe Admin</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .success { color: green; padding: 15px; background: #e8f5e9; border-left: 4px solid green; margin: 15px 0; border-radius: 4px; }
        .error { color: red; padding: 15px; background: #ffebee; border-left: 4px solid red; margin: 15px 0; border-radius: 4px; }
        .info { color: blue; padding: 15px; background: #e3f2fd; border-left: 4px solid blue; margin: 15px 0; border-radius: 4px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; border: 1px solid #ddd; }
        h1 { color: #333; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class='container'>
    <h1>🔐 Correction du Mot de Passe Super Admin</h1>
";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "<div class='info'><strong>✓ Connexion à la base de données réussie</strong></div>";
    
    // Générer le hash du mot de passe
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    echo "<div class='info'>Hash généré : <code>" . substr($passwordHash, 0, 30) . "...</code></div>";
    
    // Vérifier si l'utilisateur existe
    $checkQuery = "SELECT id, email, full_name, role, is_active FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    $existing = $checkStmt->fetch();
    
    if ($existing) {
        echo "<div class='info'><strong>✓ Utilisateur trouvé</strong> (ID: {$existing['id']})</div>";
        
        // Mettre à jour le mot de passe, le rôle et le nom
        $updateQuery = "UPDATE users SET 
                        password_hash = :password_hash,
                        role = 'super_admin',
                        full_name = :full_name,
                        is_active = 1
                        WHERE email = :email";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':password_hash', $passwordHash);
        $updateStmt->bindParam(':full_name', $full_name);
        $updateStmt->bindParam(':email', $email);
        
        if ($updateStmt->execute()) {
            echo "<div class='success'><strong>✅ Succès !</strong> Le mot de passe et le rôle ont été mis à jour.</div>";
        } else {
            $error = $updateStmt->errorInfo();
            echo "<div class='error'><strong>✗ Erreur lors de la mise à jour :</strong> " . print_r($error, true) . "</div>";
        }
    } else {
        echo "<div class='info'>Utilisateur non trouvé. Création du compte...</div>";
        
        // Créer l'utilisateur
        $insertQuery = "INSERT INTO users (email, password_hash, full_name, role, is_active) 
                        VALUES (:email, :password_hash, :full_name, 'super_admin', 1)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':email', $email);
        $insertStmt->bindParam(':password_hash', $passwordHash);
        $insertStmt->bindParam(':full_name', $full_name);
        
        if ($insertStmt->execute()) {
            $newId = $db->lastInsertId();
            echo "<div class='success'><strong>✅ Succès !</strong> Compte créé avec l'ID: {$newId}</div>";
        } else {
            $error = $insertStmt->errorInfo();
            echo "<div class='error'><strong>✗ Erreur lors de la création :</strong> " . print_r($error, true) . "</div>";
        }
    }
    
    // Afficher les informations finales
    $finalQuery = "SELECT id, email, full_name, role, is_active FROM users WHERE email = :email";
    $finalStmt = $db->prepare($finalQuery);
    $finalStmt->bindParam(':email', $email);
    $finalStmt->execute();
    $final = $finalStmt->fetch();
    
    echo "<hr style='margin: 30px 0; border: none; border-top: 2px solid #eee;'>";
    echo "<h2>📋 Informations du compte :</h2>";
    echo "<pre>";
    echo "ID           : " . ($final['id'] ?? 'N/A') . "\n";
    echo "Email        : " . ($final['email'] ?? 'N/A') . "\n";
    echo "Nom          : " . ($final['full_name'] ?? 'N/A') . "\n";
    echo "Rôle         : " . ($final['role'] ?? 'N/A') . "\n";
    echo "Actif        : " . (($final['is_active'] ?? false) ? 'Oui' : 'Non') . "\n";
    echo "</pre>";
    
    // Vérifier que le mot de passe fonctionne
    $testQuery = "SELECT password_hash FROM users WHERE email = :email";
    $testStmt = $db->prepare($testQuery);
    $testStmt->bindParam(':email', $email);
    $testStmt->execute();
    $testUser = $testStmt->fetch();
    
    if ($testUser && password_verify($password, $testUser['password_hash'])) {
        echo "<div class='success'><strong>✅ Vérification réussie !</strong> Le mot de passe fonctionne correctement.</div>";
    } else {
        echo "<div class='error'><strong>✗ Problème :</strong> Le mot de passe ne fonctionne pas. Réessayez.</div>";
    }
    
    // Vérifier la structure de la table
    echo "<hr style='margin: 30px 0; border: none; border-top: 2px solid #eee;'>";
    echo "<h2>🔍 Vérification de la structure :</h2>";
    
    $structureQuery = "SHOW COLUMNS FROM users WHERE Field = 'role'";
    $structureStmt = $db->prepare($structureQuery);
    $structureStmt->execute();
    $roleColumn = $structureStmt->fetch();
    
    if ($roleColumn) {
        if (strpos($roleColumn['Type'], 'super_admin') === false) {
            echo "<div class='error'><strong>⚠️ ATTENTION :</strong> La colonne 'role' ne supporte pas 'super_admin'.</div>";
            echo "<div class='info'><strong>Solution :</strong> Exécutez ce SQL dans phpMyAdmin :</div>";
            echo "<pre>ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor';</pre>";
            echo "<div class='info'>Puis rechargez cette page pour continuer.</div>";
        } else {
            echo "<div class='success'><strong>✅ Structure correcte</strong> : La colonne 'role' supporte 'super_admin'</div>";
        }
    }
    
    echo "<hr style='margin: 30px 0; border: none; border-top: 2px solid #eee;'>";
    echo "<h2>🎯 Prochaines étapes :</h2>";
    echo "<ol style='line-height: 2;'>";
    echo "<li>Si la structure de la table était incorrecte, exécutez la commande SQL ci-dessus dans phpMyAdmin</li>";
    echo "<li>Rechargez cette page pour vérifier</li>";
    echo "<li>Allez sur <a href='../src/pages/Login.jsx' target='_blank'>la page de login</a> (ou <code>http://localhost:5173/login</code>)</li>";
    echo "<li>Connectez-vous avec :<br>";
    echo "   <strong>Email :</strong> <code>{$email}</code><br>";
    echo "   <strong>Mot de passe :</strong> <code>{$password}</code></li>";
    echo "</ol>";
    
    echo "<div class='success' style='margin-top: 30px; text-align: center; font-size: 18px;'><strong>✅ Configuration terminée !</strong></div>";
    
} catch (Exception $e) {
    echo "<div class='error'><strong>✗ Erreur :</strong> " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

echo "</div></body></html>";
?>

