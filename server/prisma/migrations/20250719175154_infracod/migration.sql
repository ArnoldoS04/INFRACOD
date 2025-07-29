-- CreateTable
CREATE TABLE `roles` (
    `idroles` INTEGER NOT NULL,
    `rol` VARCHAR(45) NULL,
    `descripcion` VARCHAR(100) NULL,
    `status` CHAR(1) NULL DEFAULT 'A',

    PRIMARY KEY (`idroles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `idusuarios` INTEGER NOT NULL AUTO_INCREMENT,
    `rol` INTEGER NOT NULL,
    `username` VARCHAR(45) NULL,
    `password` LONGTEXT NULL,
    `createdate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` CHAR(1) NULL DEFAULT 'A',

    INDEX `fk_rol_idx`(`rol`),
    PRIMARY KEY (`idusuarios`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordResetToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_rol` FOREIGN KEY (`rol`) REFERENCES `roles`(`idroles`) ON DELETE NO ACTION ON UPDATE NO ACTION;
