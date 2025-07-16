<?php

class UserController {
    private $userModel;
    
    public function __construct(UserModel $userModel) {
        $this->userModel = $userModel;
    }
    
    public function getUsers($id = null) {
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
        
        if (empty($data['name']) || empty($data['username']) || 
            empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Todos los campos son requeridos']);
            return;
        }
        
        try {
            $id = $this->userModel->createUser(
                $data['name'],
                $data['username'],
                $data['email'],
                $data['password']
            );
            
            http_response_code(201);
            echo json_encode([
                'id' => $id,
                'message' => 'Usuario creado exitosamente'
            ]);
        } catch (Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function updateUser($id) {
        if (!is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de usuario inválido']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        $required = ['name', 'username', 'email'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "El campo '$field' es requerido"]);
                return;
            }
        }

        try {
            $rowsAffected = $this->userModel->updateUser(
                (int)$id,
                $data['name'],
                $data['username'],
                $data['email']
            );

            if ($rowsAffected > 0) {
                echo json_encode(['message' => 'Usuario actualizado exitosamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado o sin cambios']);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function deleteUser($id) {
        try {
            $rowsAffected = $this->userModel->deleteUser($id);

            if ($rowsAffected > 0) {
                echo json_encode(['message' => 'Usuario eliminado']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Usuario no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}