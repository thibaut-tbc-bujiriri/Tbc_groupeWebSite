# 🔐 Guide d'Utilisation - Interface Admin

## 📍 Accès à l'Interface Admin

### Étape 1 : Se Connecter

1. **Cliquez sur "Se connecter"** dans le menu de navigation (en haut à droite)
2. Ou accédez directement à : `http://localhost:5173/login`

### Étape 2 : Identifiants

Utilisez ces identifiants pour vous connecter :
- **Email** : `thibauttbcbujiriri@gmail.com`
- **Mot de passe** : `thib@.32a`

### Étape 3 : Accès Admin

Après connexion, vous serez automatiquement redirigé vers la page **Admin**.

Le menu de navigation affichera maintenant **"Admin"** au lieu de "Se connecter".

---

## 🎯 Fonctionnalités de l'Interface Admin

### ✅ Gestion des Formateurs

#### Ajouter un Formateur

1. Cliquez sur le bouton **"Ajouter un Formateur"**
2. Remplissez le formulaire :
   - **Nom complet** * (obligatoire)
   - **Titre / Poste** * (obligatoire)
   - **Bio courte** * (obligatoire)
   - **Bio complète** (optionnel)
   - **Photo** (optionnel - glissez-déposez ou cliquez pour uploader)
   - **Email** (optionnel)
   - **Téléphone** (optionnel)
3. Cliquez sur **"Ajouter"**

#### Modifier un Formateur

1. Trouvez le formateur dans la liste
2. Cliquez sur l'icône **✏️ Modifier** (bleue) en haut à droite de la carte
3. Modifiez les informations souhaitées
4. Cliquez sur **"Modifier"**

#### Supprimer un Formateur

1. Trouvez le formateur dans la liste
2. Cliquez sur l'icône **🗑️ Supprimer** (rouge) en haut à droite de la carte
3. Confirmez la suppression

---

## 🔗 Connexion à la Base de Données

L'interface Admin est **connectée à l'API backend** qui utilise la base de données MySQL.

### Configuration API

L'URL de l'API est configurée dans `src/pages/Admin.jsx` :
```javascript
const API_BASE_URL = 'http://localhost:8080/Tbc_Groupe/backend'
```

### Endpoints Utilisés

- **GET** `/api/trainers` - Récupérer tous les formateurs
- **POST** `/api/trainers` - Ajouter un formateur
- **PUT** `/api/trainers/{id}` - Modifier un formateur
- **DELETE** `/api/trainers/{id}` - Supprimer un formateur

### Tables Utilisées

- **`trainers`** - Informations principales des formateurs
- Les données sont stockées directement en base de données MySQL

---

## 📋 Format des Données

### Image

Les images sont stockées en **base64** dans la colonne `image_base64` de la table `trainers`.

**Limites :**
- Taille maximale : 5MB
- Formats acceptés : PNG, JPG, GIF
- L'image est convertie automatiquement en base64

### Champs Obligatoires

- `name` - Nom complet
- `title` - Titre/Poste
- `bio` - Bio courte

### Champs Optionnels

- `bio_extended` - Bio complète
- `email` - Adresse email
- `phone` - Numéro de téléphone
- `image_base64` - Image en base64

---

## 🚨 Dépannage

### Erreur "Erreur de connexion à l'API"

**Vérifiez :**
1. ✅ XAMPP est démarré (Apache sur port 8080, MySQL sur port 3307)
2. ✅ L'URL de l'API est correcte dans `Admin.jsx`
3. ✅ Le backend PHP fonctionne
4. ✅ La base de données `tbc_groupe` existe
5. ✅ Les tables sont créées

### Les formateurs ne s'affichent pas

**Vérifiez :**
1. ✅ La connexion à la base de données fonctionne
2. ✅ La table `trainers` contient des données
3. ✅ Les formateurs ont `is_active = 1`
4. ✅ Ouvrez la console du navigateur (F12) pour voir les erreurs

### L'image ne s'affiche pas

**Vérifiez :**
1. ✅ L'image a été correctement uploadée
2. ✅ Le format base64 est valide
3. ✅ La taille de l'image ne dépasse pas 5MB

---

## 🔒 Sécurité

### Authentification

- L'authentification est gérée par `AuthContext`
- Les identifiants sont vérifiés côté client
- La session est stockée dans `localStorage`

### Recommandations pour la Production

⚠️ **Pour un site en production, il est recommandé de :**
- Utiliser l'API `/api/auth` pour l'authentification
- Implémenter JWT (JSON Web Tokens)
- Ajouter une validation côté serveur
- Utiliser HTTPS
- Ajouter un système de permissions plus robuste

---

## 📝 Notes

- Les modifications sont **immédiates** et **permanentes** (stockées en BDD)
- Les images sont stockées en base64 (peut être volumineux pour beaucoup d'images)
- Pour de grandes quantités d'images, envisagez de stocker les fichiers sur le serveur et utiliser `image_url`
- La page Admin est protégée : redirection automatique vers `/login` si non connecté

---

**Dernière mise à jour :** 2024















