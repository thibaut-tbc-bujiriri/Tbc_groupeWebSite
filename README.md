# Tbc Groupe - Site Web Professionnel

Site vitrine moderne et professionnel pour Tbc Groupe, entreprise spécialisée en développement web et mobile, référencement SEO et formations JavaScript.

## 🚀 Technologies Utilisées

- **React 18** - Framework JavaScript pour l'interface utilisateur
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation et routage
- **TailwindCSS** - Framework CSS utilitaire
- **Framer Motion** - Bibliothèque d'animations
- **React Hot Toast** - Notifications toast
- **Formspree** - Service de gestion de formulaires (backendless)
- **Lucide React** - Icônes modernes

## 📋 Fonctionnalités

- ✅ Site 100% responsive (mobile, tablette, desktop)
- ✅ Design moderne et professionnel
- ✅ Animations fluides avec Framer Motion
- ✅ Navigation intuitive
- ✅ Formulaire de contact intégré avec Formspree
- ✅ SEO optimisé (meta tags, OpenGraph)
- ✅ Contenu professionnel complet

## 🗂️ Structure du Projet

```
tpc-groupe-website/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Header.jsx      # En-tête avec navigation
│   │   └── Footer.jsx      # Pied de page
│   ├── pages/              # Pages de l'application
│   │   ├── Home.jsx        # Page d'accueil
│   │   ├── About.jsx       # À propos
│   │   ├── Services.jsx    # Services
│   │   ├── Trainer.jsx     # Formateur Fullstack
│   │   ├── Portfolio.jsx   # Portfolio/Réalisations
│   │   └── Contact.jsx     # Contact avec formulaire
│   ├── App.jsx             # Composant principal
│   ├── main.jsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── index.html              # HTML principal
├── package.json            # Dépendances
└── vite.config.js          # Configuration Vite
```

## 🛠️ Installation

1. **Cloner ou télécharger le projet**

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer Formspree :**
   - Créez un compte sur [Formspree.io](https://formspree.io)
   - Créez un nouveau formulaire et récupérez l'endpoint
   - Ouvrez `src/pages/Contact.jsx`
   - Remplacez `YOUR_FORMSPREE_ENDPOINT_HERE` par votre endpoint Formspree
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
   ```

4. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur :**
   Le site sera accessible à l'adresse : `http://localhost:5173`

## 🏗️ Build pour Production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## 📦 Déploiement

Le site peut être déployé sur :

- **Vercel** : Connectez votre dépôt Git et déployez automatiquement
- **Netlify** : Glissez-déposez le dossier `dist/` ou connectez Git
- **GitHub Pages** : Utilisez GitHub Actions pour le déploiement automatique

### Déploiement sur Vercel

```bash
npm install -g vercel
vercel
```

### Déploiement sur Netlify

1. Build le projet : `npm run build`
2. Glissez-déposez le dossier `dist/` sur [Netlify Drop](https://app.netlify.com/drop)

## 📧 Informations de Contact

- **Entreprise** : Tbc Groupe
- **Fondateur** : Thibaut Tbc Bujiriri
- **Email** : thibauttbcbujiriri@gmail.com
- **Téléphone** : +243 979 823 604
- **Localisation** : Office 2 – Kanisa La Mungu, Goma, Nord-Kivu, RDC

## 📄 Pages du Site

### 🏠 Accueil
Page d'accueil avec hero section, présentation de l'entreprise, aperçu des services et appels à l'action.

### ℹ️ À propos
Présentation détaillée de l'entreprise, de la vision, de la mission et du fondateur.

### 🛠️ Services
Détails complets de tous les services offerts :
- Développement d'applications web
- Développement mobile
- Référencement SEO
- Formations en développement

### 👨‍🏫 Formateur Fullstack
Présentation de l'expertise, expérience, compétences techniques et prestations de formation.

### 💼 Portfolio
Galerie de projets réalisés avec cartes visuelles et informations techniques.

### 📞 Contact
Formulaire de contact fonctionnel avec Formspree pour recevoir les messages directement par email.

## 🎨 Personnalisation

### Couleurs
Les couleurs peuvent être modifiées dans `tailwind.config.js` :
```javascript
colors: {
  primary: {
    // Modifiez ici les couleurs primaires
  }
}
```

### Contenu
Tous les textes et contenus sont directement dans les fichiers des pages dans `src/pages/`.

## 📝 Notes

- Le site est 100% statique, aucun backend requis
- Le formulaire de contact nécessite une configuration Formspree
- Toutes les images de placeholder peuvent être remplacées par vos propres images
- Le site est prêt pour la production après configuration de Formspree

## 📜 Licence

© 2024 Tbc Groupe. Tous droits réservés.

## 🤝 Support

Pour toute question ou support, contactez-nous à : thibauttbcbujiriri@gmail.com
