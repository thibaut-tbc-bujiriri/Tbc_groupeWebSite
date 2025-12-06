# 🎛️ Guide Complet de l'Interface Admin - Tbc Groupe

## 📋 Vue d'ensemble

L'interface Admin vous permet de gérer **TOUTES** les tables de votre base de données depuis une interface unique et intuitive.

## 🚀 Accès à l'Interface Admin

### 1. Connexion
- Cliquez sur **"Se connecter"** dans le menu de navigation
- Identifiants :
  - **Email** : `thibauttbcbujiriri@gmail.com`
  - **Mot de passe** : `thib@.32a`

### 2. Accès Admin
- Après connexion, cliquez sur **"Admin"** dans le menu
- Ou accédez directement à : `http://localhost:5173/admin`

---

## 📊 Sections Disponibles dans l'Admin

L'interface Admin est organisée avec un **menu latéral** qui contient toutes les sections :

### 1️⃣ **Formateurs** 👨‍🏫
- **Table** : `trainers`
- **API** : `/api/trainers`
- **Fonctionnalités** :
  - ✅ Voir tous les formateurs
  - ✅ Ajouter un formateur
  - ✅ Modifier un formateur
  - ✅ Supprimer un formateur
  - ✅ Upload d'image (base64)
  - ✅ Gestion bio courte/étendue

**Tables liées incluses automatiquement :**
- `trainer_experiences` (via API trainers)
- `trainer_skills` (via API trainers)
- `trainer_technologies` (via API trainers)

---

### 2️⃣ **Services** 🛠️
- **Table** : `services`
- **API** : `/api/services`
- **Fonctionnalités** :
  - ✅ Voir tous les services
  - ✅ Ajouter un service
  - ✅ Modifier un service
  - ✅ Supprimer un service
  - ✅ Gestion des features (liste)
  - ✅ Gestion des technologies (liste)
  - ✅ Icône du service
  - ✅ Ordre d'affichage

---

### 3️⃣ **Portfolio** 🎨
- **Table** : `portfolio_projects`
- **API** : `/api/portfolio`
- **Fonctionnalités** :
  - ✅ Voir tous les projets
  - ✅ Ajouter un projet
  - ✅ Modifier un projet
  - ✅ Supprimer un projet
  - ✅ Upload d'image
  - ✅ URL du projet
  - ✅ URL GitHub
  - ✅ Catégorie
  - ✅ Projet en vedette
  - ✅ Technologies utilisées

---

### 4️⃣ **Messages** 📧
- **Table** : `contact_messages`
- **API** : `/api/contact`
- **Fonctionnalités** :
  - ✅ Voir tous les messages
  - ✅ Filtrer par statut (lus/non lus)
  - ✅ Marquer comme lu
  - ✅ Voir les détails (nom, email, sujet, message)
  - ✅ Date de réception

---

### 5️⃣ **Programmes** 🎓
- **Table** : `training_programs`
- **API** : `/api/training-programs`
- **Fonctionnalités** :
  - ✅ Voir tous les programmes
  - ✅ Ajouter un programme
  - ✅ Modifier un programme
  - ✅ Supprimer un programme
  - ✅ Lier à un formateur (trainer_id)
  - ✅ Durée du programme
  - ✅ Prix
  - ✅ Icône
  - ✅ Ordre d'affichage

---

### 6️⃣ **Paramètres** ⚙️
- **Table** : `site_settings`
- **API** : `/api/settings`
- **Fonctionnalités** :
  - ✅ Voir tous les paramètres
  - ✅ Modifier un paramètre
  - ✅ Ajouter un nouveau paramètre
  - ✅ Supprimer un paramètre
  - ✅ Gestion par clé/valeur
  - ✅ Types de paramètres (text, email, textarea)

**Paramètres par défaut disponibles :**
- `company_name` - Nom de l'entreprise
- `company_email` - Email principal
- `company_phone` - Téléphone
- `company_address` - Adresse
- `company_city` - Ville
- `company_region` - Province/Région
- `company_country` - Pays
- `company_description` - Description
- `site_title` - Titre du site
- `site_description` - Description SEO

---

## 🎨 Navigation dans l'Interface

### Menu Latéral
Le menu latéral permet de naviguer entre toutes les sections :
- **Icônes** : Chaque section a une icône distinctive
- **Actif** : La section active est surlignée en bleu
- **Réduire** : Bouton pour réduire/agrandir le menu latéral

### Top Bar
- Affiche le nom de la section active
- Bouton menu pour afficher/masquer le sidebar (mobile)

### Zone de Contenu
- Liste des éléments de la section
- Bouton "Ajouter" pour créer un nouvel élément
- Formulaire d'ajout/modification
- Actions (Modifier, Supprimer) sur chaque élément

---

## 🔧 Fonctionnalités Communes

### Formulaire d'Ajout/Modification
- **Champs obligatoires** : Marqués avec un *
- **Validation** : Vérification avant envoi
- **Image Upload** : Glisser-déposer ou cliquer pour uploader
- **Annuler** : Bouton pour fermer sans sauvegarder
- **Sauvegarder** : Enregistre les modifications

### Actions sur les Éléments
- **✏️ Modifier** : Ouvre le formulaire pré-rempli
- **🗑️ Supprimer** : Supprime l'élément (avec confirmation)
- **👁️ Voir** : Affiche les détails complets

### Feedback Utilisateur
- **Toast notifications** : Messages de succès/erreur
- **Loading states** : Indicateurs de chargement
- **Erreurs** : Messages d'erreur clairs

---

