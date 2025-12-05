<?php
/**
 * Script pour vérifier et corriger le compte admin
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
    <title>Vérification Compte Admin</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; padding: 20px; background: #f0f0f0; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .success { color: #2e7d32; padding: 15px; background: #e8f5e9; border-left: 4px solid #4caf50; margin: 10px 0; border-radius: 4px; }
        .error { color: #c62828; padding: 15px; background: #ffebee; border-left: 4px solid #f44336; margin: 10px 0; border-radius: 4px; }
        .info { color: #1565c0; padding: 15px; background: #e3f2fd; border-left: 4px solid #2196f3; margin: 10px 0; border-radius: 4px; }
        .warning { color: #f57c00; padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; margin: 10px 0; border-radius: 4px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; border: 1px solid #ddd; font-size: 13px; }
        h1 { color: #333; border-bottom: 3px solid #2196f3; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
        .btn { display: inline-block; padding: 10px 20px; background: #2196f3; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .btn:hover { background: #1976d2; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        table td, table th { padding: 10px; border: 1px solid #ddd; text-align: left; }
        table th { background: #f5f5f5; font-weight: bold; }
    </style>
</head>
<body>
    <div class='container'>
    <h1>🔍 Vérification et Correction du Compte Admin</h1>
";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "<div class='success'><strong>✓ Connexion à la base de données réussie</strong></div>";
    
    // Vérifier la structure de la table
    echo "<h2>1️⃣ Vérification de la structure de la table</h2>";
    $structureQuery = "SHOW COLUMNS FROM users WHERE Field = 'role'";
    $structureStmt = $db->prepare($structureQuery);
    $structureStmt->execute();
    $roleColumn = $structureStmt->fetch();
    
    if ($roleColumn) {
        echo "<div class='info'>Structure actuelle de la colonne 'role' : <code>{$roleColumn['Type']}</code></div>";
        
        if (strpos($roleColumn['Type'], 'super_admin') !== false) {
            echo "<div class='success'><strong>✅ Parfait !</strong> La colonne 'role' supporte 'super_admin'</div>";
        } else {
            echo "<div class='error'><strong>⚠️ Problème détecté :</strong> La colonne 'role' ne supporte pas 'super_admin'</div>";
            echo "<div class='info'><strong>Action requise :</strong> Exécutez ce SQL dans phpMyAdmin :</div>";
            echo "<pre>USE tbc_groupe;\n\nALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor';</pre>";
            echo "<div class='warning'>⏸️ Arrêtez-vous ici, exécutez la commande SQL, puis rechargez cette page.</div>";
            echo "</div></body></html>";
            exit();
        }
    } else {
        echo "<div class='error'>✗ Impossible de vérifier la structure de la table</div>";
    }
    
    // Vérifier si l'utilisateur existe
    echo "<h2>2️⃣ Vérification du compte utilisateur</h2>";
    $checkQuery = "SELECT id, email, full_name, role, is_active, password_hash FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    $existing = $checkStmt->fetch();
    
    if (!$existing) {
        echo "<div class='warning'><strong>⚠️ Compte non trouvé</strong> : Le compte n'existe pas dans la base de données.</div>";
        echo "<div class='info'>Création du compte...</div>";
        
        // Générer le hash du mot de passe
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // Créer l'utilisateur
        $insertQuery = "INSERT INTO users (email, password_hash, full_name, role, is_active) 
                        VALUES (:email, :password_hash, :full_name, 'super_admin', 1)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':email', $email);
        $insertStmt->bindParam(':password_hash', $passwordHash);
        $insertStmt->bindParam(':full_name', $full_name);
        
        if ($insertStmt->execute()) {
            $newId = $db->lastInsertId();
            echo "<div class='success'><strong>✅ Compte créé avec succès !</strong> ID: {$newId}</div>";
            $existing = ['id' => $newId, 'email' => $email, 'full_name' => $full_name, 'role' => 'super_admin', 'is_active' => 1];
        } else {
            $error = $insertStmt->errorInfo();
            echo "<div class='error'><strong>✗ Erreur lors de la création :</strong></div>";
            echo "<pre>" . print_r($error, true) . "</pre>";
            echo "</div></body></html>";
            exit();
        }
    } else {
        echo "<div class='info'><strong>✓ Compte trouvé</strong> (ID: {$existing['id']})</div>";
        
        // Afficher les informations actuelles
        echo "<table>";
        echo "<tr><th>Champ</th><th>Valeur actuelle</th></tr>";
        echo "<tr><td>ID</td><td>{$existing['id']}</td></tr>";
        echo "<tr><td>Email</td><td>{$existing['email']}</td></tr>";
        echo "<tr><td>Nom complet</td><td>{$existing['full_name']}</td></tr>";
        echo "<tr><td>Rôle</td><td><strong>{$existing['role']}</strong></td></tr>";
        echo "<tr><td>Actif</td><td>" . ($existing['is_active'] ? 'Oui' : 'Non') . "</td></tr>";
        echo "<tr><td>Hash du mot de passe</td><td><code>" . substr($existing['password_hash'], 0, 30) . "...</code></td></tr>";
        echo "</table>";
    }
    
    // Vérifier le mot de passe
    echo "<h2>3️⃣ Vérification du mot de passe</h2>";
    if ($existing && isset($existing['password_hash'])) {
        $passwordValid = password_verify($password, $existing['password_hash']);
        
        if ($passwordValid) {
            echo "<div class='success'><strong>✅ Le mot de passe est correct !</strong></div>";
        } else {
            echo "<div class='error'><strong>✗ Le mot de passe ne correspond pas au hash stocké</strong></div>";
            echo "<div class='info'>Génération d'un nouveau hash et mise à jour du compte...</div>";
            
            // Générer un nouveau hash
            $newPasswordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Mettre à jour le compte
            $updateQuery = "UPDATE users SET 
                            password_hash = :password_hash,
                            role = 'super_admin',
                            full_name = :full_name,
                            is_active = 1
                            WHERE email = :email";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':password_hash', $newPasswordHash);
            $updateStmt->bindParam(':full_name', $full_name);
            $updateStmt->bindParam(':email', $email);
            
            if ($updateStmt->execute()) {
                echo "<div class='success'><strong>✅ Mot de passe et rôle mis à jour avec succès !</strong></div>";
                
                // Vérifier à nouveau
                $verifyStmt = $db->prepare($checkQuery);
                $verifyStmt->bindParam(':email', $email);
                $verifyStmt->execute();
                $existing = $verifyStmt->fetch();
                $passwordValid = password_verify($password, $existing['password_hash']);
                
                if ($passwordValid) {
                    echo "<div class='success'><strong>✅ Vérification réussie ! Le mot de passe fonctionne maintenant.</strong></div>";
                }
            } else {
                $error = $updateStmt->errorInfo();
                echo "<div class='error'><strong>✗ Erreur lors de la mise à jour :</strong></div>";
                echo "<pre>" . print_r($error, true) . "</pre>";
            }
        }
    }
    
    // Vérifier le rôle
    echo "<h2>4️⃣ Vérification du rôle</h2>";
    if ($existing) {
        if ($existing['role'] === 'super_admin') {
            echo "<div class='success'><strong>✅ Rôle correct :</strong> super_admin</div>";
        } else {
            echo "<div class='warning'><strong>⚠️ Rôle actuel :</strong> {$existing['role']}</div>";
            echo "<div class='info'>Mise à jour du rôle en 'super_admin'...</div>";
            
            $roleQuery = "UPDATE users SET role = 'super_admin' WHERE email = :email";
            $roleStmt = $db->prepare($roleQuery);
            $roleStmt->bindParam(':email', $email);
            
            if ($roleStmt->execute()) {
                echo "<div class='success'><strong>✅ Rôle mis à jour en 'super_admin'</strong></div>";
            } else {
                $error = $roleStmt->errorInfo();
                echo "<div class='error'><strong>✗ Erreur :</strong> " . print_r($error, true) . "</div>";
            }
        }
    }
    
    // Récupérer les informations finales
    echo "<h2>5️⃣ Résumé final</h2>";
    $finalQuery = "SELECT id, email, full_name, role, is_active FROM users WHERE email = :email";
    $finalStmt = $db->prepare($finalQuery);
    $finalStmt->bindParam(':email', $email);
    $finalStmt->execute();
    $final = $finalStmt->fetch();
    
    if ($final) {
        // Vérifier le mot de passe final
        $checkHashQuery = "SELECT password_hash FROM users WHERE email = :email";
        $checkHashStmt = $db->prepare($checkHashQuery);
        $checkHashStmt->bindParam(':email', $email);
        $checkHashStmt->execute();
        $hashData = $checkHashStmt->fetch();
        
        $finalPasswordValid = password_verify($password, $hashData['password_hash']);
        
        echo "<table>";
        echo "<tr><th>Informations</th><th>Valeur</th><th>Statut</th></tr>";
        echo "<tr><td>Email</td><td><code>{$final['email']}</code></td><td>✅</td></tr>";
        echo "<tr><td>Nom complet</td><td>{$final['full_name']}</td><td>✅</td></tr>";
        echo "<tr><td>Rôle</td><td><strong>{$final['role']}</strong></td><td>" . ($final['role'] === 'super_admin' ? '✅' : '❌') . "</td></tr>";
        echo "<tr><td>Actif</td><td>" . ($final['is_active'] ? 'Oui' : 'Non') . "</td><td>" . ($final['is_active'] ? '✅' : '❌') . "</td></tr>";
        echo "<tr><td>Mot de passe</td><td><code>thib@.32a</code></td><td>" . ($finalPasswordValid ? '✅ Valide' : '❌ Invalide') . "</td></tr>";
        echo "</table>";
        
        if ($final['role'] === 'super_admin' && $final['is_active'] && $finalPasswordValid) {
            echo "<div class='success' style='font-size: 18px; text-align: center; padding: 20px; margin-top: 20px;'>";
            echo "<strong>🎉 TOUT EST CORRECT !</strong><br>";
            echo "Vous pouvez maintenant vous connecter avec :<br>";
            echo "<strong>Email :</strong> <code>{$email}</code><br>";
            echo "<strong>Mot de passe :</strong> <code>{$password}</code>";
            echo "</div>";
            
            echo "<div style='text-align: center; margin-top: 30px;'>";
            echo "<a href='http://localhost:5173/login' class='btn' target='_blank'>→ Aller à la page de connexion</a>";
            echo "</div>";
        } else {
            echo "<div class='error'><strong>❌ Il y a encore des problèmes à corriger</strong></div>";
            
            if ($final['role'] !== 'super_admin') {
                echo "<div class='warning'>Le rôle n'est pas 'super_admin'</div>";
            }
            if (!$final['is_active']) {
                echo "<div class='warning'>Le compte est désactivé</div>";
            }
            if (!$finalPasswordValid) {
                echo "<div class='warning'>Le mot de passe ne fonctionne pas</div>";
            }
        }
    }
    
} catch (Exception $e) {
    echo "<div class='error'><strong>✗ Erreur :</strong> " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

echo "</div></body></html>";
?>



