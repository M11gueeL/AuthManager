<?php

require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/AuthModel.php';
require_once __DIR__ . '/../users/UserModel.php'; // Asegúrate de incluir UserModel
require_once __DIR__ . '/../../core/Database.php'; // Incluye Database

class AuthRoutes {
    public static function register($router) {
        $dbConfig = require __DIR__ . '/../../config/database.php';
        $db = new Database($dbConfig);
        
        $authController = new AuthController(
            new AuthModel($db),
            new UserModel($db) // Usa la misma instancia de DB
        );

        // Usa la instancia creada en lugar de llamadas estáticas
        $router->add('POST', 'auth/login', [$authController, 'login']);
        $router->add('POST', 'auth/logout', [$authController, 'logout']);
        $router->add('GET', 'auth/profile', [$authController, 'getProfile']);
    }
}