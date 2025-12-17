# 🚀 Guide de Migration Complète MySQL vers Supabase

## 📋 Vue d'ensemble

Ce guide vous accompagne étape par étape pour migrer complètement votre base de données MySQL vers Supabase (PostgreSQL).

## 📁 Fichiers de migration

1. **`database/migration_complete_supabase.sql`** - Script complet pour créer toutes les tables dans Supabase
2. **`database/script_migration_donnees.sql`** - Script pour migrer vos données existantes
3. **`database/update_user_role_enum.sql`** - Script pour mettre à jour l'ENUM si nécessaire

---

## 🔧 ÉTAPE 1 : Créer le schéma dans Supabase

### 1.1 Accéder à Supabase SQL Editor

1. Connectez-vous à [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet : `bnrbshrmmbhwahcvrkrh`
3. Allez dans **SQL Editor** (menu de gauche)
4. Cliquez sur **New query**

### 1.2 Exécuter le script de création

1. Ouvrez le fichier `database/migration_complete_supabase.sql`
2. **Copiez tout le contenu**
3. **Collez dans l'éditeur SQL de Supabase**
4. Cliquez sur **Run** (ou `Ctrl+Enter`)

### 1.3 Vérifier la création

Après l'exécution, vous devriez voir :
- ✅ Toutes les tables créées (10 tables)
- ✅ Les vues créées (2 vues)
- ✅ Les fonctions créées (3 fonctions)
- ✅ Les données par défaut insérées

Vérifiez dans **Table Editor** que toutes les tables sont présentes :
- `users`
- `trainers`
- `trainer_experiences`
- `trainer_skills`
- `trainer_technologies`
- `services`
- `portfolio_projects`
- `contact_messages`
- `site_settings`
- `training_programs`

---

## 📊 ÉTAPE 2 : Migrer vos données existantes (si nécessaire)

### 2.1 Exporter vos données MySQL

Si vous avez des données dans MySQL que vous voulez migrer :

#### Option A : Export via phpMyAdmin

1. Ouvrez phpMyAdmin
2. Sélectionnez la base `tbc_groupe`
3. Allez dans l'onglet **Export**
4. Choisissez **Custom** et sélectionnez :
   - Format : **SQL**
   - Tables : Sélectionnez les tables à exporter
   - Structure : ✅ Cocher
   - Données : ✅ Cocher
5. Cliquez sur **Go** pour télécharger

#### Option B : Export via ligne de commande

```bash
mysqldump -u root -p tbc_groupe > backup_mysql.sql
```

### 2.2 Adapter le script de migration

1. Ouvrez `database/script_migration_donnees.sql`
2. Pour chaque table, remplacez les exemples par vos vraies données
3. **Important** : 
   - Les dates MySQL sont compatibles avec PostgreSQL
   - Les JSON MySQL doivent être convertis en JSONB : `'["item"]'::jsonb`
   - Les valeurs NULL restent NULL

### 2.3 Exécuter la migration des données

1. Dans Supabase SQL Editor
2. Collez vos INSERT statements adaptés
3. Exécutez le script

---

## ⚙️ ÉTAPE 3 : Configuration du backend

### 3.1 Vérifier la configuration actuelle

Les fichiers suivants sont déjà configurés pour Supabase :

✅ **`backend/config/env.local.php`** - Identifiants Supabase
✅ **`backend/config/database.php`** - Connexion PostgreSQL
✅ **`.env`** - Variables d'environnement frontend

### 3.2 Vérifier les identifiants

Ouvrez `backend/config/env.local.php` et vérifiez :

```php
putenv("DB_HOST=db.bnrbshrmmbhwahcvrkrh.supabase.co");
putenv("DB_NAME=postgres");
putenv("DB_USER=postgres");
putenv("DB_PASSWORD=thi@.32aThibaut");
putenv("DB_PORT=5432");
```

### 3.3 Vérifier l'extension PHP

Assurez-vous que l'extension PostgreSQL est activée dans `php.ini` :

```ini
extension=pdo_pgsql
extension=pgsql
```

Redémarrez Apache après modification.

---

## 🧪 ÉTAPE 4 : Tester la connexion

### 4.1 Test de connexion backend

Ouvrez dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/test_db.php
```

Vous devriez voir :
- ✅ Extension `pdo_pgsql` chargée
- ✅ Connexion à Supabase réussie
- ✅ Version de PostgreSQL

### 4.2 Test de l'API d'authentification

Ouvrez :
```
http://localhost:8080/Tbc_Groupe/backend/api/test-auth.php
```

Ce script vérifie :
- ✅ Connexion à Supabase
- ✅ Structure de la table `users`
- ✅ Type ENUM `user_role` avec `super_admin`
- ✅ Utilisateurs existants

### 4.3 Test de connexion admin

1. Ouvrez votre application React : `http://localhost:5173/login`
2. Connectez-vous avec :
   - Email : `thibauttbcbujiriri@gmail.com`
   - Mot de passe : (votre mot de passe actuel)

---

## 🔍 Vérifications et dépannage

### Problème : "Extension pdo_pgsql non chargée"

**Solution :**
1. Ouvrez `php.ini` dans XAMPP
2. Cherchez `;extension=pdo_pgsql`
3. Décommentez : `extension=pdo_pgsql`
4. Ajoutez : `extension=pgsql`
5. Redémarrez Apache

### Problème : "Erreur de connexion à Supabase"

**Vérifications :**
1. Vérifiez les identifiants dans `backend/config/env.local.php`
2. Vérifiez que le mot de passe est correct
3. Vérifiez que le host est : `db.bnrbshrmmbhwahcvrkrh.supabase.co`
4. Testez avec `test_db.php`

### Problème : "Rôle super_admin non trouvé"

**Solution :**
1. Dans Supabase SQL Editor, exécutez :
```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
```

2. Vérifiez que votre utilisateur a le bon rôle :
```sql
SELECT email, role FROM users WHERE email = 'thibauttbcbujiriri@gmail.com';
```

3. Si nécessaire, mettez à jour :
```sql
UPDATE users SET role = 'super_admin' WHERE email = 'thibauttbcbujiriri@gmail.com';
```

### Problème : "Failed to fetch" lors de la connexion

**Vérifications :**
1. Vérifiez que Apache est démarré sur le port 8080
2. Vérifiez les logs : `backend/logs/php_errors.log`
3. Testez l'API directement : `http://localhost:8080/Tbc_Groupe/backend/api/auth.php`
4. Vérifiez CORS dans `backend/config/cors.php`

---

## 📝 Checklist de migration

- [ ] Script de création exécuté dans Supabase
- [ ] Toutes les tables créées (10 tables)
- [ ] Vues créées (2 vues)
- [ ] Fonctions créées (3 fonctions)
- [ ] Données par défaut insérées
- [ ] Extension `pdo_pgsql` activée dans PHP
- [ ] Configuration backend vérifiée
- [ ] Test de connexion réussi (`test_db.php`)
- [ ] Test API auth réussi (`test-auth.php`)
- [ ] Connexion admin fonctionnelle
- [ ] Données migrées (si applicable)

---

## 🎯 Résumé des différences MySQL vs PostgreSQL

| MySQL | PostgreSQL |
|-------|------------|
| `INT AUTO_INCREMENT` | `INTEGER GENERATED BY DEFAULT AS IDENTITY` |
| `VARCHAR(255)` | `TEXT` |
| `LONGTEXT` | `TEXT` |
| `DATETIME` | `TIMESTAMPTZ` |
| `JSON` | `JSONB` |
| `ENUM('val1', 'val2')` | `TYPE ENUM` créé séparément |
| `ON DUPLICATE KEY UPDATE` | `ON CONFLICT ... DO UPDATE` |
| `TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Trigger avec fonction |

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** : `backend/logs/php_errors.log`
2. **Testez avec les scripts de diagnostic** :
   - `backend/test_db.php`
   - `backend/api/test-auth.php`
3. **Vérifiez la documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)

---

## ✅ Migration terminée !

Une fois toutes les étapes complétées, votre application devrait fonctionner avec Supabase au lieu de MySQL.

**Prochaines étapes :**
- Testez toutes les fonctionnalités de l'admin
- Vérifiez que les données sont correctement sauvegardées
- Configurez les backups Supabase si nécessaire


