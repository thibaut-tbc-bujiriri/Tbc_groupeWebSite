# 📸 Instructions pour ajouter votre photo de profil

## Étapes pour ajouter votre photo

### 1. Préparer votre photo

- **Format** : JPG, PNG ou WebP
- **Nom du fichier** : `thibaut-profile.jpg`
- **Taille recommandée** : Minimum 400x400 pixels (carrée de préférence)
- **Qualité** : Une photo de bonne qualité avec un bon éclairage

### 2. Placer la photo dans le projet

1. Ouvrez le dossier `public/images/`
2. Placez votre photo dans ce dossier
3. Renommez-la en `thibaut-profile.jpg`

### 3. Emplacement de la photo

Votre photo sera automatiquement affichée dans :

✅ **Page "À propos"** - Section "Notre Fondateur"
✅ **Page "Formateur Fullstack"** - Section de présentation

### 4. Vérification

Une fois la photo ajoutée :

1. Lancez le serveur de développement : `npm run dev`
2. Naviguez vers la page "À propos" ou "Formateur"
3. Votre photo devrait s'afficher dans un cercle avec une bordure bleue

### 5. Si la photo ne s'affiche pas

- Vérifiez que le nom du fichier est exactement `thibaut-profile.jpg`
- Vérifiez que le fichier est dans `public/images/`
- Videz le cache du navigateur (Ctrl+Shift+R)
- Redémarrez le serveur de développement

### Structure des dossiers

```
TBC_GROUPE/
└── public/
    └── images/
        └── thibaut-profile.jpg  ← Placez votre photo ici
```

### Notes importantes

- La photo sera affichée dans un cercle
- Elle s'adapte automatiquement au dark mode
- Si la photo n'est pas trouvée, une icône de remplacement sera affichée
- L'image est optimisée pour un chargement rapide

---

**Astuce** : Pour une meilleure apparence, utilisez une photo professionnelle avec un fond neutre ou flou.

