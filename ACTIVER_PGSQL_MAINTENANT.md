# 🚨 ACTIVER L'EXTENSION POSTGRESQL - INSTRUCTIONS PRÉCISES

## ✅ Votre Situation

L'extension `pdo_pgsql` n'est **PAS activée**. C'est pour cela que vous avez l'erreur "could not find driver".

## 📝 Étapes à Suivre (5 minutes)

### Étape 1 : Vérifier si les DLL existent

Les fichiers DLL doivent exister dans : `C:\xampp\php\ext\`

- ✅ `php_pdo_pgsql.dll`
- ✅ `php_pgsql.dll`

**Si ces fichiers n'existent PAS**, vous devrez les installer (voir section "Si les DLL n'existent pas" ci-dessous).

### Étape 2 : Ouvrir php.ini

1. Ouvrez le fichier : **`C:\xampp\php\php.ini`**
2. Utilisez **Notepad++** ou **VS Code** (pas le Bloc-notes Windows)

### Étape 3 : Chercher les Lignes

1. Appuyez sur **Ctrl+F**
2. Cherchez : **`pdo_pgsql`**
3. Vous devriez trouver ces lignes (avec `;` au début) :
   ```ini
   ;extension=pdo_pgsql
   ;extension=pgsql
   ```

### Étape 4 : Décommenter (Activer)

**Enlevez le `;`** au début de chaque ligne :

**AVANT :**
```ini
;extension=pdo_pgsql
;extension=pgsql
```

**APRÈS :**
```ini
extension=pdo_pgsql
extension=pgsql
```

### Étape 5 : Sauvegarder et Redémarrer

1. **Sauvegardez** le fichier (Ctrl+S)
2. **Fermez** l'éditeur
3. Ouvrez **XAMPP Control Panel**
4. Cliquez sur **Stop** pour Apache
5. Attendez 2-3 secondes
6. Cliquez sur **Start** pour Apache

### Étape 6 : Vérifier

Ouvrez un terminal et tapez :
```bash
php -m | findstr pdo_pgsql
```

Vous devriez voir :
```
pdo_pgsql
```

---

## 🐛 Si les Lignes n'Existent Pas dans php.ini

Si vous ne trouvez **PAS** `extension=pdo_pgsql` dans php.ini :

1. Cherchez la section `[Extensions]` dans php.ini
2. Ajoutez ces lignes à la fin de cette section :
   ```ini
   extension=php_pdo_pgsql.dll
   extension=php_pgsql.dll
   ```
3. Sauvegardez et redémarrez Apache

---

## ❌ Si les DLL n'Existent Pas

Si les fichiers `php_pdo_pgsql.dll` et `php_pgsql.dll` n'existent **PAS** dans `C:\xampp\php\ext\` :

### Option 1 : Installer PostgreSQL (Recommandé)

1. Téléchargez PostgreSQL depuis : https://www.postgresql.org/download/windows/
2. Installez PostgreSQL (les DLL seront disponibles)
3. Copiez les DLL depuis l'installation PostgreSQL vers `C:\xampp\php\ext\`

### Option 2 : Télécharger les DLL

1. Téléchargez une version de PHP avec support PostgreSQL
2. Extrayez les fichiers `php_pdo_pgsql.dll` et `php_pgsql.dll`
3. Copiez-les dans `C:\xampp\php\ext\`

### Option 3 : Utiliser une Version de XAMPP avec PostgreSQL

Certaines versions de XAMPP incluent déjà les extensions PostgreSQL.

---

## 🧪 Test Après Activation

Une fois l'extension activée et Apache redémarré :

1. **Testez la vérification** :
   ```
   http://localhost:8080/Tbc_Groupe/backend/verifier_extension.php
   ```
   Vous devriez voir `"loaded": true` pour `pdo_pgsql`

2. **Testez la connexion** :
   ```
   http://localhost:8080/Tbc_Groupe/backend/test_db.php
   ```
   Vous devriez voir `"success": true`

3. **Testez l'authentification** :
   Essayez de vous connecter depuis l'interface admin

---

## 📋 Checklist Complète

- [ ] Fichiers DLL vérifiés dans `C:\xampp\php\ext\`
- [ ] Fichier `C:\xampp\php\php.ini` ouvert
- [ ] Lignes `extension=pdo_pgsql` et `extension=pgsql` trouvées ou ajoutées
- [ ] `;` enlevé au début des lignes
- [ ] Fichier sauvegardé
- [ ] Apache arrêté dans XAMPP
- [ ] Apache redémarré dans XAMPP
- [ ] Extension vérifiée avec `php -m | findstr pdo_pgsql`
- [ ] Test de connexion réussi

---

## 🆘 Besoin d'Aide ?

Si vous avez des problèmes :

1. Vérifiez que les DLL existent : `C:\xampp\php\ext\php_pdo_pgsql.dll`
2. Vérifiez que vous avez bien sauvegardé php.ini
3. Vérifiez que vous avez bien redémarré Apache (pas juste rechargé)
4. Ouvrez `verifier_extension.php` pour voir l'état actuel


