<?php
/**
 * Script simple pour générer un hash de mot de passe
 */

$password = 'thib@.32a';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Génération du Hash du Mot de Passe</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; border: 1px solid #ddd; }
        h1 { color: #333; }
        .info { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 15px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class='container'>
    <h1>🔑 Génération du Hash du Mot de Passe</h1>
    
    <div class='info'>
        <strong>Mot de passe :</strong> {$password}<br>
        <strong>Hash généré :</strong>
    </div>
    
    <pre>{$hash}</pre>
    
    <div class='info'>
        <strong>✅ Utilisez ce hash dans votre base de données :</strong>
    </div>
    
    <pre>UPDATE users 
SET password_hash = '{$hash}',
    role = 'super_admin',
    is_active = 1
WHERE email = 'thibauttbcbujiriri@gmail.com';</pre>
    
    <p><strong>Note :</strong> Ce hash a été généré maintenant et correspond au mot de passe '{$password}'.</p>
    </div>
</body>
</html>";

// Afficher aussi le hash en texte brut pour copier facilement
echo "<!-- Hash brut: {$hash} -->";
?>













