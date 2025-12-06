# 🔐 Guide - Système de Rôles Administrateurs

## 📋 Vue d'ensemble

Ce système permet de gérer différents niveaux d'accès dans l'interface d'administration :

- **Super Admin** : Accès complet à toutes les fonctionnalités + gestion des autres admins
- **Admin** : Accès limité à Formateurs, Messages, Programmes (peut modifier mais pas supprimer)
- **Editor** : Même permissions que Admin (pour futures extensions)

## ✅ Ce qui a été créé

### 1. Script SQL de mise à jour
**Fichier:** `database/update_roles.sql`
- Ajoute le rôle `super_admin` à la table `users`
- Met à jour votre compte en `super_admin`

### 2. API de gestion des admins
**Fichier:** `backend/api/admins.php`
- GET `/api/admins` - Liste tous les admins
- GET `/api/admins/{id}` - Détails d'un admin
- POST `/api/admins` - Créer un nouvel admin
- PUT `/api/admins/{id}` - Modifier un admin
- DELETE `/api/admins/{id}` - Désactiver un admin

### 3. Routage
**Fichier:** `backend/index.php`
- Route `/api/admins` ajoutée

## 🔨 À compléter

### Étape 1 : Mettre à jour la base de données

Exécutez le script SQL dans votre base de données :

```sql
-- Via phpMyAdmin ou ligne de commande MySQL
SOURCE database/update_roles.sql;
```

Ou copiez-collez le contenu de `database/update_roles.sql` dans phpMyAdmin.

### Étape 2 : Modifier AuthContext pour utiliser l'API

Le fichier `src/contexts/AuthContext.jsx` doit être modifié pour :
- Utiliser l'API backend au lieu des identifiants hardcodés
- Stocker le rôle de l'utilisateur dans le contexte
- Retourner le rôle avec les informations d'authentification

### Étape 3 : Créer l'interface de gestion des admins

Créer `src/components/admin/AdminsSection.jsx` avec :
- Liste des admins existants
- Formulaire pour créer un nouvel admin
- Options pour modifier/désactiver les admins
- Visible uniquement pour les super_admin

### Étape 4 : Modifier Admin.jsx

- Ajouter une section "Gestion des admins" visible uniquement pour super_admin
- Filtrer les sections selon le rôle :
  - Super Admin : Toutes les sections
  - Admin : Seulement Formateurs, Messages, Programmes

### Étape 5 : Restreindre les actions dans les sections

**TrainersSection.jsx :**
- Admin peut : Créer, Modifier
- Admin ne peut pas : Supprimer
- Super Admin : Tous les droits

**TrainingProgramsSection.jsx :**
- Admin peut : Créer, Modifier
- Admin ne peut pas : Supprimer
- Super Admin : Tous les droits

**MessagesSection.jsx :**
- Admin : Accès complet (lecture/écriture)

## 🎯 Permissions par rôle

| Section | Super Admin | Admin |
|---------|-------------|-------|
| Formateurs | ✅ CRUD complet | ✅ Créer, Modifier ❌ Supprimer |
| Services | ✅ CRUD complet | ❌ Accès refusé |
| Portfolio | ✅ CRUD complet | ❌ Accès refusé |
| Messages | ✅ CRUD complet | ✅ CRUD complet |
| Programmes | ✅ CRUD complet | ✅ Créer, Modifier ❌ Supprimer |
| Paramètres | ✅ CRUD complet | ❌ Accès refusé |
| Gestion Admins | ✅ CRUD complet | ❌ Accès refusé |

## 🔑 Rôles dans la base de données

- `super_admin` : Accès complet
- `admin` : Accès limité (Formateurs, Messages, Programmes - sans suppression)
- `editor` : Même permissions que admin (pour extensions futures)

## 📝 Notes importantes

1. **Mot de passe du Super Admin** : Assurez-vous que votre mot de passe dans la base de données est hashé avec `password_hash()` de PHP.

2. **Sécurité** : L'API `admins.php` vérifie que seul un `super_admin` peut créer/gérer d'autres admins.

3. **Session** : L'authentification utilise les sessions PHP. Assurez-vous que les sessions fonctionnent correctement.

4. **Premier Admin** : Votre compte (`thibauttbcbujiriri@gmail.com`) doit être mis à jour en `super_admin` via le script SQL.

## 🚀 Prochaines étapes

1. Exécuter le script SQL pour mettre à jour les rôles
2. Modifier AuthContext pour utiliser l'API
3. Créer l'interface AdminsSection
4. Modifier Admin.jsx pour filtrer les sections
5. Restreindre les actions dans TrainersSection et TrainingProgramsSection





