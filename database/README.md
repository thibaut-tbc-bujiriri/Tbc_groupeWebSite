# 📊 Base de données MySQL - Tbc Groupe

## 📋 Description

Ce répertoire contient le schéma de base de données MySQL pour le site web Tbc Groupe. La base de données est conçue pour gérer tous les aspects du site : formateurs, services, portfolio, messages de contact, et administration.

## 🗂️ Structure de la base de données

### Tables principales

1. **`users`** - Utilisateurs/Administrateurs du site
2. **`trainers`** - Formateurs de l'entreprise
3. **`trainer_experiences`** - Expériences des formateurs
4. **`trainer_skills`** - Compétences techniques des formateurs
5. **`trainer_technologies`** - Technologies maîtrisées par les formateurs
6. **`services`** - Services offerts par l'entreprise
7. **`portfolio_projects`** - Projets du portfolio
8. **`contact_messages`** - Messages reçus via le formulaire de contact
9. **`site_settings`** - Paramètres et configuration du site
10. **`training_programs`** - Programmes de formation

### Vues

- **`v_trainers_details`** - Vue détaillée des formateurs avec statistiques
- **`v_unread_messages`** - Vue des messages non lus

### Procédures stockées

- **`sp_mark_message_read`** - Marquer un message comme lu
- **`sp_get_site_stats`** - Obtenir les statistiques du site

## 🚀 Installation

### Prérequis

- MySQL 5.7+ ou MariaDB 10.3+
- Accès administrateur à MySQL

### Étapes d'installation

1. **Ouvrir MySQL**
   ```bash
   mysql -u root -p
   ```

2. **Exécuter le script SQL**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   
   Ou depuis MySQL :
   ```sql
   source database/schema.sql;
   ```

3. **Vérifier l'installation**
   ```sql
   USE tbc_groupe;
   SHOW TABLES;
   ```

## 👤 Compte administrateur par défaut

- **Email** : `thibauttbcbujiriri@gmail.com`
- **Mot de passe** : `thib@.32a`

⚠️ **IMPORTANT** : Changez le mot de passe après la première connexion ! Le hash par défaut dans le script doit être remplacé par un hash généré avec bcrypt.

Pour générer un nouveau hash :
```php
// PHP
$hash = password_hash('votre_mot_de_passe', PASSWORD_BCRYPT);

// Node.js
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('votre_mot_de_passe', 10);
```

## 📝 Modèles de données

### Trainers (Formateurs)

```sql
- id (INT, PK, Auto)
- name (VARCHAR 255) - Nom complet
- title (VARCHAR 255) - Titre/Poste
- bio (TEXT) - Biographie courte
- bio_extended (TEXT) - Biographie complète
- image_url (VARCHAR 500) - URL de l'image
- image_base64 (LONGTEXT) - Image en base64
- email (VARCHAR 255)
- phone (VARCHAR 50)
- is_active (BOOLEAN) - Actif/Inactif
- display_order (INT) - Ordre d'affichage
```

### Services

```sql
- id (INT, PK, Auto)
- title (VARCHAR 255)
- description (TEXT)
- icon_name (VARCHAR 100) - Nom de l'icône Lucide
- features (JSON) - Liste des fonctionnalités
- technologies (JSON) - Technologies utilisées
- is_active (BOOLEAN)
- display_order (INT)
```

### Contact Messages

```sql
- id (INT, PK, Auto)
- name (VARCHAR 255)
- email (VARCHAR 255)
- message (TEXT)
- subject (VARCHAR 255)
- phone (VARCHAR 50)
- is_read (BOOLEAN)
- read_at (TIMESTAMP)
- read_by (INT, FK -> users.id)
```

## 🔐 Sécurité

- Les mots de passe sont stockés en hash (bcrypt recommandé)
- Les requêtes utilisent des paramètres préparés (prepared statements)
- Index sur les colonnes fréquemment utilisées
- Contraintes de clés étrangères pour l'intégrité référentielle

## 📊 Requêtes utiles

### Obtenir tous les formateurs actifs
```sql
SELECT * FROM trainers WHERE is_active = TRUE ORDER BY display_order;
```

### Obtenir les messages non lus
```sql
SELECT * FROM v_unread_messages;
```

### Obtenir les statistiques du site
```sql
CALL sp_get_site_stats();
```

### Marquer un message comme lu
```sql
CALL sp_mark_message_read(1, 1); -- message_id, user_id
```

## 🔄 Migration depuis localStorage

Si vous voulez migrer les données depuis localStorage vers MySQL, vous devrez :

1. Exporter les données depuis localStorage
2. Créer un script de migration
3. Insérer les données dans les tables MySQL

Exemple de script de migration (Node.js) :

```javascript
// migration.js
const trainers = JSON.parse(localStorage.getItem('trainers'));
// Insérer dans MySQL...
```

## 🛠️ Maintenance

### Sauvegarde

```bash
mysqldump -u root -p tbc_groupe > backup_$(date +%Y%m%d).sql
```

### Restauration

```bash
mysql -u root -p tbc_groupe < backup_20240101.sql
```

## 📚 Ressources

- [Documentation MySQL](https://dev.mysql.com/doc/)
- [MySQL Workbench](https://www.mysql.com/products/workbench/)
- [phpMyAdmin](https://www.phpmyadmin.net/)

## 🤝 Contribution

Pour modifier le schéma :
1. Créer une nouvelle migration SQL
2. Documenter les changements
3. Tester sur une base de développement
4. Appliquer en production avec une sauvegarde

---

**Note** : Cette base de données est conçue pour être utilisée avec un backend (Node.js/Express, PHP, Python, etc.). Elle remplace le système localStorage actuel pour une solution plus robuste et scalable.

