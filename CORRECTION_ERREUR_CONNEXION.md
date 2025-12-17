# 🔧 Correction de l'erreur "Failed to fetch"

## ✅ Corrections apportées

### 1. Amélioration de la gestion des erreurs dans `auth.php`
- Ajout de gestion d'erreurs plus robuste avec try/catch
- Vérification que les headers ne sont pas déjà envoyés avant d'envoyer des réponses JSON
- Ajout de logging des erreurs pour le débogage
- Encodage JSON avec `JSON_UNESCAPED_UNICODE` pour éviter les problèmes d'encodage

### 2. Correction du schéma Supabase
- Mise à jour de l'ENUM `user_role` pour inclure `'super_admin'` dans `database/schema_supabase.sql`
- Création d'un script SQL pour mettre à jour l'ENUM si nécessaire : `database/update_user_role_enum.sql`

### 3. Script de test créé
- Fichier `backend/api/test-auth.php` pour diagnostiquer les problèmes de connexion

## 🔍 Diagnostic

### Étape 1 : Tester la connexion à Supabase
Ouvrez dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/api/test-auth.php
```

Ce script vérifie :
- ✅ Extension PHP `pdo_pgsql` chargée
- ✅ Connexion à Supabase réussie
- ✅ Structure de la table `users`
- ✅ Type ENUM `user_role` et valeurs disponibles
- ✅ Utilisateurs existants dans la base
- ✅ Test de requête SELECT pour login

### Étape 2 : Vérifier le type ENUM dans Supabase
Si le test indique que `'super_admin'` n'existe pas dans l'ENUM, exécutez ce SQL dans Supabase SQL Editor :

```sql
-- Ajouter 'super_admin' à l'ENUM si nécessaire
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
```

Ou utilisez le script fourni :
```sql
-- Exécuter le contenu de database/update_user_role_enum.sql
```

### Étape 3 : Vérifier que votre utilisateur existe
Dans Supabase, vérifiez que votre utilisateur admin existe avec le bon rôle :

```sql
SELECT id, email, full_name, role, is_active FROM users WHERE email = 'thibauttbcbujiriri@gmail.com';
```

Si le rôle n'est pas `'super_admin'`, mettez-le à jour :
```sql
UPDATE users SET role = 'super_admin' WHERE email = 'thibauttbcbujiriri@gmail.com';
```

### Étape 4 : Tester l'API directement
Testez l'endpoint d'authentification directement avec curl ou Postman :

```bash
curl -X POST http://localhost:8080/Tbc_Groupe/backend/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"thibauttbcbujiriri@gmail.com","password":"votre_mot_de_passe"}'
```

Ou ouvrez dans le navigateur (pour tester si le fichier est accessible) :
```
http://localhost:8080/Tbc_Groupe/backend/api/auth.php
```

## 🐛 Problèmes courants et solutions

### Problème 1 : "Failed to fetch"
**Causes possibles :**
- Le backend PHP n'est pas accessible
- Erreur PHP qui fait planter le script avant la réponse
- Problème CORS
- Extension `pdo_pgsql` non chargée

**Solutions :**
1. Vérifiez que Apache est démarré sur le port 8080
2. Vérifiez les logs PHP : `backend/logs/php_errors.log`
3. Testez avec `test-auth.php` pour voir les erreurs détaillées
4. Vérifiez que `pdo_pgsql` est activé dans `php.ini`

### Problème 2 : Erreur de connexion à Supabase
**Causes possibles :**
- Identifiants incorrects dans `backend/config/env.local.php`
- Extension `pdo_pgsql` non chargée
- Problème de réseau/firewall

**Solutions :**
1. Vérifiez les identifiants dans `backend/config/env.local.php`
2. Testez la connexion avec `php test_db.php`
3. Vérifiez que l'extension est activée : `php -m | grep pdo_pgsql`

### Problème 3 : "Rôle non trouvé" ou erreur SQL
**Causes possibles :**
- L'ENUM `user_role` ne contient pas `'super_admin'`
- La table `users` n'existe pas ou a une structure différente

**Solutions :**
1. Exécutez le script SQL pour mettre à jour l'ENUM
2. Vérifiez la structure de la table dans Supabase
3. Assurez-vous que le schéma Supabase a été exécuté

## 📝 Fichiers modifiés

1. `backend/api/auth.php` - Amélioration de la gestion des erreurs
2. `database/schema_supabase.sql` - Ajout de `'super_admin'` dans l'ENUM
3. `database/update_user_role_enum.sql` - Script pour mettre à jour l'ENUM
4. `backend/api/test-auth.php` - Script de diagnostic

## 🚀 Prochaines étapes

1. **Exécutez le test** : Ouvrez `http://localhost:8080/Tbc_Groupe/backend/api/test-auth.php`
2. **Vérifiez les résultats** : Le script vous indiquera exactement où est le problème
3. **Corrigez selon les indications** : Suivez les instructions affichées
4. **Testez la connexion** : Essayez de vous connecter depuis l'interface admin

## 📞 Support

Si le problème persiste après avoir suivi ces étapes :
1. Vérifiez les logs PHP : `backend/logs/php_errors.log`
2. Vérifiez les logs Apache
3. Testez avec `test-auth.php` et partagez les résultats


