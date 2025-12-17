# 🚨 URGENT : Activer l'Extension PostgreSQL

## ❌ Erreur Actuelle

**"could not find driver"** = L'extension `pdo_pgsql` n'est **PAS activée** dans PHP.

---

## ✅ Solution en 5 Étapes

### Étape 1 : Ouvrir php.ini

1. Le fichier se trouve à : **`C:\xampp\php\php.ini`**
2. Ouvrez-le avec **Notepad++** ou **VS Code** (pas le Bloc-notes Windows)

### Étape 2 : Chercher les Extensions

1. Appuyez sur **Ctrl+F** pour rechercher
2. Cherchez : **`extension=pdo_pgsql`**

### Étape 3 : Décommenter les Lignes

Vous devriez trouver ces lignes avec un `;` au début :
```ini
;extension=pdo_pgsql
;extension=pgsql
```

**Enlevez le `;`** pour les activer :
```ini
extension=pdo_pgsql
extension=pgsql
```

### Étape 4 : Sauvegarder

1. **Sauvegardez** le fichier (Ctrl+S)
2. **Fermez** l'éditeur

### Étape 5 : Redémarrer Apache

1. Ouvrez **XAMPP Control Panel**
2. Cliquez sur **Stop** pour Apache
3. Attendez 2 secondes
4. Cliquez sur **Start** pour Apache

---

## 🧪 Vérification

### Méthode 1 : Via Terminal

Ouvrez un terminal et tapez :
```bash
php -m | findstr pdo_pgsql
```

Vous devriez voir :
```
pdo_pgsql
```

### Méthode 2 : Via Script PHP

Ouvrez dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/verifier_extension.php
```

Ce script vous dira si l'extension est activée et vous donnera des instructions si elle ne l'est pas.

### Méthode 3 : Test de Connexion

Une fois l'extension activée, testez :
```
http://localhost:8080/Tbc_Groupe/backend/test_db.php
```

Vous devriez voir un JSON avec `"success": true`.

---

## 🐛 Si les Lignes n'Existent Pas

Si vous ne trouvez **PAS** `extension=pdo_pgsql` dans php.ini :

1. **Vérifiez que les DLL existent** :
   - `C:\xampp\php\ext\php_pdo_pgsql.dll`
   - `C:\xampp\php\ext\php_pgsql.dll`

2. **Si les fichiers existent**, ajoutez ces lignes dans la section `[Extensions]` de php.ini :
   ```ini
   extension=php_pdo_pgsql.dll
   extension=php_pgsql.dll
   ```

3. **Si les fichiers n'existent pas** :
   - Vous devrez installer PostgreSQL ou
   - Télécharger une version de PHP avec support PostgreSQL

---

## 📋 Checklist

- [ ] Fichier `C:\xampp\php\php.ini` ouvert
- [ ] Lignes `extension=pdo_pgsql` et `extension=pgsql` trouvées
- [ ] `;` enlevé au début des lignes
- [ ] Fichier sauvegardé
- [ ] Apache arrêté dans XAMPP
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

## 🆘 Aide Supplémentaire

Si vous avez besoin d'aide :

1. Ouvrez : `http://localhost:8080/Tbc_Groupe/backend/verifier_extension.php`
2. Ce script vous donnera le chemin exact de php.ini et vérifiera si les DLL existent
3. Partagez le résultat si vous avez besoin d'aide


