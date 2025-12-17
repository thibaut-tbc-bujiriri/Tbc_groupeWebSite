# ✅ ACTIVER L'EXTENSION - ÉTAPE PAR ÉTAPE

## 📍 Situation Actuelle

✅ Les fichiers DLL existent  
✅ Les lignes sont trouvées dans php.ini (lignes 947 et 949)  
❌ Les lignes sont **commentées** (avec `;`)

## 🔧 Action Immédiate

### Étape 1 : Ouvrir php.ini

1. Ouvrez le fichier : **`C:\xampp\php\php.ini`**
2. Utilisez **Notepad++** ou **VS Code** (pas le Bloc-notes)

### Étape 2 : Aller aux Lignes 947-949

1. Appuyez sur **Ctrl+G** (Aller à la ligne)
2. Tapez : **947**
3. Vous devriez voir :
   ```ini
   ;extension=pdo_pgsql
   
   ;extension=pgsql
   ```

### Étape 3 : Décommenter

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

### Étape 4 : Sauvegarder

1. **Ctrl+S** pour sauvegarder
2. **Fermez** l'éditeur

### Étape 5 : Redémarrer Apache

1. Ouvrez **XAMPP Control Panel**
2. Cliquez sur **Stop** (Apache)
3. Attendez 3 secondes
4. Cliquez sur **Start** (Apache)

### Étape 6 : Vérifier

Dans PowerShell, exécutez :
```powershell
php -m | findstr pdo_pgsql
```

Vous devriez voir :
```
pdo_pgsql
```

---

## 🧪 Test Complet

Après activation, testez dans cet ordre :

### 1. Vérifier l'extension
```powershell
php -m | findstr pdo_pgsql
```

### 2. Test via navigateur
```
http://localhost:8080/Tbc_Groupe/backend/verifier_extension.php
```
Devrait afficher `"loaded": true`

### 3. Test de connexion
```
http://localhost:8080/Tbc_Groupe/backend/test_db.php
```
Devrait afficher `"success": true`

### 4. Connexion admin
Essayez de vous connecter depuis l'interface admin

---

## ⚠️ Important

- **Ne modifiez QUE les lignes 947 et 949**
- **Enlevez SEULEMENT le `;`** au début
- **Redémarrez Apache** (pas juste recharger)
- **Vérifiez** avec `php -m | findstr pdo_pgsql`

---

## 🆘 Si ça ne fonctionne pas

1. Vérifiez que vous avez bien sauvegardé php.ini
2. Vérifiez que Apache est bien redémarré (Stop puis Start)
3. Vérifiez que les DLL existent : `C:\xampp\php\ext\php_pdo_pgsql.dll`
4. Testez avec : `http://localhost:8080/Tbc_Groupe/backend/verifier_extension.php`


