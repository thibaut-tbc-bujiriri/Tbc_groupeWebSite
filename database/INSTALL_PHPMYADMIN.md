# 📥 Installation de la base de données via phpMyAdmin

## 🚀 Méthode recommandée pour phpMyAdmin

phpMyAdmin ne supporte pas directement les commandes `DELIMITER`, donc nous avons créé deux fichiers séparés.

## 📋 Étapes d'installation

### Étape 1 : Créer la base de données et les tables

1. **Ouvrez phpMyAdmin** dans votre navigateur
2. **Sélectionnez l'onglet "SQL"** ou créez une nouvelle base de données
3. **Exécutez le fichier `schema_phpmyadmin.sql`** :
   - Cliquez sur "Importer" ou "SQL"
   - Sélectionnez le fichier `database/schema_phpmyadmin.sql`
   - Cliquez sur "Exécuter"

   **OU** copiez-collez le contenu du fichier dans l'éditeur SQL et exécutez-le.

### Étape 2 : Ajouter les procédures et triggers (Optionnel)

1. **Exécutez le fichier `procedures_and_triggers_phpmyadmin.sql`** :
   - Cliquez sur "SQL"
   - Sélectionnez le fichier `database/procedures_and_triggers_phpmyadmin.sql`
   - Cliquez sur "Exécuter"

   **OU** copiez-collez le contenu dans l'éditeur SQL.

### Étape 3 : Vérifier l'installation

Exécutez cette requête pour vérifier :

```sql
USE tbc_groupe;
SHOW TABLES;
```

Vous devriez voir toutes les tables :
- users
- trainers
- trainer_experiences
- trainer_skills
- trainer_technologies
- services
- portfolio_projects
- contact_messages
- site_settings
- training_programs

## ⚠️ Important

### Générer un hash de mot de passe sécurisé

Le mot de passe par défaut dans le script utilise un hash d'exemple. Vous **DEVEZ** le remplacer par un hash réel.

#### Méthode 1 : PHP

```php
<?php
$password = 'thib@.32a';
$hash = password_hash($password, PASSWORD_BCRYPT);
echo $hash;
?>
```

#### Méthode 2 : En ligne (générateur bcrypt)
- Allez sur https://bcrypt-generator.com/
- Entrez votre mot de passe : `thib@.32a`
- Copiez le hash généré

#### Méthode 3 : Node.js

```javascript
const bcrypt = require('bcrypt');
const password = 'thib@.32a';
bcrypt.hash(password, 10, (err, hash) => {
    console.log(hash);
});
```

Ensuite, mettez à jour le hash dans la table `users` :

```sql
UPDATE users 
SET password_hash = 'VOTRE_HASH_GENERE_ICI' 
WHERE email = 'thibauttbcbujiriri@gmail.com';
```

## 🔍 Vérification des données

Vérifiez que les données ont été insérées :

```sql
-- Vérifier l'utilisateur admin
SELECT * FROM users;

-- Vérifier les services
SELECT * FROM services;

-- Vérifier les paramètres
SELECT * FROM site_settings;
```

## 📝 Problèmes courants

### Erreur : "DELIMITER command is not supported"
✅ **Solution** : Utilisez le fichier `schema_phpmyadmin.sql` au lieu de `schema.sql`

### Erreur : "Unknown database"
✅ **Solution** : Créez d'abord la base de données manuellement :
```sql
CREATE DATABASE tbc_groupe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Erreur : "Access denied"
✅ **Solution** : Vérifiez vos permissions MySQL. Vous devez avoir les droits CREATE, ALTER, INSERT, etc.

### Les procédures/triggers ne se créent pas
✅ **Solution** : 
1. Exécutez-les séparément avec le fichier `procedures_and_triggers_phpmyadmin.sql`
2. Assurez-vous que toutes les tables existent avant d'exécuter ce fichier

## 🎯 Après l'installation

1. ✅ Changez le mot de passe par défaut
2. ✅ Testez la connexion avec votre application
3. ✅ Vérifiez que toutes les tables sont créées
4. ✅ Testez une insertion simple

## 📚 Fichiers disponibles

- **`schema_phpmyadmin.sql`** - Script principal (tables + données) - ✅ Utilisez celui-ci
- **`procedures_and_triggers_phpmyadmin.sql`** - Procédures et triggers (optionnel)
- **`schema.sql`** - Version originale pour MySQL CLI (ne pas utiliser dans phpMyAdmin)

---

**Note** : Si vous rencontrez toujours des erreurs, copiez le contenu ligne par ligne dans l'éditeur SQL de phpMyAdmin plutôt que d'importer le fichier directement.

