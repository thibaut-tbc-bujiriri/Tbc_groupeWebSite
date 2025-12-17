# 🔧 Activer l'Extension PostgreSQL dans PHP (XAMPP)

## ❌ Problème Identifié

L'erreur **"could not find driver"** signifie que l'extension `pdo_pgsql` n'est **PAS activée** dans PHP.

## ✅ Solution : Activer l'Extension

### Étape 1 : Trouver le fichier php.ini

1. Ouvrez un terminal et exécutez :
   ```bash
   php --ini
   ```
   
   Cela vous donnera le chemin du fichier `php.ini` (généralement : `C:\xampp\php\php.ini`)

### Étape 2 : Modifier php.ini

1. **Ouvrez** le fichier `php.ini` avec un éditeur de texte (Notepad++, VS Code, etc.)
   - Chemin typique : `C:\xampp\php\php.ini`

2. **Cherchez** ces lignes (utilisez Ctrl+F) :
   ```ini
   ;extension=pdo_pgsql
   ;extension=pgsql
   ```

3. **Décommentez-les** (enlevez le `;` au début) :
   ```ini
   extension=pdo_pgsql
   extension=pgsql
   ```

4. **Sauvegardez** le fichier

### Étape 3 : Redémarrer Apache

1. Ouvrez **XAMPP Control Panel**
2. **Arrêtez** Apache (cliquez sur "Stop")
3. **Redémarrez** Apache (cliquez sur "Start")

### Étape 4 : Vérifier l'Activation

Ouvrez un terminal et exécutez :
```bash
php -m | findstr pdo_pgsql
```

Vous devriez voir :
```
pdo_pgsql
```

Si vous ne voyez rien, l'extension n'est toujours pas chargée.

---

## 🔍 Vérification Alternative

### Méthode 1 : Via phpinfo()

1. Créez un fichier `test_phpinfo.php` dans `C:\xampp\htdocs\` :
   ```php
   <?php phpinfo(); ?>
   ```

2. Ouvrez dans le navigateur : `http://localhost/test_phpinfo.php`

3. Cherchez "pdo_pgsql" dans la page
   - Si vous le trouvez : ✅ Extension activée
   - Si vous ne le trouvez pas : ❌ Extension non activée

### Méthode 2 : Via le Script de Diagnostic

Ouvrez dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/diagnostic_connexion.php
```

La section "1. Extensions PHP" vous dira si l'extension est chargée.

---

## 🐛 Si l'Extension n'Existe Pas

Si les lignes `extension=pdo_pgsql` n'existent pas dans `php.ini` :

1. **Vérifiez que les DLL existent** :
   - `C:\xampp\php\ext\php_pdo_pgsql.dll`
   - `C:\xampp\php\ext\php_pgsql.dll`

2. Si les fichiers **n'existent pas** :
   - Téléchargez PHP avec les extensions PostgreSQL
   - Ou installez PostgreSQL et copiez les DLL

3. **Ajoutez manuellement** dans `php.ini` :
   ```ini
   extension=php_pdo_pgsql.dll
   extension=php_pgsql.dll
   ```

---

## 📝 Checklist

- [ ] Fichier `php.ini` ouvert
- [ ] Lignes `extension=pdo_pgsql` et `extension=pgsql` décommentées
- [ ] Fichier sauvegardé
- [ ] Apache redémarré dans XAMPP
- [ ] Extension vérifiée avec `php -m | findstr pdo_pgsql`
- [ ] Test de connexion réussi

---

## ✅ Après Activation

Une fois l'extension activée :

1. **Testez la connexion** :
   ```
   http://localhost:8080/Tbc_Groupe/backend/test_db.php
   ```

2. **Testez l'API d'authentification** :
   ```
   http://localhost:8080/Tbc_Groupe/backend/api/test-auth.php
   ```

3. **Essayez de vous connecter** depuis l'interface admin

---

## 🆘 Si le Problème Persiste

1. Vérifiez que les DLL existent dans `C:\xampp\php\ext\`
2. Vérifiez les logs Apache pour d'autres erreurs
3. Assurez-vous d'avoir redémarré Apache (pas seulement rechargé)
4. Vérifiez qu'il n'y a pas plusieurs fichiers `php.ini` (utilisez `php --ini`)


