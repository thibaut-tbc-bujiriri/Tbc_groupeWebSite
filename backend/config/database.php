<?php
/**
 * Configuration de connexion à la base de données
 * Tbc Groupe - Backend PHP (Supabase / PostgreSQL)
 */

// Chargement des variables d'environnement
require_once __DIR__ . '/env.php';

class Database {
    private $conn;

    /**
     * Obtenir la connexion à la base de données
     */
    public function getConnection() {
        $this->conn = null;

        $host = getenv('DB_HOST');
        $db_name = getenv('DB_NAME');
        $username = getenv('DB_USER');
        $password = getenv('DB_PASSWORD');
        $port = getenv('DB_PORT');

        try {
            // Chaîne de connexion PostgreSQL (pgsql:) avec SSL pour Supabase
            // Essayer d'abord avec sslmode=prefer (plus flexible), puis require si nécessaire
            $dsn = "pgsql:host=" . $host . ";port=" . $port . ";dbname=" . $db_name . ";sslmode=prefer";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            $this->conn = new PDO($dsn, $username, $password, $options);
            
            // Définir le schéma search_path si nécessaire (public par défaut)
            $this->conn->exec("SET search_path TO public");

        } catch(PDOException $exception) {
            // S'assurer que les headers JSON sont définis
            if (!headers_sent()) {
                http_response_code(500);
                header('Content-Type: application/json; charset=UTF-8');
            }
            
            // Logger l'erreur complète
            $errorDetails = [
                "message" => $exception->getMessage(),
                "code" => $exception->getCode(),
                "host" => $host,
                "port" => $port,
                "dbname" => $db_name,
                "username" => $username
            ];
            error_log("Connection error: " . json_encode($errorDetails));
            
            // En mode développement, afficher plus de détails
            $isDev = (getenv('APP_ENV') === 'development' || !getenv('APP_ENV'));
            
            echo json_encode([
                "success" => false,
                "message" => "Erreur de connexion à la base de données (Supabase)",
                "error" => $isDev ? $exception->getMessage() : null,
                "code" => $isDev ? $exception->getCode() : null,
                "debug" => $isDev ? [
                    "host" => $host,
                    "port" => $port,
                    "dbname" => $db_name,
                    "username" => $username,
                    "password_set" => !empty($password)
                ] : null
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }

        return $this->conn;
    }
}
?>

