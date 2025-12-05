# 📊 Schéma de la base de données - Tbc Groupe

## Relations entre les tables

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email           │◄─────┐
│ password_hash   │      │
│ full_name       │      │
│ role            │      │
└─────────────────┘      │
                         │
                         │ (read_by)
                         │
┌─────────────────────────┴─────────────┐
│      contact_messages                 │
├───────────────────────────────────────┤
│ id (PK)                               │
│ name                                  │
│ email                                 │
│ message                               │
│ is_read                               │
│ read_by (FK) ────────────────────────┘
└───────────────────────────────────────┘

┌─────────────────┐
│    trainers     │◄───────────────────┐
├─────────────────┤                    │
│ id (PK)         │                    │
│ name            │                    │
│ title           │                    │
│ bio             │                    │
│ image_url       │                    │
│ created_by (FK) │──────┐             │
└─────────────────┘      │             │
         │               │             │
         │               │             │
         │ 1             │ (created_by)│
         │               │             │
         │ *             │             │
         │               │             │
         ├───────────────┼─────────────┤
         │               │             │
    ┌────┴────┐   ┌─────┴─────┐  ┌───┴──────────┐
    │         │   │           │  │              │
┌───┴─────────┴───┴─┐ ┌───────┴──┴───┐ ┌────────┴───────────┐
│ trainer_          │ │ trainer_      │ │ training_          │
│ experiences       │ │ skills        │ │ programs           │
├───────────────────┤ ├───────────────┤ ├────────────────────┤
│ id (PK)           │ │ id (PK)       │ │ id (PK)            │
│ trainer_id (FK)   │ │ trainer_id    │ │ trainer_id (FK)    │
│ year              │ │ skill_name    │ │ title              │
│ title             │ │ skill_level   │ │ description        │
│ description       │ └───────────────┘ │ duration           │
└───────────────────┘                   └────────────────────┘
         │
         │
┌────────┴──────────┐
│ trainer_          │
│ technologies      │
├───────────────────┤
│ id (PK)           │
│ trainer_id (FK)   │
│ technology_name   │
└───────────────────┘

┌─────────────────┐
│    services     │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ features (JSON) │
│ technologies    │
│                 │
│ (JSON)          │
└─────────────────┘

┌─────────────────┐
│ portfolio_      │
│ projects        │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ image_url       │
│ technologies    │
│                 │
│ (JSON)          │
└─────────────────┘

┌─────────────────┐
│ site_settings   │
├─────────────────┤
│ id (PK)         │
│ setting_key     │
│ setting_value   │
└─────────────────┘
```

## Liste des tables et leurs champs

### 1. **users** (Utilisateurs/Admins)
- Gère les comptes administrateurs et éditeurs
- Relation avec: `trainers` (created_by), `contact_messages` (read_by)

### 2. **trainers** (Formateurs)
- Informations principales des formateurs
- Relations avec: `trainer_experiences`, `trainer_skills`, `trainer_technologies`, `training_programs`
- Support pour images (URL ou base64)

### 3. **trainer_experiences** (Expériences)
- Historique professionnel des formateurs
- Relation avec: `trainers`

### 4. **trainer_skills** (Compétences)
- Compétences techniques avec niveau (0-100)
- Relation avec: `trainers`

### 5. **trainer_technologies** (Technologies)
- Liste des technologies maîtrisées
- Relation avec: `trainers`

### 6. **services** (Services)
- Services offerts par l'entreprise
- Stockage JSON pour features et technologies

### 7. **portfolio_projects** (Projets Portfolio)
- Projets réalisés à afficher dans le portfolio
- Support pour images (URL ou base64)

### 8. **contact_messages** (Messages de contact)
- Messages reçus via le formulaire de contact
- Suivi des messages lus/non lus

### 9. **site_settings** (Paramètres du site)
- Configuration générale du site (key-value)

### 10. **training_programs** (Programmes de formation)
- Programmes de formation offerts
- Optionnellement lié à un formateur

## Index principaux

- `users.email` - Recherche rapide par email
- `trainers.is_active, display_order` - Tri et filtrage
- `contact_messages.is_read, created_at` - Gestion des messages
- `portfolio_projects.is_active, is_featured` - Affichage du portfolio

## Données JSON utilisées

- **services.features** : Liste des fonctionnalités d'un service
- **services.technologies** : Technologies utilisées
- **portfolio_projects.technologies** : Technologies du projet

---

**Note**: Toutes les tables utilisent `utf8mb4` pour supporter les caractères spéciaux et emojis.

