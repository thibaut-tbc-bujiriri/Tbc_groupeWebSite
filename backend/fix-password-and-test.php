<?php
/**
 * Script complet pour corriger le mot de passe et tester la connexion
 */

header('Content-Type: text/html; charset=UTF-8');

require_once 'config/cors.php';
require_once 'config/database.php';

$email = 'thibauttbcbujiriri@gmail.com';
$password = 'thib@.32a';
$full_name = 'Thibaut Tbc Bujiriri';

echo "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Correction Complète du Compte Admin</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 1000px; margin: 30px auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .success { color: #2e7d32; padding: 15px 20px; background: #e8f5e9; border-left: 5px solid #4caf50; margin: 15px 0; border-radius: 5px; }
        .error { color: #c62828; padding: 15px 20px; background: #ffebee; border-left: 5px solid #f44336; margin: 15px 0; border-radius: 5px; }
        .info { color: #1565c0; padding: 15px 20px; background: #e3f2fd; border-left: 5px solid #2196f3; margin: 15px 0; border-radius: 5px; }
        .warning { color: #f57c00; padding: 15px 20px; background: #fff3e0; border-left: 5px solid #ff9800; margin: 15px 0; border-radius: 5px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; border: 1px solid #ddd; font-size: 13px; }
        h1 { color: #333; border-bottom: 4px solid #2196f3; padding-bottom: 15px; margin-bottom: 30px; }
        h2 { color: #555; margin-top: 30px; margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        code { background: #e0e0e0; padding: 3px 8px; border-radius: 3px; font-family: 'Courier New', monospace; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        table td, table th { padding: 12px; border: 1px solid #ddd; }
        table th { background: #2196f3; color: white; }
        table tr:nth-child(even) { background: #f9f9f9; }
        .btn { display: inline-block; padding: 12px 24px; background: #2196f3; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
        .btn:hover { background: #1976d2; }
        .btn-success { background: #4caf50; }
        .btn-success:hover { background: #45a049; }
    </style>
</head>
<body>
    <div class='container'>
    <h1>🔧 Correction Complète du Compte Super Admin</h1>
";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "<div class='success'><strong>✓ Connexion à la base de données réussie</strong></div>";
    
    $allFixed = true;
    $issues = [];
    
    // ÉTAPE 1: Vérifier la structure
    echo "<h2>📐 Étape 1 : Vérification de la structure de la table</h2>";
    $structureQuery = "SHOW COLUMNS FROM users WHERE Field = 'role'";
    $structureStmt = $db->prepare($structureQuery);
    $structureStmt->execute();
    $roleColumn = $structureStmt->fetch();
    
    if ($roleColumn && strpos($roleColumn['Type'], 'super_admin') !== false) {
        echo "<div class='success'><strong>✅ Structure OK :</strong> La colonne 'role' supporte 'super_admin'</div>";
    } else {
        echo "<div class='error'><strong>❌ Problème :</strong> La colonne 'role' ne supporte pas 'super_admin'</div>";
        echo "<div class='warning'><strong>Action requise :</strong> Exécutez ce SQL dans phpMyAdmin, puis rechargez cette page :</div>";
        echo "<pre>USE tbc_groupe;\n\nALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor';</pre>";
        $allFixed = false;
        $issues[] = "Structure de la table incorrecte";
    }
    
    // ÉTAPE 2: Vérifier/Créer le compte
    echo "<h2>👤 Étape 2 : Vérification du compte utilisateur</h2>";
    $checkQuery = "SELECT id, email, full_name, role, is_active, password_hash FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    $existing = $checkStmt->fetch();
    
    if (!$existing) {
        echo "<div class='warning'><strong>⚠️ Compte non trouvé</strong> - Création en cours...</div>";
        
        // Générer le hash
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // Créer le compte
        $insertQuery = "INSERT INTO users (email, password_hash, full_name, role, is_active) 
                        VALUES (:email, :password_hash, :full_name, 'super_admin', 1)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':email', $email);
        $insertStmt->bindParam(':password_hash', $passwordHash);
        $insertStmt->bindParam(':full_name', $full_name);
        
        if ($insertStmt->execute()) {
            $newId = $db->lastInsertId();
            echo "<div class='success'><strong>✅ Compte créé avec succès !</strong> ID: {$newId}</div>";
            
            // Récupérer le compte créé
            $checkStmt->execute();
            $existing = $checkStmt->fetch();
        } else {
            $error = $insertStmt->errorInfo();
            echo "<div class='error'><strong>❌ Erreur lors de la création :</strong></div>";
            echo "<pre>" . print_r($error, true) . "</pre>";
            $allFixed = false;
            $issues[] = "Erreur lors de la création du compte";
        }
    } else {
        echo "<div class='info'><strong>✓ Compte trouvé</strong> (ID: {$existing['id']})</div>";
    }
    
    // ÉTAPE 3: Vérifier et corriger le mot de passe
    if ($existing) {
        echo "<h2>🔑 Étape 3 : Vérification du mot de passe</h2>";
        
        $passwordValid = password_verify($password, $existing['password_hash']);
        
        if ($passwordValid) {
            echo "<div class='success'><strong>✅ Le mot de passe est correct !</strong></div>";
        } else {
            echo "<div class='error'><strong>❌ Le mot de passe ne correspond pas</strong> - Génération d'un nouveau hash...</div>";
            
            $newPasswordHash = password_hash($password, PASSWORD_DEFAULT);
            
            $updateQuery = "UPDATE users SET password_hash = :password_hash WHERE email = :email";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':password_hash', $newPasswordHash);
            $updateStmt->bindParam(':email', $email);
            
            if ($updateStmt->execute()) {
                echo "<div class='success'><strong>✅ Mot de passe mis à jour avec succès !</strong></div>";
                
                // Vérifier à nouveau
                $checkStmt->execute();
                $existing = $checkStmt->fetch();
                $passwordValid = password_verify($password, $existing['password_hash']);
                
                if ($passwordValid) {
                    echo "<div class='success'><strong>✅ Vérification : Le nouveau mot de passe fonctionne !</strong></div>";
                } else {
                    echo "<div class='error'><strong>❌ Problème persistant avec le mot de passe</strong></div>";
                    $allFixed = false;
                }
            } else {
                $error = $updateStmt->errorInfo();
                echo "<div class='error'><strong>❌ Erreur lors de la mise à jour :</strong></div>";
                echo "<pre>" . print_r($error, true) . "</pre>";
                $allFixed = false;
            }
        }
        
        // ÉTAPE 4: Vérifier et corriger le rôle
        echo "<h2>👑 Étape 4 : Vérification du rôle</h2>";
        
        if ($existing['role'] === 'super_admin') {
            echo "<div class='success'><strong>✅ Rôle correct : super_admin</strong></div>";
        } else {
            echo "<div class='warning'><strong>⚠️ Rôle actuel : {$existing['role']}</strong> - Mise à jour en 'super_admin'...</div>";
            
            $roleQuery = "UPDATE users SET role = 'super_admin' WHERE email = :email";
            $roleStmt = $db->prepare($roleQuery);
            $roleStmt->bindParam(':email', $email);
            
            if ($roleStmt->execute()) {
                echo "<div class='success'><strong>✅ Rôle mis à jour en 'super_admin'</strong></div>";
                
                // Récupérer les données mises à jour
                $checkStmt->execute();
                $existing = $checkStmt->fetch();
            } else {
                $error = $roleStmt->errorInfo();
                echo "<div class='error'><strong>❌ Erreur lors de la mise à jour du rôle :</strong></div>";
                echo "<pre>" . print_r($error, true) . "</pre>";
                
                // Si c'est un problème de structure, on le note
                if (isset($error[2]) && strpos($error[2], 'super_admin') !== false) {
                    echo "<div class='error'><strong>Le problème vient de la structure de la table !</strong> Exécutez d'abord le SQL pour modifier la colonne 'role'.</div>";
                    $allFixed = false;
                    $issues[] = "Structure de la table : role ne supporte pas super_admin";
                }
            }
        }
        
        // ÉTAPE 5: Vérifier que le compte est actif
        echo "<h2>✅ Étape 5 : Vérification du statut</h2>";
        
        if ($existing['is_active']) {
            echo "<div class='success'><strong>✅ Compte actif</strong></div>";
        } else {
            echo "<div class='warning'><strong>⚠️ Compte inactif</strong> - Activation en cours...</div>";
            
            $activeQuery = "UPDATE users SET is_active = 1 WHERE email = :email";
            $activeStmt = $db->prepare($activeQuery);
            $activeStmt->bindParam(':email', $email);
            
            if ($activeStmt->execute()) {
                echo "<div class='success'><strong>✅ Compte activé</strong></div>";
                $checkStmt->execute();
                $existing = $checkStmt->fetch();
            } else {
                echo "<div class='error'><strong>❌ Erreur lors de l'activation</strong></div>";
                $allFixed = false;
            }
        }
    }
    
    // ÉTAPE 6: Résumé final et test
    echo "<h2>📊 Étape 6 : Résumé final</h2>";
    
    if ($existing) {
        // Récupérer les dernières données
        $finalQuery = "SELECT id, email, full_name, role, is_active FROM users WHERE email = :email";
        $finalStmt = $db->prepare($finalQuery);
        $finalStmt->bindParam(':email', $email);
        $finalStmt->execute();
        $final = $finalStmt->fetch();
        
        // Vérifier le hash final
        $hashQuery = "SELECT password_hash FROM users WHERE email = :email";
        $hashStmt = $db->prepare($hashQuery);
        $hashStmt->bindParam(':email', $email);
        $hashStmt->execute();
        $hashData = $hashStmt->fetch();
        
        $finalPasswordValid = password_verify($password, $hashData['password_hash']);
        
        echo "<table>";
        echo "<tr><th style='width: 200px;'>Élément</th><th>Valeur</th><th style='width: 100px;'>Statut</th></tr>";
        echo "<tr><td><strong>Email</strong></td><td><code>{$final['email']}</code></td><td style='text-align: center;'>✅</td></tr>";
        echo "<tr><td><strong>Nom complet</strong></td><td>{$final['full_name']}</td><td style='text-align: center;'>✅</td></tr>";
        echo "<tr><td><strong>Rôle</strong></td><td><strong>{$final['role']}</strong></td><td style='text-align: center;'>" . ($final['role'] === 'super_admin' ? '✅' : '❌') . "</td></tr>";
        echo "<tr><td><strong>Compte actif</strong></td><td>" . ($final['is_active'] ? 'Oui' : 'Non') . "</td><td style='text-align: center;'>" . ($final['is_active'] ? '✅' : '❌') . "</td></tr>";
        echo "<tr><td><strong>Mot de passe</strong></td><td><code>{$password}</code></td><td style='text-align: center;'>" . ($finalPasswordValid ? '✅ Valide' : '❌ Invalide') . "</td></tr>";
        echo "</table>";
        
        // Test final
        $everythingOk = ($final['role'] === 'super_admin' && $final['is_active'] && $finalPasswordValid);
        
        if ($everythingOk && $allFixed) {
            echo "<div class='success' style='font-size: 20px; text-align: center; padding: 30px; margin-top: 30px; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 10px;'>";
            echo "<strong style='font-size: 24px;'>🎉 TOUT EST PARFAIT !</strong><br><br>";
            echo "Votre compte est prêt à être utilisé.<br><br>";
            echo "<div style='background: white; padding: 20px; border-radius: 5px; margin: 20px 0; display: inline-block;'>";
            echo "<strong>Identifiants de connexion :</strong><br>";
            echo "📧 <strong>Email :</strong> <code style='font-size: 16px;'>{$email}</code><br>";
            echo "🔑 <strong>Mot de passe :</strong> <code style='font-size: 16px;'>{$password}</code>";
            echo "</div>";
            echo "</div>";
            
            echo "<div style='text-align: center; margin-top: 30px;'>";
            echo "<a href='http://localhost:5173/login' class='btn btn-success' target='_blank' style='font-size: 18px; padding: 15px 30px;'>🚀 Aller à la page de connexion</a>";
            echo "</div>";
        } else {
            echo "<div class='error' style='font-size: 18px; padding: 20px; text-align: center;'>";
            echo "<strong>❌ Il reste des problèmes à corriger :</strong><br><br>";
            
            if ($final['role'] !== 'super_admin') {
                echo "• Le rôle n'est pas 'super_admin'<br>";
            }
            if (!$final['is_active']) {
                echo "• Le compte est désactivé<br>";
            }
            if (!$finalPasswordValid) {
                echo "• Le mot de passe ne fonctionne pas<br>";
            }
            if (!$allFixed) {
                echo "• " . implode("<br>• ", $issues) . "<br>";
            }
            
            echo "</div>";
        }
    }
    
} catch (Exception $e) {
    echo "<div class='error'><strong>❌ Erreur fatale :</strong> " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

echo "</div></body></html>";
?>



