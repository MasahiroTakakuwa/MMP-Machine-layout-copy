-- ======================================================================
-- Schema: mmp_machine_layout  (MySQL / InnoDB / utf8mb4)
-- Create all tables and relationships in one script
-- ======================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create database (if not exists) and select it
CREATE DATABASE IF NOT EXISTS `mmp_machine_layout`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `mmp_machine_layout`;

-- Drop old tables if they already exist
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `user_tokens`;
DROP TABLE IF EXISTS `logs`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `positions`;
DROP TABLE IF EXISTS `departments`;

SET FOREIGN_KEY_CHECKS = 1;

-- ======================================================================
-- 1) departments
-- ======================================================================
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 2) positions
-- ======================================================================
CREATE TABLE `positions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 3) users  (FK -> departments, positions)
-- ======================================================================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_name` VARCHAR(11) NOT NULL,
  `first_name` VARCHAR(20),
  `last_name` VARCHAR(50),
  `email` VARCHAR(50) UNIQUE,
  `password` VARCHAR(100) NOT NULL,
  `status` VARCHAR(11),
  `phone_number` VARCHAR(20),
  `avatar` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `department_id` INT,
  `position_id` INT,
  CONSTRAINT `fk_users_departments`
    FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  CONSTRAINT `fk_users_positions`
    FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  INDEX `idx_users_department_id` (`department_id`),
  INDEX `idx_users_position_id` (`position_id`),
  UNIQUE KEY `uk_users_user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 4) roles
-- ======================================================================
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  UNIQUE KEY `uk_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 5) permissions
-- ======================================================================
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  UNIQUE KEY `uk_permissions_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 6) user_roles  (Many-to-Many: users <-> roles)
-- ======================================================================
CREATE TABLE `user_roles` (
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_userroles_users`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_userroles_roles`
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 7) role_permissions  (Many-to-Many: roles <-> permissions)
-- ======================================================================
CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `fk_rolepermissions_roles`
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_rolepermissions_permissions`
    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 8) user_tokens  (One-to-Many: users -> user_tokens)
-- ======================================================================
CREATE TABLE `user_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `refresh_token` TEXT NOT NULL,
  `user_agent` VARCHAR(255),
  `ip_address` VARCHAR(255),
  `expired_at` TIMESTAMP NULL,
  `created_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` INT NOT NULL,
  `revoked` TINYINT(1) DEFAULT 0,
  CONSTRAINT `fk_usertokens_users`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX `idx_user_tokens_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- 9) logs  (activity logs; no FK required by diagram)
-- ======================================================================
CREATE TABLE `logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ip_address` VARCHAR(20),
  `action` VARCHAR(200),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `user_name` VARCHAR(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- Done
-- ======================================================================
