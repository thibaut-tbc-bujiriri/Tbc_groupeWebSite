<?php
/**
 * Configuration de connexion à la base de données
 * Tbc Groupe - Backend PHP
 */

class Database {
    private $host = 'localhost';
    private $port = '3307'; // Port MySQL personnalisé
    private $db_name = 'tbc_groupe';
    private $username = 'tbc';
    private $password = 'thi@.32a';
    private $charset = 'utf8mb4';
    public $conn;

    /**
     * Obtenir la connexion à la base de données
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            // S'assurer que les headers JSON sont définis
            if (!headers_sent()) {
                http_response_code(500);
                header('Content-Type: application/json; charset=UTF-8');
            }
            echo json_encode([
                "success" => false,
                "message" => "Erreur de connexion à la base de données"
            ]);
            exit();
        }

        return $this->conn;
    }
}

?>

