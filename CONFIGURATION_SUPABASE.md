# 🔧 Configuration Supabase - Tbc Groupe

## ✅ Configuration terminée

Votre projet a été configuré pour utiliser **Supabase (PostgreSQL)** au lieu de MySQL/PHPMyAdmin.

## 📋 Identifiants configurés

### Backend PHP (PostgreSQL)
- **Host**: `db.bnrbshrmmbhwahcvrkrh.supabase.co`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: `thi@.32aThibaut`
- **Port**: `5432`
- **SSL Mode**: `require`

### Frontend (Supabase Client)
- **Project URL**: `https://bnrbshrmmbhwahcvrkrh.supabase.co`
- **API Key (anon)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucmJzaHJtbWJod2FoY3Zya3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NzA3ODksImV4cCI6MjA4MTQ0Njc4OX0.K3D7hb15so4Z-wfO_LoKvryNA6Cw-lqsxB_MFtZm5Ro`

## 📁 Fichiers de configuration

### Backend
1. **`backend/config/env.local.php`** ✅
   - Contient les identifiants de connexion PostgreSQL
   - Ce fichier est prioritaire et ne doit pas être versionné

2. **`backend/config/env.php`** ✅
   - Fichier de fallback avec les identifiants par défaut
   - Utilisé si `env.local.php` n'existe pas

3. **`backend/config/database.php`** ✅
   - Classe Database utilisant PDO avec PostgreSQL
   - Connexion SSL activée pour Supabase

### Frontend
1. **`.env`** ✅
   - Contient `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
   - Utilisé par Vite pour le client Supabase dans `src/lib/supabaseClient.js`

## 🔍 Vérification de la configuration

### Tester la connexion backend
```bash
php test_db.php
```

Ce script vérifie :
- ✅ L'extension PHP `pdo_pgsql` est chargée
- ✅ La connexion à Supabase fonctionne
- ✅ La version de PostgreSQL

### Tester la connexion frontend
Le client Supabase est configuré dans `src/lib/supabaseClient.js` et utilise les variables d'environnement du fichier `.env`.

## 🚀 Utilisation

### Backend API
Tous les fichiers API dans `backend/api/` utilisent la classe `Database` qui se connecte automatiquement à Supabase :

```php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();
```

### Frontend
Le client Supabase est importé et utilisé dans les composants React :

```javascript
import { supabase } from '../lib/supabaseClient';
```

## ⚠️ Prérequis

### PHP
- Extension `pdo_pgsql` doit être activée dans `php.ini`
- Extension `pgsql` recommandée (optionnelle)

Pour activer dans `php.ini` :
```ini
extension=pdo_pgsql
extension=pgsql
```

### Node.js
- Package `@supabase/supabase-js` déjà installé dans `package.json`

## 📝 Notes importantes

1. **Sécurité** : Le fichier `env.local.php` contient des identifiants sensibles et ne doit **PAS** être versionné sur Git.

2. **SSL** : La connexion utilise `sslmode=require` pour garantir une connexion sécurisée à Supabase.

3. **Migration** : Assurez-vous que votre schéma de base de données Supabase correspond au schéma MySQL original. Le fichier `database/schema_supabase.sql` contient le schéma converti pour PostgreSQL.

4. **Variables d'environnement** : Le fichier `.env` pour le frontend doit être présent à la racine du projet pour que Vite puisse charger les variables.

## 🔄 Migration depuis MySQL

Si vous migrez depuis MySQL, assurez-vous que :
- ✅ Le schéma PostgreSQL est créé dans Supabase (`database/schema_supabase.sql`)
- ✅ Les données sont migrées (si nécessaire)
- ✅ Les extensions PHP PostgreSQL sont activées
- ✅ Le fichier `.env` est créé avec les bonnes valeurs

## 📞 Support

En cas de problème de connexion :
1. Vérifiez que l'extension `pdo_pgsql` est activée : `php -m | grep pdo_pgsql`
2. Testez la connexion : `php test_db.php`
3. Vérifiez les identifiants dans `backend/config/env.local.php`
4. Vérifiez que le fichier `.env` existe à la racine du projet


