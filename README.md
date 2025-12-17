# TBC Groupe - Site Web Professionnel

Site vitrine moderne et professionnel pour TBC Groupe, entreprise spécialisée en développement web et mobile, référencement SEO et formations JavaScript.

## 🚀 Technologies Utilisées

### Frontend
- **React 18** - Framework JavaScript pour l'interface utilisateur
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation et routage
- **TailwindCSS** - Framework CSS utilitaire
- **Framer Motion** - Bibliothèque d'animations
- **React Hot Toast** - Notifications toast
- **Lucide React** - Icônes modernes

### Backend & Base de données
- **Supabase** - Backend-as-a-Service (PostgreSQL)
  - Authentification personnalisée
  - Base de données PostgreSQL
  - API REST automatique
  - Row Level Security (RLS)

## 📋 Fonctionnalités

- ✅ Site 100% responsive (mobile, tablette, desktop)
- ✅ Design moderne et professionnel
- ✅ Animations fluides avec Framer Motion
- ✅ Navigation intuitive
- ✅ **Panneau d'administration complet**
- ✅ **Authentification sécurisée** (bcrypt)
- ✅ **Gestion des rôles** (super_admin, admin, editor)
- ✅ Formulaire de contact avec stockage en base
- ✅ SEO optimisé (meta tags, OpenGraph)

## 🗂️ Structure du Projet

```
Tbc_Groupe/
├── src/
│   ├── components/
│   │   ├── admin/                    # Composants du panneau admin
│   │   │   ├── AdminsSection.jsx     # Gestion des administrateurs
│   │   │   ├── MessagesSection.jsx   # Gestion des messages
│   │   │   ├── PortfolioSection.jsx  # Gestion du portfolio
│   │   │   ├── ServicesSection.jsx   # Gestion des services
│   │   │   ├── SettingsSection.jsx   # Paramètres du site
│   │   │   ├── TrainersSection.jsx   # Gestion des formateurs
│   │   │   └── TrainingProgramsSection.jsx  # Programmes de formation
│   │   ├── Header.jsx                # En-tête avec navigation
│   │   ├── Footer.jsx                # Pied de page
│   │   ├── Layout.jsx                # Layout principal
│   │   └── ThemeToggle.jsx           # Basculement thème clair/sombre
│   ├── contexts/
│   │   ├── AuthContext.jsx           # Contexte d'authentification
│   │   └── ThemeContext.jsx          # Contexte du thème
│   ├── lib/
│   │   ├── supabaseClient.js         # Client Supabase
│   │   └── supabaseApi.js            # Services API Supabase
│   ├── pages/
│   │   ├── Home.jsx                  # Page d'accueil
│   │   ├── About.jsx                 # À propos
│   │   ├── Services.jsx              # Services
│   │   ├── Trainers.jsx              # Liste des formateurs
│   │   ├── Trainer.jsx               # Détail formateur
│   │   ├── Portfolio.jsx             # Portfolio/Réalisations
│   │   ├── Contact.jsx               # Contact avec formulaire
│   │   ├── Login.jsx                 # Page de connexion admin
│   │   └── Admin.jsx                 # Panneau d'administration
│   ├── App.jsx                       # Composant principal avec routes
│   ├── main.jsx                      # Point d'entrée
│   └── index.css                     # Styles globaux (Tailwind)
├── database/
│   ├── schema_supabase.sql           # Schéma de la base de données
│   ├── supabase_auth_functions.sql   # Fonctions d'authentification
│   └── ...                           # Autres scripts SQL
├── public/
│   └── images/                       # Images statiques
├── .env                              # Variables d'environnement (Supabase)
├── index.html                        # HTML principal
├── package.json                      # Dépendances
├── tailwind.config.js                # Configuration Tailwind
├── postcss.config.js                 # Configuration PostCSS
└── vite.config.js                    # Configuration Vite
```

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd Tbc_Groupe
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Supabase

Créez un fichier `.env` à la racine avec vos identifiants Supabase :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

### 4. Configurer la base de données

Exécutez les scripts SQL dans votre projet Supabase (SQL Editor) :

1. `database/schema_supabase.sql` - Crée les tables
2. `database/supabase_auth_functions.sql` - Fonctions d'authentification

### 5. Créer un administrateur

Dans Supabase SQL Editor :

```sql
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES ('admin@example.com', 'votremotdepasse', 'Administrateur', 'super_admin', true);
```

> Le mot de passe sera automatiquement hashé grâce au trigger.

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible à : `http://localhost:5173`

## 🔐 Panneau d'Administration

Accédez au panneau admin : `http://localhost:5173/login`

### Rôles disponibles

| Rôle | Permissions |
|------|-------------|
| `super_admin` | Accès complet (formateurs, services, portfolio, messages, programmes, paramètres, gestion des admins) |
| `admin` | Formateurs, messages, programmes |
| `editor` | Formateurs, messages, programmes (limité) |

### Fonctionnalités admin

- 👥 **Formateurs** - CRUD complet avec upload d'images
- 🛠️ **Services** - Gestion des services proposés
- 📁 **Portfolio** - Gestion des projets
- 📧 **Messages** - Lecture des messages de contact
- 🎓 **Programmes** - Programmes de formation
- ⚙️ **Paramètres** - Configuration du site
- 🛡️ **Admins** - Gestion des administrateurs

## 🏗️ Build pour Production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## 📦 Déploiement

### Vercel (recommandé)

```bash
npm install -g vercel
vercel
```

### Netlify

1. Build le projet : `npm run build`
2. Glissez-déposez le dossier `dist/` sur [Netlify Drop](https://app.netlify.com/drop)

> **Note** : Configurez les variables d'environnement Supabase dans les paramètres de déploiement.

## 🗄️ Base de Données (Supabase)

### Tables principales

| Table | Description |
|-------|-------------|
| `users` | Administrateurs et leurs rôles |
| `trainers` | Formateurs avec leurs informations |
| `services` | Services proposés |
| `portfolio_projects` | Projets du portfolio |
| `contact_messages` | Messages de contact |
| `training_programs` | Programmes de formation |
| `site_settings` | Paramètres du site |

### Sécurité

- Mots de passe hashés avec **bcrypt** (via trigger PostgreSQL)
- Row Level Security (RLS) activé
- Vérification des mots de passe côté serveur

## 📧 Informations de Contact

- **Entreprise** : TBC Groupe
- **Fondateur** : Thibaut Tbc Bujiriri
- **Email** : thibauttbcbujiriri@gmail.com
- **Téléphone** : +243 979 823 604
- **Localisation** : Office 2 – Kanisa La Mungu, Goma, Nord-Kivu, RDC

## 🎨 Personnalisation

### Couleurs

Modifiez les couleurs dans `tailwind.config.js` :

```javascript
colors: {
  primary: {
    // Vos couleurs personnalisées
  }
}
```

### Contenu

Les textes sont dans les fichiers de pages `src/pages/`.

## 📜 Licence

© 2024 TBC Groupe. Tous droits réservés.

## 🤝 Support

Pour toute question : thibauttbcbujiriri@gmail.com
