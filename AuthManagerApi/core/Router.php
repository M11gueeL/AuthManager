<?php

class Router {
    private $routes = [];

    public function add($method, $route, $callback) {
        $this->routes[] = [
            'method' => strtoupper($method),
            'route' => $route,
            'callback' => $callback
        ];
    }

    public function dispatch($requestUri, $requestMethod) {
        $requestUri = trim($requestUri, '/');
        error_log("DISPATCHING: $requestMethod $requestUri");

        foreach ($this->routes as $route) {
            $pattern = $this->convertToRegex($route['route']);
            
            if ($route['method'] === $requestMethod && preg_match($pattern, $requestUri, $matches)) {
                // Filtrar solo los grupos nombrados
                $params = [];
                foreach ($matches as $key => $value) {
                    if (is_string($key)) {
                        $params[$key] = $value;
                    }
                }

                // Si hay parámetros, conviértelos en array numérico
                $args = array_values($params);
                
                // Manejar callback
                if (is_array($route['callback'])) {
                    call_user_func_array($route['callback'], $args);
                } else {
                    call_user_func_array($route['callback'], $args);
                }
                return;
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Recurso no encontrado']);
    }
    
    private function convertToRegex($route) {
        // Convertir {param} en grupos nombrados (?P<param>...)
        $route = trim($route, '/');
        $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^\/]+)', $route);
        return '@^' . $pattern . '$@';
    }
}