<?php

require_once '../config/database.php';
require_once '../core/Router.php';
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

// Obtener la URL solicitada desde el parámetro 'url'
$requestUrl = isset($_GET['url']) ? $_GET['url'] : '';
$requestUri = trim($requestUrl, '/'); // Usa esto en lugar de REQUEST_URI
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Crear una instancia del enrutador
$router = new Router();

// Registrar las rutas de autenticación y usuarios
AuthRoutes::register($router);
UserRoutes::register($router);

// Despachar la solicitud
$router->dispatch($requestUri, $requestMethod);

// Log de depuración
error_log("REQUEST_URI: " . $_SERVER['REQUEST_URI']);
error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);

