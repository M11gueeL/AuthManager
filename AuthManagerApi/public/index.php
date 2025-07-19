<?php
require_once '../config/database.php';
require_once '../core/Router.php';
require_once '../core/AuthMiddleware.php'; // Asegúrate de incluir esto
require_once '../modules/auth/AuthModel.php';
require_once '../modules/users/UserModel.php';
require_once '../modules/auth/AuthRoutes.php';
require_once '../modules/users/UserRoutes.php';

// Configuración de cabeceras
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization");

// Preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Crear instancias esenciales
$dbConfig = require __DIR__ . '/../config/database.php';
$db = new Database($dbConfig);

// Crear middleware de autenticación
$authMiddleware = new AuthMiddleware(new AuthModel($db));

// Crear enrutador
$router = new Router();
$router->registerMiddleware('auth', $authMiddleware); // Registrar middleware

// Registrar rutas
AuthRoutes::register($router);
UserRoutes::register($router);

// Despachar solicitud
$requestUrl = isset($_GET['url']) ? $_GET['url'] : '';
$router->dispatch(trim($requestUrl, '/'), $_SERVER['REQUEST_METHOD']);

