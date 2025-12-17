# 🔍 Guide de Test de Connexion - Interface Web

## 📍 Où Tester la Connexion dans l'Interface

### Option 1 : Page de Test Dédiée (Recommandée) ✅

**URL à ouvrir dans votre navigateur :**

```
http://localhost:8080/Tbc_Groupe/backend/test-connection-ui.php
```

**Ce que cette page affiche :**
- ✅ État de la connexion MySQL
- ✅ Informations de la base de données (nom, utilisateur, version)
- ✅ Liste de toutes les tables avec le nombre d'entrées
- ✅ Statut de chaque table (accessible ou erreur)
- ✅ Liens vers les endpoints API
- ✅ Résumé des tests

**Avantages :**
- Interface graphique claire et professionnelle
- Vue d'ensemble complète de l'état de la base de données
- Accès direct aux endpoints API
- Rafraîchissement facile pour retester

---

### Option 2 : Page Login du Site

**URL :**
```
http://localhost:5173/login
```
(ou l'URL de votre site React)

**Utilisation :**
- Tester l'authentification avec la table `users`
- Identifiants : 
  - Email: `thibauttbcbujiriri@gmail.com`
  - Mot de passe: `thib@.32a`

**Note :** Actuellement, le login utilise une vérification côté client. Pour tester la vraie connexion à la base de données, il faudrait modifier le code pour utiliser l'API `/api/auth`.

---

### Option 3 : Page Trainers

**URL :**
```
http://localhost:5173/trainers
```

**Utilisation :**
- Affiche les formateurs (actuellement depuis localStorage)
- Pour tester la connexion DB, il faudrait modifier le code pour utiliser l'API `/api/trainers`

---

### Option 4 : Tester les API Directement

#### Test via Navigateur (GET uniquement)

**Formateurs :**
```
http://localhost:8080/Tbc_Groupe/backend/api/trainers
```

**Services :**
```
http://localhost:8080/Tbc_Groupe/backend/api/services
```

**Messages de contact :**
```
http://localhost:8080/Tbc_Groupe/backend/api/contact
```

**Index API :**
```
http://localhost:8080/Tbc_Groupe/backend/index.php
```

#### Test via Fichier HTML

**Ouvrir dans le navigateur :**
```
http://localhost:8080/Tbc_Groupe/backend/examples/test_api.html
```

Ce fichier permet de :
- Tester tous les endpoints API
- Faire des requêtes GET, POST, PUT, DELETE
- Voir les réponses JSON

---

## 🎯 Tests Recommandés

### 1. Test Rapide de Connexion

1. Ouvrez : `http://localhost:8080/Tbc_Groupe/backend/test-connection-ui.php`
2. Vérifiez que vous voyez "✅ CONNEXION RÉUSSIE"
3. Vérifiez que toutes les tables sont listées

### 2. Test des Tables

Sur la page de test, vérifiez :
- ✅ Toutes les tables sont "Accessible"
- ✅ Les comptes affichés correspondent à vos données
- ✅ Aucune erreur affichée

### 3. Test des API Endpoints

Dans la section "Endpoints API Disponibles" :
- Cliquez sur chaque lien
- Vérifiez que vous obtenez des réponses JSON valides
- Vérifiez que les données correspondent à votre base

---

## 📋 Checklist de Vérification

Avant de tester, assurez-vous que :

- [ ] XAMPP est démarré
- [ ] Apache est actif sur le port **8080**
- [ ] MySQL est actif sur le port **3307**
- [ ] La base de données `tbc_groupe` existe
- [ ] L'utilisateur `tbc` a les permissions
- [ ] Les tables ont été créées (via schema_phpmyadmin.sql)

---

## 🚨 En Cas d'Erreur

### Erreur 404
- Vérifiez l'URL exacte
- Vérifiez que le fichier existe dans le bon dossier
- Vérifiez que Apache est bien démarré

### Erreur de Connexion MySQL
- Vérifiez que MySQL est démarré sur le port 3307
- Vérifiez les identifiants dans `backend/config/database.php`
- Vérifiez que la base de données existe

### Tables Non Accessibles
- Vérifiez que le schéma a été importé correctement
- Vérifiez les permissions de l'utilisateur MySQL
- Vérifiez les logs d'erreur MySQL

---

## 📝 Notes

- La page de test se rafraîchit automatiquement à chaque accès
- Vous pouvez utiliser cette page comme outil de diagnostic
- Tous les tests sont non destructifs (lecture seule)
- La page est accessible depuis n'importe quel navigateur

---

**Dernière mise à jour :** 2024















