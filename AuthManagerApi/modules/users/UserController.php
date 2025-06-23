<?php
class UserController {
    private $userModel;
    
    public function __construct(UserModel $userModel) {
        $this->userModel = $userModel;
    }
    
    public function getUsers($id = null) {
        // validar id numerico si existe
        if ($id && !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'ID inválido']);
            return;
        }


        if ($id) {
            $user = $this->userModel->getUserById((int)$id);
            if ($user) {
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
            }
        } else {
            $users = $this->userModel->getAllUsers();
            echo json_encode($users);
        }
    }
    
    public function createUser() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['name']) || empty($data['username']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos incompletos']);
            return;
        }
        
        $id = $this->userModel->createUser(
            $data['name'],
            $data['username'],
            $data['email'],
            $data['password']
        );
        
        http_response_code(201);
        echo json_encode(['id' => $id, 'message' => 'Usuario creado']);
    }
    
    public function updateUser($id) {
        // validar el id
        if (!is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'ID Inválido']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        // válidar datos requeridos
        $required = ['name', 'username', 'email'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Campo '$field' es requerido"]);
                return;
            }
        }

        // Verificar existencia del usuario
        $existingUser = $this->userModel->getUserById((int)$id);
        if (!$existingUser) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado']);
            return;
        }

        // Realizar actualización 
        $rowsAffected = $this->userModel->updateUser(
            (int)$id,
            $data['name'],
            $data['username'],
            $data['email']
        );

        // Validar resultado
        if ($rowsAffected > 0) {
            echo json_encode(['message' => 'Usuario actulizado']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No se realizaron los cambios']);
        }
    }
    
    public function deleteUser($id) {
        $rowsAffected = $this->userModel->deleteUser($id);

        if ($rowsAffected > 0) {
            echo json_encode(['message' => 'Usuario eliminado']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado o no eliminado']);
        }     
    }
}