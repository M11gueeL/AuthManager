<?php

// Incluye todas las dependencias necesarias
require_once __DIR__ . '/UserController.php';
require_once __DIR__ . '/UserModel.php';
require_once __DIR__ . '/../../core/Database.php';

class UserRoutes {
    public static function register($router) {
        $dbConfig = require __DIR__ . '/../../config/database.php';
        $db = new Database($dbConfig);
        
        $userController = new UserController(
            new UserModel($db)
        );

        // Registra las rutas usando la instancia del controlador
        $router->add('GET', 'users', [$userController, 'getUsers']);
        $router->add('GET', 'users/{id}', [$userController, 'getUsers']);
        $router->add('POST', 'users', [$userController, 'createUser']);
        $router->add('PUT', 'users/{id}', [$userController, 'updateUser']);
        $router->add('DELETE', 'users/{id}', [$userController, 'deleteUser']);
    }
}