<?php
class AuthMiddleware {
    private $authModel;
    
    public function __construct(AuthModel $authModel) {
        $this->authModel = $authModel;
    }
    
    public function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (empty($authHeader)) {
            throw new Exception('Token de acceso requerido', 401);
        }
        
        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            throw new Exception('Formato de token inválido', 401);
        }
        
        $token = $matches[1];
        
        if (!$this->authModel->validateToken($token)) {
            throw new Exception('Token inválido o expirado', 401);
        }
        
        return true;
    }
}