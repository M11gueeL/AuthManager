-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 07-07-2025 a las 23:54:48
-- Versión del servidor: 10.1.38-MariaDB
-- Versión de PHP: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_spanish_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `tokens`
--

INSERT INTO `tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 6, '4febbb6054868e3a6970c1b598a97104b1840cdb7017c120f88fbdb933847ce4', '2025-06-24 16:33:41', '2025-06-24 20:27:03'),
(2, 2, '17a2677f70d3be13dddb3ddcd05ae989c6699eb4b9483ec3c1b0433c1fc81ac4', '2025-06-24 18:04:58', '2025-06-24 21:20:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `registration_date`, `last_update`, `active`) VALUES
(2, 'miguelangel', 'admin', 'monasteriomiguelangel81@gmail.com', '$2y$10$tWDjMHdwyn42qCRgN09Hb.FBTXh2H48A.6rAz6cyv33Jetjx/sNlC', '2025-06-15 18:57:32', '2025-06-15 20:19:26', 1),
(6, 'messi', 'messi', 'leomessi@gmail.com', '$2y$10$TvFClNOoS0Zq0pMXAIWC1eLQFGn00y2CLfXNWZPah7RZIQ6Mfmzm.', '2025-06-23 00:05:19', '2025-06-23 00:07:39', 1),
(8, 'juan', 'juandvp', 'juandvp0303@gmail.com', '$2y$10$Mi4mpzp28ov8yT7LJt42GupWXtfPVqw2jz/dkl0Gpm6Ks9b36.Mq2', '2025-06-24 21:07:15', '2025-06-24 21:07:15', 1),
(9, 'emilio', 'usuario nuevo', 'jessirnacarybravo@gmail.com', '$2y$10$C9b0B8gGLnM0fPnSK.1bcesKy3Eyv./phY8i0jObb5Ql2q63W8shK', '2025-06-24 21:26:28', '2025-06-24 22:30:01', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_id` int(11) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NULL DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `token_id`, `start_date`, `end_date`, `ip_address`, `user_agent`, `active`) VALUES
(1, 6, 1, '2025-06-24 20:27:03', '2025-06-24 21:03:41', '::1', 'PostmanRuntime/7.26.10', 0),
(2, 2, 2, '2025-06-24 21:20:18', '2025-06-24 22:34:58', '::1', 'PostmanRuntime/7.26.10', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_expires` (`expires_at`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `token_id` (`token_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_sessions_ibfk_2` FOREIGN KEY (`token_id`) REFERENCES `tokens` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
