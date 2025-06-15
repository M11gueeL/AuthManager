<?php
class AuthController {
    private $authModel;
    private $userModel;
    
    public function __construct(AuthModel $authModel, UserModel $userModel) {
        $this->authModel = $authModel;
        $this->userModel = $userModel;
    }
    
    public function login() {

         error_log("Solicitud de login recibida");
    
        // Leer el input UNA SOLA VEZ
        $data = json_decode(file_get_contents('php://input'), true);
        error_log("Datos recibidos: " . print_r($data, true));
        
        if (empty($data['username']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Credenciales incompletas']);
            return;
        }
        
        $user = $this->userModel->getUserByUsername($data['username']);
        
        // Verificar primero si el usuario existe
        if (!$user) {
            error_log("Usuario no encontrado: " . $data['username']);
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales inválidas']);
            return;
        }
        
        // Luego verificar la contraseña con logging
        if (!password_verify($data['password'], $user['password'])) {
            error_log("Contraseña incorrecta para usuario: " . $data['username']);
            error_log("Hash almacenado: " . $user['password']);
            error_log("Contraseña recibida: " . $data['password']);
            
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales inválidas']);
            return;
        }
        
        // Generar token
        $token = bin2hex(random_bytes(32));
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        
        // Crear sesión
        $this->authModel->createSession($user['id'], $token, $ipAddress, $userAgent);
        
        echo json_encode([
            'token' => $token,
            'user_id' => $user['id'],
            'message' => 'Sesión iniciada'
        ]);
    }
    
    public function logout() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $this->authModel->invalidateSession($token);
            echo json_encode(['message' => 'Sesión cerrada']);
        } else {
            throw new Exception('Token no proporcionado', 400);
        }
    }
}