## 📡 Connexion aux APIs

Toutes les sections sont connectées aux APIs backend :

### URL Base de l'API
```
http://localhost:8080/Tbc_Groupe/backend
```

### Endpoints Utilisés

| Section | Endpoint | Méthodes |
|---------|----------|----------|
| Formateurs | `/api/trainers` | GET, POST, PUT, DELETE |
| Services | `/api/services` | GET, POST, PUT, DELETE |
| Portfolio | `/api/portfolio` | GET, POST, PUT, DELETE |
| Messages | `/api/contact` | GET, POST, PUT |
| Programmes | `/api/training-programs` | GET, POST, PUT, DELETE |
| Paramètres | `/api/settings` | GET, POST, PUT, DELETE |

---

## 🔐 Sécurité

### Authentification
- L'accès à l'Admin nécessite une connexion
- Redirection automatique vers `/login` si non connecté
- Session stockée dans `localStorage`

### Protection des Routes
- Vérification de l'authentification avant l'accès
- Logout automatique si session expirée

---

## 📝 Exemples d'Utilisation

### Ajouter un Formateur
1. Cliquez sur **"Formateurs"** dans le menu
2. Cliquez sur **"Ajouter un Formateur"**
3. Remplissez le formulaire :
   - Nom complet *
   - Titre/Poste *
   - Bio courte *
   - (Optionnel) Bio complète, email, téléphone, photo
4. Cliquez sur **"Ajouter"**

### Modifier un Service
1. Cliquez sur **"Services"** dans le menu
2. Trouvez le service à modifier
3. Cliquez sur l'icône **✏️ Modifier**
4. Modifiez les informations
5. Cliquez sur **"Modifier"**

### Voir les Messages Non Lus
1. Cliquez sur **"Messages"** dans le menu
2. Les messages s'affichent par défaut (tous)
3. Cliquez sur un message pour le marquer comme lu

### Modifier un Paramètre du Site
1. Cliquez sur **"Paramètres"** dans le menu
2. Trouvez le paramètre à modifier (ex: `company_email`)
3. Modifiez la valeur
4. Cliquez sur **"Sauvegarder"**

---

## 🚨 Dépannage

### Erreur "Erreur de connexion à l'API"
**Solutions :**
1. Vérifiez que XAMPP est démarré (Apache 8080, MySQL 3307)
2. Vérifiez l'URL de l'API dans les composants
3. Ouvrez la console du navigateur (F12) pour voir l'erreur exacte
4. Testez l'API directement : `http://localhost:8080/Tbc_Groupe/backend/api/trainers`

### Les données ne s'affichent pas
**Solutions :**
1. Vérifiez que la base de données contient des données
2. Vérifiez que les APIs retournent bien des données
3. Ouvrez la console du navigateur pour voir les erreurs
4. Vérifiez que `is_active = 1` pour les éléments actifs

### L'image ne s'affiche pas
**Solutions :**
1. Vérifiez que l'image a été uploadée correctement
2. Vérifiez la taille (max 5MB)
3. Vérifiez le format (PNG, JPG, GIF)
4. Vérifiez que le base64 est valide

---

## 📊 Tables Gérées

| Table | Section Admin | CRUD Complet |
|-------|--------------|--------------|
| `trainers` | Formateurs | ✅ |
| `services` | Services | ✅ |
| `portfolio_projects` | Portfolio | ✅ |
| `contact_messages` | Messages | ✅ (lecture + marquer lu) |
| `training_programs` | Programmes | ✅ |
| `site_settings` | Paramètres | ✅ |
| `users` | (via Login) | ⚠️ À améliorer |

**Tables liées gérées automatiquement :**
- `trainer_experiences` (via trainers)
- `trainer_skills` (via trainers)
- `trainer_technologies` (via trainers)

---

## 🎯 Bonnes Pratiques

### Gestion des Images
- **Taille recommandée** : < 2MB pour de meilleures performances
- **Format** : PNG ou JPG de préférence
- **Dimensions** : 800x600px recommandé pour les formateurs

### Gestion des Données
- Toujours tester avant de supprimer
- Utiliser les soft deletes (is_active = 0) plutôt que suppression définitive
- Sauvegarder régulièrement la base de données

### Organisation
- Utiliser `display_order` pour ordonner les éléments
- Activer/désactiver plutôt que supprimer
- Garder les données cohérentes entre les tables liées

---

## 🔄 Workflow Recommandé

### Configuration Initiale
1. **Paramètres** : Configurez les informations de l'entreprise
2. **Formateurs** : Ajoutez les formateurs avec leurs informations
3. **Services** : Créez les services offerts
4. **Programmes** : Ajoutez les programmes de formation
5. **Portfolio** : Ajoutez les projets réalisés

### Maintenance Quotidienne
1. **Messages** : Consultez et répondez aux messages
2. **Formateurs** : Mettez à jour les informations si nécessaire
3. **Portfolio** : Ajoutez de nouveaux projets

---

## 💡 Astuces

- **Raccourcis clavier** : Utilisez Tab pour naviguer dans les formulaires
- **Recherche** : Utilisez Ctrl+F pour rechercher dans les listes
- **Multi-onglets** : Vous pouvez ouvrir plusieurs sections dans différents onglets
- **Console** : Utilisez F12 pour voir les requêtes API et déboguer

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez ce guide
2. Consultez la console du navigateur (F12)
3. Vérifiez les logs PHP dans XAMPP
4. Testez les APIs directement via les URLs

---

**Dernière mise à jour** : 2024
**Version Admin** : 1.0





