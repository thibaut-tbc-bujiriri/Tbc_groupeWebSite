# 📚 Guide d'utilisation du Mode Admin - Formateurs

## 🎯 Comment activer le mode admin

### Étape 1 : Accéder à la page Formateurs
1. Allez sur la page **"Formateurs"** dans le menu de navigation
2. Vous verrez un bouton **"Mode Admin"** en haut à droite

### Étape 2 : Activer le mode admin
1. Cliquez sur le bouton **"Mode Admin"**
2. Le bouton devient rouge et affiche **"Désactiver Admin"**
3. Vous pouvez maintenant gérer les formateurs

## ✨ Fonctionnalités disponibles en mode admin

### ✅ Ajouter un formateur
1. Cliquez sur le bouton **"Ajouter un Formateur"** qui apparaît
2. Remplissez le formulaire :
   - **Nom complet** (obligatoire)
   - **Titre / Poste** (obligatoire)
   - **Bio courte** (obligatoire)
   - **Bio complète** (optionnel)
   - **URL de l'image** (optionnel) - Ex: `/images/nom-image.jpg`
   - **Email** (optionnel)
   - **Téléphone** (optionnel)
3. Cliquez sur **"Ajouter"**
4. Le formateur est immédiatement ajouté à la liste

### ❌ Supprimer un formateur
1. En mode admin, chaque carte de formateur affiche un bouton de suppression (icône poubelle) en haut à droite
2. Cliquez sur le bouton de suppression
3. Confirmez la suppression dans la boîte de dialogue
4. Le formateur est immédiatement supprimé

## 💾 Stockage des données

Les données sont stockées dans le **localStorage** du navigateur, ce qui signifie :
- ✅ Les données persistent même après fermeture du navigateur
- ⚠️ Les données sont liées au navigateur et au domaine
- ⚠️ Si vous videz le cache du navigateur, les données seront perdues

## 🔐 Sécurité

Le mode admin est stocké dans le localStorage :
- Activez-le uniquement sur votre ordinateur personnel
- Désactivez-le après utilisation si vous partagez votre navigateur

## 📝 Format de l'image

Pour ajouter une photo de formateur :
1. Placez l'image dans le dossier `public/images/`
2. Utilisez le chemin dans le formulaire : `/images/nom-fichier.jpg`
3. Formats acceptés : `.jpg`, `.jpeg`, `.png`

## 🔄 Réinitialiser les données

Pour revenir aux données par défaut :
1. Ouvrez la console du navigateur (F12)
2. Exécutez : `localStorage.removeItem('trainers')`
3. Rechargez la page

## 📱 Responsive

L'interface admin est entièrement responsive et fonctionne sur :
- 📱 Mobile
- 📱 Tablette
- 💻 Desktop

---

**Note** : Les modifications sont immédiates et visibles par tous les visiteurs du site qui utilisent le même navigateur.

