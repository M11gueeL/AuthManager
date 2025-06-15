<?php
echo "¡Funciona!\n";
//phpinfo();

$hash = '$2y$10$tWDjMHdwyn42qCRgN09Hb.FBTXh2H48A.6rAz6cyv33Jetjx/sNlC';
$password = '01001101';

// Debe devolver true
var_dump(password_verify($password, $hash));


$password = '01001101';  // Cambia esto
$hash = password_hash($password, PASSWORD_BCRYPT);
echo "Hash generado: " . $hash;

?>