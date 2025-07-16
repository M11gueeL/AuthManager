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
        // Verificar duplicados
        if ($this->usernameExists($username)) {
            throw new Exception("El nombre de usuario ya está en uso", 409);
        }

        if ($this->emailExists($email)) {
            throw new Exception("El email ya esta en uso", 409);
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $this->db->query(
            "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
            [$name, $username, $email, $hashedPassword]
        );
        return $this->db->lastInsertId();
    }
    
    public function updateUser($id, $name, $username, $email) {
        // Verificar si el nuevo username/email ya existe en otros usuarios
        $existing = $this->getUserById($id);

        if (!$existing) {
            throw new Exception('Usuario no encontrado', 404);
        }
        
        if ($username !== $existing['username'] && $this->usernameExists($username)) {
            throw new Exception('El nombre de usuario ya está en uso', 409);
        }

        $stmt = $this->db->query(
            "UPDATE users SET name = ?, username = ?, email = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?",
            [$name, $username, $email, $id]
        );

        return $stmt->rowCount();
    }
    
    public function deleteUser($id) {
        $stmt = $this->db->query("DELETE FROM users WHERE id = ?", [$id]);
        return $stmt->rowCount();
    }
    
    public function getUserByUsername($username) {
        $stmt = $this->db->query("SELECT * FROM users WHERE username = ?", [$username]);
        return $stmt->fetch();
    }

    private function usernameExists($username) {
        $stmt = $this->db->query("SELECT COUNT(*) FROM users WHERE username = ?", [$username]);
        return $stmt->fetchColumn() > 0;
    }

    private function emailExists($email) {
        $stmt = $this->db->query("SELECT COUNT(*) FROM users WHERE email = ?", [$email]);
        return $stmt->fetchColumn() > 0;
    }
}