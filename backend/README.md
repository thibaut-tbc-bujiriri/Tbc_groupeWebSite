# 🔧 Backend PHP - Tbc Groupe

## 📋 Description

Backend PHP pour l'API REST du site Tbc Groupe. Ce backend permet de connecter l'application React à la base de données MySQL.

## 🚀 Installation

### Prérequis

- PHP 7.4+ ou PHP 8.x
- Apache avec mod_rewrite activé
- MySQL/MariaDB avec la base de données `tbc_groupe` créée
- Extension PDO MySQL activée

### Configuration

1. **Configurer la base de données**
   
   Les identifiants sont configurés dans `config/database.php` :
   - User: `tbc`
   - Password: `thi@.32a`
   - Database: `tbc_groupe`
   - Host: `localhost`

   Si vos identifiants sont différents, modifiez le fichier `config/database.php`.

2. **Configurer CORS**
   
   Le fichier `config/cors.php` est configuré pour permettre les requêtes depuis `http://localhost:5173` (Vite dev server).
   
   Si votre frontend tourne sur un autre port, modifiez :
   ```php
   header("Access-Control-Allow-Origin: http://localhost:5173");
   ```

### Démarrer le serveur

#### Option 1 : Serveur PHP intégré (Développement)

```bash
cd backend
php -S localhost:8000
```

#### Option 2 : Apache

1. Configurez un VirtualHost pointant vers le dossier `backend`
2. Assurez-vous que `mod_rewrite` est activé
3. Le fichier `.htaccess` est déjà configuré

## 📡 Endpoints API

### Formateurs (`/api/trainers`)

- **GET** `/api/trainers` - Récupérer tous les formateurs
- **GET** `/api/trainers/{id}` - Récupérer un formateur spécifique
- **POST** `/api/trainers` - Créer un nouveau formateur
- **PUT** `/api/trainers/{id}` - Mettre à jour un formateur
- **DELETE** `/api/trainers/{id}` - Supprimer un formateur (soft delete)

### Authentification (`/api/auth`)

- **POST** `/api/auth` - Connexion
  ```json
  {
    "action": "login",
    "email": "thibauttbcbujiriri@gmail.com",
    "password": "thib@.32a"
  }
  ```

### Contact (`/api/contact`)

- **GET** `/api/contact` - Récupérer tous les messages
- **GET** `/api/contact?is_read=0` - Messages non lus
- **POST** `/api/contact` - Créer un nouveau message
- **PUT** `/api/contact` - Marquer un message comme lu
  ```json
  {
    "action": "mark_read",
    "id": 1
  }
  ```

### Services (`/api/services`)

- **GET** `/api/services` - Récupérer tous les services

## 📝 Exemples d'utilisation

### Récupérer tous les formateurs

```javascript
fetch('http://localhost:8000/api/trainers')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Créer un formateur

```javascript
fetch('http://localhost:8000/api/trainers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Nouveau Formateur',
    title: 'Développeur Fullstack',
    bio: 'Biographie courte',
    email: 'email@example.com',
    phone: '+243 XXX XXX XXX',
    image_base64: 'data:image/jpeg;base64,...'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Se connecter

```javascript
fetch('http://localhost:8000/api/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'login',
    email: 'thibauttbcbujiriri@gmail.com',
    password: 'thib@.32a'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    localStorage.setItem('authToken', data.data.token);
  }
});
```

## 🔒 Sécurité

### Améliorations recommandées pour la production

1. **JWT pour l'authentification** : Remplacez le système de token simple par JWT
2. **Validation des données** : Ajoutez une validation stricte des entrées
3. **Rate limiting** : Limitez le nombre de requêtes par IP
4. **HTTPS** : Utilisez HTTPS en production
5. **Sanitization** : Assurez-vous que toutes les entrées sont sanitizées
6. **Table de sessions** : Créez une table pour gérer les sessions/tokens

## 🐛 Dépannage

### Erreur de connexion à la base de données

1. Vérifiez que MySQL est démarré
2. Vérifiez les identifiants dans `config/database.php`
3. Vérifiez que la base de données `tbc_groupe` existe

### Erreur CORS

1. Vérifiez que l'URL dans `config/cors.php` correspond à votre frontend
2. Vérifiez que les headers CORS sont bien envoyés

### Erreur 404

1. Vérifiez que mod_rewrite est activé (Apache)
2. Vérifiez la configuration du serveur web
3. Utilisez le serveur PHP intégré pour tester

## 📁 Structure des fichiers

```
backend/
├── api/
│   ├── trainers.php      # API des formateurs
│   ├── auth.php          # API d'authentification
│   ├── contact.php       # API des messages de contact
│   └── services.php      # API des services
├── config/
│   ├── database.php      # Configuration de la base de données
│   └── cors.php          # Configuration CORS
├── .htaccess             # Configuration Apache
├── index.php             # Point d'entrée principal
└── README.md             # Documentation
```

## 🔄 Prochaines étapes

1. ✅ Connecter le frontend React à cette API
2. ✅ Remplacer localStorage par les appels API
3. ✅ Implémenter l'authentification JWT
4. ✅ Ajouter la validation des données
5. ✅ Ajouter la gestion d'erreurs avancée

---

**Note** : Ce backend est conçu pour le développement. Pour la production, ajoutez les mesures de sécurité mentionnées ci-dessus.

