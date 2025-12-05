# 📝 Instructions pour finaliser le système de rôles

## ✅ Déjà fait

1. ✅ Script SQL créé (`database/update_roles.sql`)
2. ✅ API admins créée (`backend/api/admins.php`)
3. ✅ AuthContext modifié pour utiliser l'API backend
4. ✅ Login.jsx modifié pour utiliser l'API
5. ✅ Interface AdminsSection créée

## 🔧 À faire maintenant

### Étape 1 : Exécuter le script SQL

Dans phpMyAdmin ou MySQL :
```sql
-- Exécuter le contenu de database/update_roles.sql
USE tbc_groupe;
ALTER TABLE users MODIFY COLUMN role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor';
UPDATE users SET role = 'super_admin' WHERE email = 'thibauttbcbujiriri@gmail.com';
```

### Étape 2 : Vérifier que votre mot de passe est hashé

Vérifiez dans la table `users` que votre mot de passe est hashé avec `password_hash()`.

Si non, vous pouvez le mettre à jour :
```sql
UPDATE users 
SET password_hash = '$2y$10$...' -- Remplacer par un hash généré avec password_hash()
WHERE email = 'thibauttbcbujiriri@gmail.com';
```

Ou via PHP :
```php
echo password_hash('thib@.32a', PASSWORD_DEFAULT);
```

### Étape 3 : Modifier Admin.jsx

Ajouter la section "Gestion des admins" et filtrer les sections selon le rôle.

### Étape 4 : Modifier TrainersSection.jsx

Cacher le bouton "Supprimer" si l'utilisateur n'est pas super_admin.

### Étape 5 : Modifier TrainingProgramsSection.jsx

Cacher le bouton "Supprimer" si l'utilisateur n'est pas super_admin.

## 📋 Code à ajouter/modifier

### Dans Admin.jsx

Ajouter :
- Import de AdminsSection
- Import de `isSuperAdmin` depuis useAuth
- Ajouter "Gestion des Admins" dans menuItems (visible seulement pour super_admin)
- Filtrer les sections selon le rôle

### Dans TrainersSection.jsx et TrainingProgramsSection.jsx

- Importer `useAuth`
- Récupérer `isSuperAdmin`
- Conditionner l'affichage du bouton "Supprimer" : `{isSuperAdmin() && <button>Supprimer</button>}`

## 🎯 Structure finale

```
Super Admin voit :
- Formateurs (CRUD complet)
- Services (CRUD complet)
- Portfolio (CRUD complet)
- Messages (CRUD complet)
- Programmes (CRUD complet)
- Paramètres (CRUD complet)
- Gestion des Admins (CRUD complet)

Admin/Editor voit :
- Formateurs (Créer, Modifier - PAS Supprimer)
- Messages (CRUD complet)
- Programmes (Créer, Modifier - PAS Supprimer)
```

## ⚠️ Notes importantes

1. Les sessions PHP doivent fonctionner correctement
2. Le CORS doit autoriser les credentials (déjà configuré)
3. Vérifiez que l'API auth retourne bien le rôle dans la réponse



