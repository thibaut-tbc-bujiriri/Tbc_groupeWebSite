<?php
/**
 * Variables d'environnement pour la connexion Supabase
 * Remplissez ces variables avec vos informations Supabase
 *
 * NOTE : Pour la sécurité, ne commitez pas vos vrais identifiants si ce fichier est public.
 * Idéalement, utilisez un fichier .env non versionné ou configurez les variables du serveur.
 */

// Si vous utilisez un fichier de config local non versionné, on peut l'inclure ici
if (file_exists(__DIR__ . '/env.local.php')) {
    include __DIR__ . '/env.local.php';
} else {
    // Valeurs par défaut / Exemples (À REMPLACER)
    
    // Hôte (Host) : Récupéré de votre capture d'écran
    if (!getenv('DB_HOST')) putenv("DB_HOST=db.emnuxospjuvxzxfeecut.supabase.co");
    
    // Nom de la base (Database Name) : 'postgres' par défaut sur Supabase
    if (!getenv('DB_NAME')) putenv("DB_NAME=postgres");
    
    // Utilisateur (User) : 'postgres' par défaut
    if (!getenv('DB_USER')) putenv("DB_USER=postgres");
    
    // Mot de passe (Password) : CELUI QUE VOUS AVEZ DÉFINI À LA CRÉATION DU PROJET
    if (!getenv('DB_PASSWORD')) putenv("DB_PASSWORD=thi@.32aThibaut");
    
    // Port : 5432 (Session) ou 6543 (Transaction Pooler)
    if (!getenv('DB_PORT')) putenv("DB_PORT=5432");
}
