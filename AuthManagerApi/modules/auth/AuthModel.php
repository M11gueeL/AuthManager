<?php
class AuthModel {
    private $db;
    
    public function __construct(Database $db) {
        $this->db = $db;
    }
    
    public function validateToken($token) {
        $stmt = $this->db->query(
            "SELECT user_id FROM user_sessions 
             WHERE token_session = ? AND active = 1 AND end_date IS NULL",
            [$token]
        );
        return $stmt->fetch() ? true : false;
    }
    
    public function createSession($userId, $token, $ipAddress, $userAgent) {
        $this->db->query(
            "INSERT INTO user_sessions 
             (user_id, token_session, ip_address, user_agent) 
             VALUES (?, ?, ?, ?)",
            [$userId, $token, $ipAddress, $userAgent]
        );
    }
    
    public function invalidateSession($token) {
        $this->db->query(
            "UPDATE user_sessions 
             SET active = 0, end_date = CURRENT_TIMESTAMP 
             WHERE token_session = ?",
            [$token]
        );
    }
    
    public function getSessionByToken($token) {
        $stmt = $this->db->query(
            "SELECT * FROM user_sessions WHERE token_session = ?",
            [$token]
        );
        return $stmt->fetch();
    }
}