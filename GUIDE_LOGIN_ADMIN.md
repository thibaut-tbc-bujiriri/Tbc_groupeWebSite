# 🔐 Guide d'utilisation du système de Login Admin

## 📋 Identifiants de connexion

Pour accéder au panneau d'administration des formateurs, utilisez ces identifiants :

- **Email** : `thibauttbcbujiriri@gmail.com`
- **Mot de passe** : `thib@.32a`

## 🚀 Comment se connecter

### Étape 1 : Accéder à la page de connexion
1. Allez sur la page **"Formateurs"** dans le menu de navigation
2. Cliquez sur le bouton **"Se connecter"** en haut à droite
3. Ou accédez directement à : `/login`

### Étape 2 : Saisir vos identifiants
1. Entrez votre email : `thibauttbcbujiriri@gmail.com`
2. Entrez votre mot de passe : `thib@.32a`
3. Cliquez sur **"Se connecter"**

### Étape 3 : Accéder au mode admin
1. Après connexion, vous êtes redirigé vers la page Formateurs
2. Cliquez sur le bouton **"Mode Admin"** pour activer l'administration
3. Vous pouvez maintenant ajouter ou supprimer des formateurs

## ✨ Fonctionnalités après connexion

Une fois connecté, vous avez accès à :
- ✅ Activation du mode admin
- ✅ Ajout de nouveaux formateurs
- ✅ Suppression de formateurs existants
- ✅ Bouton de déconnexion

## 🔒 Sécurité

- Les identifiants sont vérifiés côté client (dans le code)
- L'authentification est stockée dans le localStorage
- La session reste active jusqu'à déconnexion ou fermeture du navigateur

## 🚪 Déconnexion

Pour vous déconnecter :
1. Cliquez sur le bouton **"Déconnexion"** en haut à droite
2. Vous êtes déconnecté et le mode admin est désactivé
3. Vous devrez vous reconnecter pour réactiver le mode admin

## ⚠️ Notes importantes

- **Sécurité** : Pour un site en production, il est recommandé d'utiliser un vrai backend avec authentification sécurisée (JWT, sessions, etc.)
- **LocalStorage** : Les données d'authentification sont stockées localement dans le navigateur
- **Accès** : Seul l'utilisateur avec les identifiants corrects peut accéder au mode admin

## 🔄 Réinitialiser la session

Si vous rencontrez des problèmes de connexion :
1. Ouvrez la console du navigateur (F12)
2. Exécutez : `localStorage.removeItem('adminAuth')`
3. Rechargez la page et reconnectez-vous

---

**Note** : Ce système utilise localStorage pour l'authentification. Pour une sécurité renforcée en production, implémentez un vrai backend avec authentification JWT ou sessions sécurisées.

