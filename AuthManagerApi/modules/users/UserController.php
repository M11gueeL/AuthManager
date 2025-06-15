<?php
class UserController {
    private $userModel;
    
    public function __construct(UserModel $userModel) {
        $this->userModel = $userModel;
    }
    
    public function getUsers($id = null) {
        if ($id) {
            $user = $this->userModel->getUserById($id);
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
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['name']) || empty($data['username']) || empty($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos incompletos']);
            return;
        }
        
        $this->userModel->updateUser(
            $id,
            $data['name'],
            $data['username'],
            $data['email']
        );
        
        echo json_encode(['message' => 'Usuario actualizado']);
    }
    
    public function deleteUser($id) {
        $this->userModel->deleteUser($id);
        echo json_encode(['message' => 'Usuario eliminado']);
    }
}