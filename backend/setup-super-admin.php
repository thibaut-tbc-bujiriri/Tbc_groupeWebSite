<?php
/**
 * Script pour configurer le super admin
 * Vérifie et crée/met à jour le compte super admin
 */

header('Content-Type: text/html; charset=UTF-8');

require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

$email = 'thibauttbcbujiriri@gmail.com';
$password = 'thib@.32a';
$full_name = 'Thibaut Tbc Bujiriri';

echo "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Configuration Super Admin</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; padding: 10px; background: #e8f5e9; border-left: 4px solid green; margin: 10px 0; }
        .error { color: red; padding: 10px; background: #ffebee; border-left: 4px solid red; margin: 10px 0; }
        .info { color: blue; padding: 10px; background: #e3f2fd; border-left: 4px solid blue; margin: 10px 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🔐 Configuration du Super Admin</h1>
";

try {
    // Vérifier si l'utilisateur existe
    $checkQuery = "SELECT id, email, full_name, role, password_hash FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    $existing = $checkStmt->fetch();

    if ($existing) {
        echo "<div class='info'><strong>✓ Utilisateur trouvé :</strong> ID = {$existing['id']}</div>";
        echo "<div class='info'>Rôle actuel : <strong>{$existing['role']}</strong></div>";
        
        // Vérifier le mot de passe
        $passwordValid = password_verify($password, $existing['password_hash']);
        
        if ($passwordValid) {
            echo "<div class='success'>✓ Le mot de passe est correct !</div>";
        } else {
            echo "<div class='error'>✗ Le mot de passe actuel ne correspond pas. Génération d'un nouveau hash...</div>";
            
            // Générer un nouveau hash
            $newHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Mettre à jour le mot de passe et le rôle
            $updateQuery = "UPDATE users SET 
                            password_hash = :password_hash,
                            role = 'super_admin',
                            full_name = :full_name,
                            is_active = 1
                            WHERE email = :email";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':password_hash', $newHash);
            $updateStmt->bindParam(':full_name', $full_name);
            $updateStmt->bindParam(':email', $email);
            
            if ($updateStmt->execute()) {
                echo "<div class='success'>✓ Mot de passe et rôle mis à jour avec succès !</div>";
            } else {
                echo "<div class='error'>✗ Erreur lors de la mise à jour : " . print_r($updateStmt->errorInfo(), true) . "</div>";
            }
        }
        
        // Mettre à jour le rôle en super_admin si ce n'est pas déjà le cas
        if ($existing['role'] !== 'super_admin') {
            $roleQuery = "UPDATE users SET role = 'super_admin' WHERE email = :email";
            $roleStmt = $db->prepare($roleQuery);
            $roleStmt->bindParam(':email', $email);
            
            if ($roleStmt->execute()) {
                echo "<div class='success'>✓ Rôle mis à jour en 'super_admin'</div>";
            }
        }
    } else {
        echo "<div class='info'>Utilisateur non trouvé. Création du compte super admin...</div>";
        
        // Créer l'utilisateur
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        $insertQuery = "INSERT INTO users (email, password_hash, full_name, role, is_active) 
                        VALUES (:email, :password_hash, :full_name, 'super_admin', 1)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':email', $email);
        $insertStmt->bindParam(':password_hash', $passwordHash);
        $insertStmt->bindParam(':full_name', $full_name);
        
        if ($insertStmt->execute()) {
            $newId = $db->lastInsertId();
            echo "<div class='success'>✓ Compte super admin créé avec succès ! ID = {$newId}</div>";
        } else {
            echo "<div class='error'>✗ Erreur lors de la création : " . print_r($insertStmt->errorInfo(), true) . "</div>";
        }
    }
    
    // Afficher les informations finales
    $finalQuery = "SELECT id, email, full_name, role, is_active FROM users WHERE email = :email";
    $finalStmt = $db->prepare($finalQuery);
    $finalStmt->bindParam(':email', $email);
    $finalStmt->execute();
    $final = $finalStmt->fetch();
    
    echo "<hr>";
    echo "<h2>📋 Informations finales du compte :</h2>";
    echo "<pre>";
    print_r($final);
    echo "</pre>";
    
    echo "<div class='info'><strong>Identifiants de connexion :</strong></div>";
    echo "<pre>";
    echo "Email: {$email}\n";
    echo "Mot de passe: {$password}\n";
    echo "</pre>";
    
    // Vérifier la structure de la table
    echo "<hr>";
    echo "<h2>🔍 Vérification de la structure :</h2>";
    $structureQuery = "SHOW COLUMNS FROM users LIKE 'role'";
    $structureStmt = $db->prepare($structureQuery);
    $structureStmt->execute();
    $roleColumn = $structureStmt->fetch();
    
    if ($roleColumn) {
        echo "<div class='info'>Structure de la colonne 'role' :</div>";
        echo "<pre>" . print_r($roleColumn, true) . "</pre>";
        
        if (strpos($roleColumn['Type'], 'super_admin') === false) {
            echo "<div class='error'>⚠️ ATTENTION : La colonne 'role' ne contient pas 'super_admin'. Vous devez exécuter le script update_roles.sql</div>";
            echo "<div class='info'>Commande SQL à exécuter :</div>";
            echo "<pre>ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor';</pre>";
        } else {
            echo "<div class='success'>✓ La colonne 'role' supporte 'super_admin'</div>";
        }
    }
    
    echo "<hr>";
    echo "<h2>✅ Configuration terminée !</h2>";
    echo "<p>Vous pouvez maintenant tester la connexion avec :</p>";
    echo "<ul>";
    echo "<li><strong>Email :</strong> {$email}</li>";
    echo "<li><strong>Mot de passe :</strong> {$password}</li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<div class='error'>✗ Erreur : " . $e->getMessage() . "</div>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

echo "</body></html>";
?>

