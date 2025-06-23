<?php
class UserModel {
    private $db;
    
    public function __construct(Database $db) {
        $this->db = $db;
    }
    
    public function getAllUsers() {
        $stmt = $this->db->query("SELECT id, name, username, email, registration_date, last_update, active FROM users");
        return $stmt->fetchAll();
    }
    
    public function getUserById(int $id) {
        $stmt = $this->db->query("SELECT id, name, username, email, registration_date, last_update, active FROM users WHERE id = ?", [$id]);
        return $stmt->fetch();
    }
    
    public function createUser($name, $username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $this->db->query(
            "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
            [$name, $username, $email, $hashedPassword]
        );
        return $this->db->lastInsertId();
    }
    
    public function updateUser($id, $name, $username, $email) {
        $stmt = $this->db->query(
            "UPDATE users SET name = ?, username = ?, email = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?",
            [$name, $username, $email, $id]
        );
        return $stmt->rowCount(); // devuelve filas afectadas
    }
    
    public function deleteUser($id) {
        $stmt = $this->db->query("DELETE FROM users WHERE id = ?", [$id]);
        return $stmt->rowCount(); // devuelve el numero de filas afectadas
    }
    
    public function getUserByUsername($username) {
        $stmt = $this->db->query("SELECT * FROM users WHERE username = ?", [$username]);
        return $stmt->fetch();
    }
}