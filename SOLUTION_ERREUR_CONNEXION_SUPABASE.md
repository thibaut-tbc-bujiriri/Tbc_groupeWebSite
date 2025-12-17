# 🔧 Solution : Erreur de Connexion à Supabase

## 🔍 Diagnostic Rapide

### Étape 1 : Ouvrir le script de diagnostic

Ouvrez dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/diagnostic_connexion.php
```

Ce script vous indiquera **exactement** où est le problème.

---

## 🐛 Problèmes Courants et Solutions

### Problème 1 : Extension pdo_pgsql non chargée

**Symptôme :** Erreur "could not find driver" ou "pdo_pgsql not found"

**Solution :**
1. Ouvrez `php.ini` dans XAMPP : `C:\xampp\php\php.ini`
2. Cherchez ces lignes et **décommentez-les** (enlevez le `;`) :
   ```ini
   extension=pdo_pgsql
   extension=pgsql
   ```
3. **Redémarrez Apache** dans XAMPP
4. Vérifiez : `php -m | findstr pdo_pgsql`

---

### Problème 2 : Erreur SSL

**Symptôme :** Erreur "SSL connection required" ou "certificate verify failed"

**Solutions possibles :**

#### Solution A : Utiliser sslmode=prefer (au lieu de require)
Modifiez `backend/config/database.php` ligne 27 :
```php
$dsn = "pgsql:host=" . $host . ";port=" . $port . ";dbname=" . $db_name . ";sslmode=prefer";
```

#### Solution B : Désactiver temporairement SSL (pour test)
```php
$dsn = "pgsql:host=" . $host . ";port=" . $port . ";dbname=" . $db_name . ";sslmode=disable";
```

⚠️ **Note :** Supabase recommande SSL, mais parfois `prefer` fonctionne mieux.

---

### Problème 3 : Tables n'existent pas

**Symptôme :** Connexion réussie mais erreur "relation users does not exist"

**Solution :**
1. Ouvrez Supabase Dashboard
2. Allez dans **SQL Editor**
3. Ouvrez le fichier `database/migration_complete_supabase.sql`
4. **Copiez tout le contenu** et collez dans l'éditeur SQL
5. Cliquez sur **Run**
6. Vérifiez que toutes les tables sont créées

---

### Problème 4 : Identifiants incorrects

**Vérifications :**
1. Ouvrez `backend/config/env.local.php`
2. Vérifiez que les identifiants sont corrects :
   ```php
   DB_HOST=db.emnuxospjuvxzxfeecut.supabase.co
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=thi@.32aThibaut
   DB_PORT=5432
   ```

3. Dans Supabase Dashboard :
   - Allez dans **Settings** > **Database**
   - Vérifiez le **Connection string**
   - Le host doit être : `db.emnuxospjuvxzxfeecut.supabase.co`

---

### Problème 5 : Port incorrect

**Vérifications :**
- Port **5432** : Session mode (recommandé)
- Port **6543** : Transaction Pooler (alternative)

Si le port 5432 ne fonctionne pas, essayez 6543 :
```php
putenv("DB_PORT=6543");
```

---

## 🧪 Tests à Effectuer

### Test 1 : Vérifier l'extension PHP
```bash
php -m | findstr pdo_pgsql
```

### Test 2 : Test de connexion simple
Ouvrez : `http://localhost:8080/Tbc_Groupe/backend/test_db.php`

### Test 3 : Diagnostic complet
Ouvrez : `http://localhost:8080/Tbc_Groupe/backend/diagnostic_connexion.php`

### Test 4 : Test API directement
Ouvrez : `http://localhost:8080/Tbc_Groupe/backend/api/test-auth.php`

---

## 📝 Modifications à Apporter

### Si SSL pose problème

Modifiez `backend/config/database.php` ligne 27 :

**Option 1 : sslmode=prefer (recommandé)**
```php
$dsn = "pgsql:host=" . $host . ";port=" . $port . ";dbname=" . $db_name . ";sslmode=prefer";
```

**Option 2 : sslmode=disable (temporaire, pour test)**
```php
$dsn = "pgsql:host=" . $host . ";port=" . $port . ";dbname=" . $db_name . ";sslmode=disable";
```

---

## ✅ Checklist de Résolution

- [ ] Extension `pdo_pgsql` activée dans `php.ini`
- [ ] Apache redémarré après modification de `php.ini`
- [ ] Identifiants vérifiés dans `env.local.php`
- [ ] Script SQL exécuté dans Supabase
- [ ] Tables créées (vérifier avec diagnostic_connexion.php)
- [ ] Test de connexion réussi (test_db.php)
- [ ] SSL mode testé (require, prefer, disable)

---

## 🆘 Si Rien ne Fonctionne

1. **Vérifiez les logs** : `backend/logs/php_errors.log`
2. **Testez avec le script de diagnostic** : `diagnostic_connexion.php`
3. **Vérifiez dans Supabase Dashboard** :
   - Settings > Database > Connection string
   - Vérifiez que le projet est actif
4. **Testez la connexion depuis Supabase** :
   - SQL Editor > Test query : `SELECT version();`

---

## 📞 Informations à Fournir pour Aide

Si le problème persiste, fournissez :
1. Résultat de `diagnostic_connexion.php`
2. Contenu de `backend/logs/php_errors.log`
3. Résultat de `php -m | findstr pdo_pgsql`
4. Message d'erreur exact


