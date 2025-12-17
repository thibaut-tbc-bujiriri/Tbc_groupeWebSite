# 🚀 Installation des Dépendances Supabase

## ✅ Configuration terminée

Tous les identifiants Supabase ont été mis à jour dans les fichiers de configuration :

### Backend PHP
- ✅ `backend/config/env.local.php` - Host mis à jour
- ✅ `backend/config/env.php` - Host mis à jour
- ✅ Mot de passe : `thi@.32aThibaut`

### Frontend
- ✅ `.env` - URL et API Key mises à jour

### Nouveaux identifiants configurés :
- **Project URL** : `https://emnuxospjuvxzxfeecut.supabase.co`
- **API Key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Database Host** : `db.emnuxospjuvxzxfeecut.supabase.co`
- **Database Password** : `thi@.32aThibaut`

---

## 📦 Installation des Dépendances

### Étape 1 : Installer les dépendances Node.js

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

Cette commande installera toutes les dépendances, y compris :
- ✅ `@supabase/supabase-js` (déjà dans package.json)
- ✅ React et toutes les autres dépendances

### Étape 2 : Vérifier l'installation

Vérifiez que Supabase est bien installé :

```bash
npm list @supabase/supabase-js
```

Vous devriez voir quelque chose comme :
```
@supabase/supabase-js@2.87.3
```

---

## 🔧 Configuration PHP (Backend)

### Vérifier l'extension PostgreSQL

L'extension `pdo_pgsql` doit être activée dans PHP pour que le backend puisse se connecter à Supabase.

#### Windows (XAMPP)

1. Ouvrez le fichier `php.ini` dans XAMPP :
   - Chemin : `C:\xampp\php\php.ini`

2. Cherchez ces lignes et décommentez-les (enlevez le `;` au début) :
   ```ini
   extension=pdo_pgsql
   extension=pgsql
   ```

3. Redémarrez Apache dans XAMPP

4. Vérifiez que l'extension est chargée :
   ```bash
   php -m | findstr pdo_pgsql
   ```

---

## 🧪 Tests de Connexion

### Test 1 : Backend PHP

Ouvrez dans votre navigateur :
```
http://localhost:8080/Tbc_Groupe/backend/test_db.php
```

Vous devriez voir :
- ✅ Extension `pdo_pgsql` chargée
- ✅ Connexion à Supabase réussie
- ✅ Version de PostgreSQL

### Test 2 : API d'authentification

Ouvrez :
```
http://localhost:8080/Tbc_Groupe/backend/api/test-auth.php
```

Ce script vérifie :
- ✅ Connexion à Supabase
- ✅ Structure de la table `users`
- ✅ Type ENUM `user_role`
- ✅ Utilisateurs existants

### Test 3 : Frontend

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez : `http://localhost:5173`

3. Testez la connexion admin : `http://localhost:5173/login`

---

## 📝 Commandes Utiles

### Installer les dépendances
```bash
npm install
```

### Démarrer le serveur de développement
```bash
npm run dev
```

### Build pour la production
```bash
npm run build
```

### Vérifier les dépendances Supabase
```bash
npm list @supabase/supabase-js
```

### Réinstaller les dépendances (si problème)
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Checklist d'Installation

- [ ] Dépendances Node.js installées (`npm install`)
- [ ] Extension `pdo_pgsql` activée dans `php.ini`
- [ ] Apache redémarré (XAMPP)
- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] Test backend réussi (`test_db.php`)
- [ ] Test API auth réussi (`test-auth.php`)
- [ ] Serveur de développement démarré (`npm run dev`)
- [ ] Connexion admin fonctionnelle

---

## 🐛 Dépannage

### Erreur : "Cannot find module '@supabase/supabase-js'"

**Solution :**
```bash
npm install @supabase/supabase-js
```

### Erreur : "Extension pdo_pgsql not loaded"

**Solution :**
1. Ouvrez `php.ini`
2. Décommentez : `extension=pdo_pgsql`
3. Redémarrez Apache

### Erreur : "Failed to fetch" lors de la connexion

**Vérifications :**
1. Vérifiez que le fichier `.env` existe et contient les bonnes valeurs
2. Redémarrez le serveur de développement : `npm run dev`
3. Vérifiez que Apache est démarré sur le port 8080

---

## 🎯 Prochaines Étapes

1. **Exécuter le script SQL dans Supabase** :
   - Ouvrez Supabase SQL Editor
   - Exécutez `database/migration_complete_supabase.sql`

2. **Tester la connexion** :
   - Backend : `test_db.php`
   - Frontend : Connexion admin

3. **Migrer vos données** (si nécessaire) :
   - Utilisez `database/script_migration_donnees.sql`

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs : `backend/logs/php_errors.log`
2. Testez avec les scripts de diagnostic
3. Vérifiez que tous les identifiants sont corrects


