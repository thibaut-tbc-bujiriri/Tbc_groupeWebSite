# 📊 Mapping Base de Données ↔️ Interfaces Utilisateur

## Vue d'ensemble

Ce document explique comment chaque table de la base de données est connectée aux différentes pages et interfaces du site Tbc Groupe.

---

## 🔗 Schéma de Connexion

```
Base de Données (MySQL) 
    ↓ (via API PHP)
Backend API (REST)
    ↓ (via fetch/axios)
Frontend React (Pages & Composants)
    ↓
Interface Utilisateur
```

---

## 📋 Tables et leurs Utilisations

### 1️⃣ Table: `users` 👥

**Rôle:** Gestion des utilisateurs administrateurs du site

**Colonnes principales:**
- `id`, `email`, `password_hash`, `full_name`, `role`, `is_active`, `last_login`

**Connectée à:**
- ✅ **Page Login** (`src/pages/Login.jsx`)
  - Utilisation: Authentification des administrateurs
  - API: `POST /api/auth` → Table `users`
  
- ✅ **API Auth** (`backend/api/auth.php`)
  - Vérifie email/mot de passe dans `users`
  - Met à jour `last_login` lors de la connexion
  - Retourne un token de session

**Utilisation actuelle:**
- Page de connexion pour accéder au mode admin
- Gestion des permissions (admin/editor)
- Suivi des dernières connexions

---

### 2️⃣ Table: `trainers` 👨‍🏫

**Rôle:** Stockage des informations des formateurs

**Colonnes principales:**
- `id`, `name`, `title`, `bio`, `bio_extended`, `image_url`, `image_base64`, `email`, `phone`, `is_active`

**Connectée à:**
- ✅ **Page Trainers** (`src/pages/Trainers.jsx`)
  - **Actuellement:** Utilise `localStorage` via `trainersData.js`
  - **Devrait utiliser:** `GET /api/trainers` → Table `trainers`
  - Affiche la liste de tous les formateurs actifs
  - Mode admin permet d'ajouter/supprimer

- ✅ **Page Trainer** (`src/pages/Trainer.jsx`)
  - **Actuellement:** Données codées en dur
  - **Devrait utiliser:** `GET /api/trainers/{id}` → Table `trainers`
  - Affiche les détails d'un formateur spécifique

- ✅ **API Trainers** (`backend/api/trainers.php`)
  - `GET /api/trainers` → Liste tous les formateurs actifs
  - `GET /api/trainers/{id}` → Détails d'un formateur
  - `POST /api/trainers` → Créer un formateur
  - `PUT /api/trainers/{id}` → Mettre à jour
  - `DELETE /api/trainers/{id}` → Soft delete (is_active = 0)

**Tables liées:**
- `trainer_experiences` (expériences du formateur)
- `trainer_skills` (compétences du formateur)
- `trainer_technologies` (technologies maîtrisées)

---

### 3️⃣ Table: `trainer_experiences` 📚

**Rôle:** Stockage des expériences professionnelles de chaque formateur

**Colonnes principales:**
- `id`, `trainer_id`, `year`, `title`, `description`, `display_order`

