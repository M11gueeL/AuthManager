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
    
        $data = json_decode(file_get_contents('php://input'), true);
        error_log("Datos recibidos: " . print_r($data, true));
        
        if (empty($data['username']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Credenciales incompletas']);
            return;
        }
        
        $user = $this->userModel->getUserByUsername($data['username']);
        
        if (!$user) {
            error_log("Usuario no encontrado: " . $data['username']);
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales inválidas']);
            return;
        }
        
        if (!password_verify($data['password'], $user['password'])) {
            error_log("Contraseña incorrecta para usuario: " . $data['username']);
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales inválidas']);
            return;
        }
        
        // Generar token
        $token = bin2hex(random_bytes(32));
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        
        // Crear token y sesión
        $tokenId = $this->authModel->createSession($user['id'], $token, $ipAddress, $userAgent);
        
        echo json_encode([
            'token' => $token,
            'user_id' => $user['id'],
            'expires_at' => date('c', time() + 3600), // ISO 8601
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
            http_response_code(400);
            echo json_encode(['error' => 'Token no proporcionado']);
        }
    }

    public function getProfile() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            
            // Validar el token primero
            if (!$this->authModel->validateToken($token)) {
                http_response_code(401);
                echo json_encode(['error' => 'Token inválido o sesión expirada']);
                return;
            }
            
            $session = $this->authModel->getSessionByToken($token);
            
            if (!$session) {
                http_response_code(401);
                echo json_encode(['error' => 'Sesión no válida']);
                return;
            }
            
            // Construir la respuesta con datos de usuario y sesión
            $response = [
                'id' => $session['user_id'],
                'name' => $session['name'],
                'username' => $session['username'],
                'email' => $session['email'],
                'session' => [
                    'id' => $session['id'],
                    'start_date' => date('Y-m-d H:i:s', strtotime($session['start_date'])),
                    'end_date' => $session['end_date'] ? date('Y-m-d H:i:s', strtotime($session['end_date'])) : null,
                    'ip_address' => $session['ip_address'],
                    'user_agent' => $session['user_agent'],
                    'active' => (bool)$session['active']
                ]
            ];
            
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Token no proporcionado']);
        }
    }

    public function listSessions() {
        // Verficar token válido
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            
            if (!$this->authModel->validateToken($token)) {
                http_response_code(401);
                echo json_encode(['error' => 'Token no válido o sesión expirada']);
                return;
            }
            
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Token no proporcionado']);
            return;
        }

        // Obtener todas las sesiones
        $sessions = $this->authModel->getAllSessions();

        // Formatear fechas para mejor legibilidad
        foreach ($sessions as &$session) {
            $session['start_date'] = date('Y-m-d H:i:s', strtotime($session['start_date']));

            if ($session['end_date']) {
                $session['end_date'] = date('Y-m-d H:i:s', strtotime($session['end_date']));
            } else {
                $session['end_date'] = null; // Si no hay fecha de fin, establecer como null
            }
    }
    echo json_encode($sessions);
    }
    
}