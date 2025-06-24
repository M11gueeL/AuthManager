<?php
class AuthModel {
    private $db;
    
    public function __construct(Database $db) {
        $this->db = $db;
    }
    
    public function validateToken($token) {
        $stmt = $this->db->query(
            "SELECT u.id AS user_id 
             FROM tokens t
             JOIN user_sessions us ON us.token_id = t.id
             JOIN users u ON u.id = t.user_id
             WHERE t.token = ? 
               AND t.expires_at > NOW()
               AND us.active = 1
               AND us.end_date IS NULL",
            [$token]
        );
        return $stmt->fetch() ? true : false;
    }
    
    public function createSession($userId, $token, $ipAddress, $userAgent) {
        // 1. Crear token
        $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hora
        $this->db->query(
            "INSERT INTO tokens (user_id, token, expires_at) 
             VALUES (?, ?, ?)",
            [$userId, $token, $expiresAt]
        );
        $tokenId = $this->db->lastInsertId();
        
        // 2. Crear sesión
        $this->db->query(
            "INSERT INTO user_sessions 
             (user_id, token_id, ip_address, user_agent) 
             VALUES (?, ?, ?, ?)",
            [$userId, $tokenId, $ipAddress, $userAgent]
        );
        
        return $tokenId;
    }
    
    public function invalidateSession($token) {
        // 1. Invalidar token
        $this->db->query(
            "UPDATE tokens SET expires_at = NOW() 
             WHERE token = ?",
            [$token]
        );
        
        // 2. Invalidar sesión
        $this->db->query(
            "UPDATE user_sessions 
             SET active = 0, end_date = NOW() 
             WHERE token_id = (SELECT id FROM tokens WHERE token = ?)",
            [$token]
        );
    }
    
    public function getSessionByToken($token) {
        $stmt = $this->db->query(
            "SELECT us.*, t.token, t.expires_at 
             FROM user_sessions us
             JOIN tokens t ON us.token_id = t.id
             WHERE t.token = ?",
            [$token]
        );
        return $stmt->fetch();
    }
}