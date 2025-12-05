# Configuration Formspree

## 📧 Comment configurer Formspree pour le formulaire de contact

### Étape 1 : Créer un compte Formspree

1. Allez sur [https://formspree.io](https://formspree.io)
2. Cliquez sur "Sign Up" pour créer un compte gratuit
3. Confirmez votre email

### Étape 2 : Créer un nouveau formulaire

1. Une fois connecté, cliquez sur "New Form"
2. Donnez un nom à votre formulaire (ex: "Contact TPC_Groupe")
3. Formspree générera automatiquement un endpoint unique

### Étape 3 : Récupérer l'endpoint

L'endpoint ressemblera à ceci :
```
https://formspree.io/f/xjvqpwzd
```

### Étape 4 : Configurer dans le code

1. Ouvrez le fichier `src/pages/Contact.jsx`
2. Trouvez la ligne suivante :
```javascript
const FORMSPREE_ENDPOINT = 'YOUR_FORMSPREE_ENDPOINT_HERE'
```

3. Remplacez `YOUR_FORMSPREE_ENDPOINT_HERE` par votre endpoint Formspree :
```javascript
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjvqpwzd'
```

### Étape 5 : Configurer l'email de réception

1. Dans votre tableau de bord Formspree, allez dans "Settings"
2. Sous "Email", ajoutez votre adresse email : `thibauttbcbujiriri@gmail.com`
3. Formspree enverra tous les messages reçus à cette adresse

### Étape 6 : Tester le formulaire

1. Lancez votre application : `npm run dev`
2. Allez sur la page Contact
3. Remplissez et soumettez le formulaire
4. Vérifiez votre boîte mail (et les spams) pour recevoir le message

## ✅ Alternative : Utiliser la version email directe

Si vous préférez ne pas utiliser Formspree, vous pouvez modifier le formulaire pour utiliser `mailto:` directement. Cependant, cette méthode est moins fiable.

### Exemple avec mailto:

```javascript
const handleSubmit = (e) => {
  e.preventDefault()
  const subject = encodeURIComponent('Contact depuis TPC_Groupe')
  const body = encodeURIComponent(
    `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )
  window.location.href = `mailto:thibauttbcbujiriri@gmail.com?subject=${subject}&body=${body}`
}
```

## 📝 Note importante

- Le plan gratuit de Formspree permet jusqu'à 50 soumissions par mois
- Pour plus de soumissions, vous devrez passer à un plan payant
- Les messages seront stockés dans votre tableau de bord Formspree ET envoyés par email

## 🔒 Sécurité

Formspree inclut une protection anti-spam intégrée. Cependant, pour une meilleure sécurité en production, considérez :

- Ajouter un captcha (reCAPTCHA)
- Limiter le taux de soumission par IP
- Valider les données côté serveur (Formspree le fait automatiquement)

