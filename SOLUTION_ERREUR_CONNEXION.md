# ✅ Solution pour l'erreur "Erreur de connexion au serveur"

## 🔍 Problème identifié

Vous voyez "Erreur de connexion au serveur" lors de la tentative de connexion. Cela signifie que l'API backend n'est pas accessible ou qu'il y a un problème de configuration.

## 🛠️ Solutions appliquées

### 1. ✅ Gestion d'erreur améliorée
- Ajout de logs détaillés dans la console
- Meilleure détection des erreurs de réseau
- Messages d'erreur plus explicites

### 2. ✅ CORS amélioré
- Ajout de `Access-Control-Allow-Credentials: true` pour les sessions
- Réorganisation de l'ordre des includes dans auth.php

### 3. ✅ Script de configuration
- Création de `backend/setup-super-admin.php` pour configurer votre compte

## 📋 Étapes à suivre MAINTENANT

### Étape 1 : Configurer votre compte Super Admin

1. Ouvrez cette URL dans votre navigateur :
   ```
   http://localhost:8080/Tbc_Groupe/backend/setup-super-admin.php
   ```

2. Ce script va :
   - Vérifier si votre compte existe
   - Générer le bon hash pour le mot de passe `thib@.32a`
   - Mettre à jour votre rôle en `super_admin`
   - Vérifier que tout est correct

### Étape 2 : Mettre à jour la table users (si nécessaire)

Si le script indique que la colonne `role` ne supporte pas `super_admin`, exécutez ce SQL dans phpMyAdmin :

```sql
USE tbc_groupe;

ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor';

UPDATE users SET role = 'super_admin' WHERE email = 'thibauttbcbujiriri@gmail.com';
```

### Étape 3 : Vérifier que l'API fonctionne

Ouvrez cette URL dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/index.php
```

Vous devriez voir du JSON avec la liste des endpoints.

### Étape 4 : Tester la connexion

1. Rechargez votre page de login (Ctrl+F5 pour vider le cache)
2. Ouvrez la console du navigateur (F12)
3. Essayez de vous connecter
4. Regardez les messages dans la console :
   - 🔐 Tentative de connexion...
   - 📡 URL: ...
   - 📥 Status: ...
   - 📦 Données reçues: ...

## 🔑 Identifiants de connexion

- **Email** : `thibauttbcbujiriri@gmail.com`
- **Mot de passe** : `thib@.32a`

## ⚠️ Si ça ne fonctionne toujours pas

### Vérification 1 : L'API est-elle accessible ?

Testez dans le navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/api/auth
```

Si vous obtenez une erreur 405 (Method Not Allowed), c'est normal (il faut POST).

### Vérification 2 : Le compte existe-t-il ?

Dans phpMyAdmin, exécutez :
```sql
SELECT * FROM users WHERE email = 'thibauttbcbujiriri@gmail.com';
```

Si aucun résultat, le compte n'existe pas. Le script `setup-super-admin.php` le créera.

### Vérification 3 : Le mot de passe est-il hashé ?

Le mot de passe dans la base de données doit être un hash, pas le mot de passe en clair.

Le script `setup-super-admin.php` génère automatiquement le bon hash.

### Vérification 4 : Les ports sont-ils corrects ?

- Apache : port 8080 ✅
- MySQL : port 3307 ✅
- React : port 5173 ✅

Vérifiez que tous les services XAMPP sont démarrés.

## 📞 Informations de débogage

Après avoir rechargé la page et essayé de vous connecter, partagez :

1. Les messages de la console (F12 → Console)
2. Les requêtes réseau (F12 → Network → Cliquez sur la requête vers `/api/auth`)
3. Le résultat du script `setup-super-admin.php`

Cela m'aidera à diagnostiquer le problème exact.