**Connectée à:**
- ✅ **Page Trainer** (`src/pages/Trainer.jsx`)
  - Section "Expérience"
  - **Actuellement:** Données codées en dur
  - **Devrait utiliser:** Inclus dans `GET /api/trainers/{id}` (déjà implémenté dans l'API)

- ✅ **API Trainers** (`backend/api/trainers.php`)
  - Récupérée automatiquement avec `getTrainerExperiences($db, $trainer_id)`
  - Incluse dans la réponse JSON du formateur

**Relation:** 
- `trainer_id` → `trainers.id` (Foreign Key)

---

### 4️⃣ Table: `trainer_skills` 🎯

**Rôle:** Compétences techniques avec niveau (0-100%)

**Colonnes principales:**
- `id`, `trainer_id`, `skill_name`, `skill_level` (0-100), `display_order`

**Connectée à:**
- ✅ **Page Trainer** (`src/pages/Trainer.jsx`)
  - Section "Compétences Techniques"
  - Affiche des barres de progression
  - **Actuellement:** Données codées en dur
  - **Devrait utiliser:** Inclus dans `GET /api/trainers/{id}`

- ✅ **API Trainers** (`backend/api/trainers.php`)
  - Récupérée avec `getTrainerSkills($db, $trainer_id)`

**Relation:**
- `trainer_id` → `trainers.id` (Foreign Key)

---

### 5️⃣ Table: `trainer_technologies` 💻

**Rôle:** Liste des technologies maîtrisées par chaque formateur

**Colonnes principales:**
- `id`, `trainer_id`, `technology_name`, `display_order`

**Connectée à:**
- ✅ **Page Trainer** (`src/pages/Trainer.jsx`)
  - Section "Technologies Maîtrisées"
  - Affichage en badges/pills
  - **Actuellement:** Données codées en dur
  - **Devrait utiliser:** Inclus dans `GET /api/trainers/{id}`

- ✅ **API Trainers** (`backend/api/trainers.php`)
  - Récupérée avec `getTrainerTechnologies($db, $trainer_id)`

**Relation:**
- `trainer_id` → `trainers.id` (Foreign Key)

---

### 6️⃣ Table: `services` 🛠️

**Rôle:** Services offerts par l'entreprise

**Colonnes principales:**
- `id`, `title`, `description`, `icon_name`, `features` (JSON), `technologies` (JSON), `is_active`, `display_order`

**Connectée à:**
- ✅ **Page Services** (`src/pages/Services.jsx`)
  - **Actuellement:** Données codées en dur dans le composant
  - **Devrait utiliser:** `GET /api/services` → Table `services`
  - Affiche tous les services avec leurs caractéristiques

- ✅ **Page Home** (`src/pages/Home.jsx`)
  - Section "Nos Services" (aperçu)
  - **Actuellement:** Données codées en dur
  - **Devrait utiliser:** `GET /api/services` (limité aux 4 premiers)

- ✅ **API Services** (`backend/api/services.php`)
  - `GET /api/services` → Liste tous les services actifs
  - Décode les champs JSON (`features`, `technologies`)

**Données JSON:**
- `features`: Array de strings (ex: ["Feature 1", "Feature 2"])
- `technologies`: Array de strings (ex: ["React", "Node.js"])

---

### 7️⃣ Table: `portfolio_projects` 🎨

**Rôle:** Projets du portfolio de l'entreprise

**Colonnes principales:**
- `id`, `title`, `description`, `image_url`, `image_base64`, `technologies` (JSON), `project_url`, `github_url`, `category`, `is_featured`, `is_active`, `display_order`

**Connectée à:**
- ✅ **Page Portfolio** (`src/pages/Portfolio.jsx`)
  - **Actuellement:** Données codées en dur dans le composant
  - **Devrait utiliser:** `GET /api/portfolio` (à créer) → Table `portfolio_projects`
  - Affiche tous les projets actifs dans une grille

- ⚠️ **API Portfolio** (`backend/api/portfolio.php`)
  - **À CRÉER:** Endpoint manquant pour récupérer les projets

**État actuel:**
- ❌ **PAS CONNECTÉ** - Les données sont codées en dur dans React
- ✅ Table existe en base de données
- ❌ API endpoint manquant

---

### 8️⃣ Table: `contact_messages` 📧

**Rôle:** Messages reçus via le formulaire de contact

**Colonnes principales:**
- `id`, `name`, `email`, `message`, `subject`, `phone`, `is_read`, `read_at`, `read_by`, `created_at`

**Connectée à:**
- ✅ **Page Contact** (`src/pages/Contact.jsx`)
  - **Actuellement:** Utilise Formspree (service externe)
  - **Devrait utiliser:** `POST /api/contact` → Table `contact_messages`
  - Envoie le message au backend qui le stocke en BDD

- ✅ **Panel Admin** (à créer)
  - **Devrait utiliser:** `GET /api/contact` → Liste tous les messages
  - `GET /api/contact?is_read=0` → Messages non lus
  - `PUT /api/contact` → Marquer comme lu

- ✅ **API Contact** (`backend/api/contact.php`)
  - `GET /api/contact` → Récupère tous les messages
  - `POST /api/contact` → Crée un nouveau message
  - `PUT /api/contact` → Marque un message comme lu

**Relation:**
- `read_by` → `users.id` (Foreign Key - quel admin a lu le message)

**État actuel:**
- ⚠️ Le formulaire utilise Formspree au lieu de l'API
- ✅ L'API backend existe et fonctionne

---

### 9️⃣ Table: `site_settings` ⚙️

**Rôle:** Paramètres et configuration du site

**Colonnes principales:**
- `id`, `setting_key`, `setting_value`, `setting_type`, `description`

**Connectée à:**
- ✅ **Données initiales:** Informations de l'entreprise (nom, email, téléphone, adresse)
- ❌ **PAS ENCORE UTILISÉE** dans les interfaces
- 📝 **Potentiel:** 
  - Configuration dynamique du site
  - Informations de contact affichées dynamiquement
  - SEO meta tags
  - Paramètres globaux

**État actuel:**
- ✅ Table existe avec données initiales
- ❌ Aucune API endpoint pour récupérer les paramètres
- ❌ Aucune interface pour modifier les paramètres

---

### 🔟 Table: `training_programs` 🎓

**Rôle:** Programmes de formation proposés

**Colonnes principales:**
- `id`, `trainer_id`, `title`, `description`, `duration`, `price`, `icon_name`, `is_active`, `display_order`

**Connectée à:**
- ✅ **Page Trainer** (`src/pages/Trainer.jsx`)
  - Section "Prestations de Formation"
  - **Actuellement:** Données codées en dur
  - **Devrait utiliser:** `GET /api/training-programs?trainer_id={id}` (à créer)

- ❌ **API Training Programs** (`backend/api/training-programs.php`)
  - **À CRÉER:** Endpoint manquant

**Relation:**
- `trainer_id` → `trainers.id` (Foreign Key)

**État actuel:**
- ✅ Table existe en base de données
- ❌ Aucune API endpoint
- ❌ Données codées en dur dans React

---

## 🔍 Vues (Views)

### `v_trainers_details` 👁️

**Rôle:** Vue agrégée des formateurs avec statistiques

**Contenu:**
- Informations du formateur
- Nombre d'expériences
- Nombre de compétences
- Nombre de technologies

**Connectée à:**
- ❌ **PAS ENCORE UTILISÉE** dans les interfaces
- 📝 **Potentiel:** Dashboard admin avec statistiques

---

### `v_unread_messages` 👁️

**Rôle:** Vue des messages de contact non lus

**Contenu:**
- Tous les messages non lus
- Informations sur qui les a lus (si applicable)

**Connectée à:**
- ❌ **PAS ENCORE UTILISÉE**
- 📝 **Potentiel:** Panel admin avec notification du nombre de messages non lus

---

## 📊 Résumé de l'État Actuel

### ✅ Tables COMPLÈTEMENT Connectées
1. **`users`** → Login/Auth fonctionnel
2. **`trainers`** → API complète, mais frontend utilise localStorage
3. **`trainer_experiences`** → Inclus dans API trainers
4. **`trainer_skills`** → Inclus dans API trainers
5. **`trainer_technologies`** → Inclus dans API trainers
6. **`services`** → API existe, mais frontend utilise données codées
7. **`contact_messages`** → API existe, mais frontend utilise Formspree

### ⚠️ Tables PARTIELLEMENT Connectées
1. **`portfolio_projects`** → Table existe, mais pas d'API ni de connexion frontend
2. **`training_programs`** → Table existe, mais pas d'API ni de connexion frontend
3. **`site_settings`** → Table existe avec données, mais pas utilisée

### 📝 Tableaux de Bord Admin Manquants
- Panel de gestion des messages de contact
- Gestion du portfolio
- Gestion des programmes de formation
- Paramètres du site

---

## 🚀 Actions Recommandées

### Priorité 1 - Connecter les APIs existantes au Frontend
1. ✅ **Page Trainers** → Remplacer `localStorage` par `GET /api/trainers`
2. ✅ **Page Services** → Utiliser `GET /api/services` au lieu de données codées
3. ✅ **Page Contact** → Utiliser `POST /api/contact` au lieu de Formspree

### Priorité 2 - Créer les APIs manquantes
1. ⚠️ **API Portfolio** → `GET /api/portfolio` pour récupérer les projets
2. ⚠️ **API Training Programs** → `GET /api/training-programs`
3. ⚠️ **API Settings** → `GET /api/settings` pour récupérer les paramètres

### Priorité 3 - Panel Admin
1. 📋 Dashboard avec statistiques
2. 📧 Gestion des messages de contact
3. 🎨 Gestion du portfolio
4. ⚙️ Configuration des paramètres du site

---

## 📝 Notes Techniques

### Base URL de l'API
Actuellement configurée pour: `http://localhost:8000` (serveur PHP intégré)
À adapter pour: `http://localhost:8080/Tbc_Groupe/backend` (XAMPP Apache)

### Format des Réponses API
```json
{
  "success": true,
  "data": [...],
  "count": 0,
  "message": "..."
}
```

### Gestion des Images
- Support `image_url` (URL externe)
- Support `image_base64` (images encodées en base64)
- Préférence: Utiliser base64 pour stockage en base de données

---

**Dernière mise à jour:** 2024
**Version du schéma:** 1.0

