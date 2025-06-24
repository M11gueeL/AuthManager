<?php
class Database {
    private $pdo;
    
    public function __construct($config) {
        $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        try {
            $this->pdo = new PDO($dsn, $config['username'], $config['password'], $options);
        } catch (PDOException $e) {
            throw new Exception("Error de conexión: " . $e->getMessage());
        }
    }
    
    public function query($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {

            // Manejar errores de duplicados especificos 'usernmame' y 'emial'
            if ($e->getCode() == '23000') {

                if (strpos($e->getMessage(), 'username') !== false) {
                    throw new Exception('El nombre de usuario ya está en uso', 409);
                } elseif (strpos($e->getMessage(), 'email') !== false) {
                    throw new Exception('El email ya está registrado', 409);
                }
            }
            throw new Exception("Error en la operación: " . $e->getMessage());
        }
    }
    
    public function lastInsertId() {
        return $this->pdo->lastInsertId();
    }
}