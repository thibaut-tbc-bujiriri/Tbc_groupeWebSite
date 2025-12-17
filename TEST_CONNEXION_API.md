# 🔍 Test de Connexion API - Guide de Diagnostic

## 🚨 Problème : "Erreur de connexion au serveur"

Si vous voyez cette erreur lors de la connexion, suivez ces étapes :

### Étape 1 : Tester l'API directement

Ouvrez cette URL dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/index.php
```

Vous devriez voir du JSON avec la liste des endpoints.

### Étape 2 : Configurer le Super Admin

Ouvrez cette URL dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/setup-super-admin.php
```

Ce script va :
- Vérifier si votre compte existe
- Générer le bon hash pour le mot de passe
- Mettre à jour votre rôle en `super_admin`
- Vérifier que la table supporte le rôle `super_admin`

### Étape 3 : Vérifier la structure de la table

Si le script indique que la colonne `role` ne supporte pas `super_admin`, exécutez ce SQL dans phpMyAdmin :

```sql
USE tbc_groupe;

ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor';
```

### Étape 4 : Tester l'API Auth directement

Créez un fichier `test-auth.html` dans `backend/` et testez la connexion :

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Auth API</title>
</head>
<body>
    <h1>Test API Auth</h1>
    <button onclick="testLogin()">Tester la connexion</button>
    <pre id="result"></pre>
    
    <script>
    async function testLogin() {
        const result = document.getElementById('result');
        result.textContent = 'Test en cours...';
        
        try {
            const response = await fetch('http://localhost:8080/Tbc_Groupe/backend/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'login',
                    email: 'thibauttbcbujiriri@gmail.com',
                    password: 'thib@.32a'
                })
            });
            
            const data = await response.json();
            result.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            result.textContent = 'Erreur: ' + error.message;
        }
    }
    </script>
</body>
</html>
```

### Étape 5 : Vérifier les logs

1. **Logs PHP** : Regardez dans `C:\xampp\php\logs\php_error_log`
2. **Console du navigateur** : F12 → Onglet Console → Regardez les erreurs
3. **Onglet Network** : F12 → Network → Regardez la requête vers `/api/auth`

## ✅ Checklist de vérification

- [ ] XAMPP Apache est démarré sur le port 8080
- [ ] XAMPP MySQL est démarré sur le port 3307
- [ ] L'URL `http://localhost:8080/Tbc_Groupe/backend/index.php` fonctionne
- [ ] Le script `setup-super-admin.php` s'exécute sans erreur
- [ ] Votre compte existe dans la table `users`
- [ ] Votre mot de passe est hashé correctement
- [ ] Votre rôle est `super_admin`
- [ ] La colonne `role` supporte `super_admin`

## 🔧 Solutions courantes

### Problème : "Failed to fetch" ou erreur réseau

**Solution** : Vérifiez que :
- Apache est démarré
- Le port 8080 est correct
- L'URL dans AuthContext correspond à votre configuration

### Problème : "Email ou mot de passe incorrect"

**Solution** : 
1. Exécutez `setup-super-admin.php`
2. Vérifiez que le mot de passe dans la base correspond bien à `thib@.32a`

### Problème : "Compte désactivé"

**Solution** :
```sql
UPDATE users SET is_active = 1 WHERE email = 'thibauttbcbujiriri@gmail.com';
```

### Problème : CORS

**Solution** : Vérifiez que `backend/config/cors.php` autorise `http://localhost:5173`

## 📞 Informations de débogage

Dans la console du navigateur (F12), vous devriez voir :
- 🔐 Tentative de connexion...
- 📡 URL: http://localhost:8080/Tbc_Groupe/backend/api/auth
- 📥 Status: 200 (ou autre)
- 📦 Données reçues: {...}

Si vous voyez une erreur, partagez ces informations pour diagnostiquer le problème.













