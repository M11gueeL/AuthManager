<?php

// Activar depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once './config/Database.php';
require_once './core/Database.php';
require_once './core/AuthMiddleware.php';

// Incluir módulos
require_once './modules/users/UserModel.php';
require_once './modules/users/UserController.php';
require_once './modules/auth/AuthModel.php';
require_once './modules/auth/AuthController.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization");

// Preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dbConfig = require './config/Database.php';
$database = new Database($dbConfig);

// DEPURACIÓN: Mostrar URI recibida
error_log("REQUEST_URI ORIGINAL: " . $_SERVER['REQUEST_URI']);

// Obtener la ruta base dinámicamente
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestUri = substr($requestUri, strlen($scriptDir));
$requestUri = trim($requestUri, '/');

// DEPURACIÓN: Mostrar URI procesada
error_log("REQUEST_URI PROCESADA: " . $requestUri);

$uriSegments = $requestUri ? explode('/', $requestUri) : [];

// DEPURACIÓN: Mostrar segmentos
error_log("URI SEGMENTS: " . print_r($uriSegments, true));

// Instanciar modelos y controladores
$userModel = new UserModel($database);
$authModel = new AuthModel($database);
$userController = new UserController($userModel);
$authController = new AuthController($authModel, $userModel);

$authMiddleware = new AuthMiddleware($authModel);

// AÑADIR ESTA LÍNEA FALTANTE (método HTTP)
$action = $_SERVER['REQUEST_METHOD']; // <--- ESTA ES LA LÍNEA CLAVE QUE FALTABA

try {
    // Si no hay segmentos, es la raíz
    if (empty($uriSegments)) {
        echo json_encode(['message' => 'API funcionando']);
        exit;
    }

    $resource = $uriSegments[0] ?? '';
    $endpoint = $uriSegments[1] ?? '';

    switch ($resource) {
        case 'users':
            $id = $uriSegments[2] ?? null;
            if ($action !== 'POST') {
                $authMiddleware->authenticate();
            }
            
            switch ($action) {
                case 'GET':
                    $userController->getUsers($id);
                    break;
                case 'POST':
                    $userController->createUser();
                    break;
                case 'PUT':
                    $userController->updateUser($id);
                    break;
                case 'DELETE':
                    $userController->deleteUser($id);
                    break;
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Método no permitido']);
            }
            break;
            
        case 'auth':
            switch ($endpoint) {
                case 'login':
                    if ($action === 'POST') {
                        $authController->login();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Método no permitido']);
                    }
                    break;
                    
                case 'logout':
                    $authMiddleware->authenticate();
                    if ($action === 'POST') {
                        $authController->logout();
                    } else {
                        http_response_code(405);
                        echo json_encode(['error' => 'Método no permitido']);
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode(['error' => 'Endpoint no encontrado']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Recurso no encontrado']);
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['error' => $e->getMessage()]);
}


$action = $_SERVER['REQUEST_METHOD'];
echo "\nMétodo HTTP: " . $action; // Para ver en logs

// Solo para diagnóstico - eliminar después
echo "\n\nDEBUG INFO:\n";
echo "SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME'] . "\n";
echo "SCRIPT_FILENAME: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "Base Path Calculated: " . $scriptDir . "\n";
echo "Processed URI: " . $requestUri . "\n";
echo "URI Segments: " . print_r($uriSegments, true) . "\n";