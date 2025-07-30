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

-- CreateTable
CREATE TABLE `cotizacion` (
    `idcotizacion` INTEGER NOT NULL AUTO_INCREMENT,
    `coti_idempleado_crea` INTEGER NULL,
    `coti_idcliente` INTEGER NULL,
    `coti_correlativo` VARCHAR(25) NULL,
    `coti_nombre` VARCHAR(100) NULL,
    `coti_nit` VARCHAR(45) NULL,
    `coti_empresa` TEXT NULL,
    `coti_direccion` TEXT NULL,
    `coti_reg` VARCHAR(45) NULL,
    `coti_nog` INTEGER UNSIGNED NULL,
    `coti_tel` VARCHAR(45) NULL,
    `coti_correo` VARCHAR(45) NULL,
    `coti_fecha_crea` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `coti_fecha_valida` DATE NULL,
    `coti_total` DECIMAL(10, 2) NULL,
    `coti_total_rent` DECIMAL(10, 2) NULL,
    `coti_xtaje_rent` VARCHAR(4) NULL,
    `coti_estado` TINYINT NULL DEFAULT 1,
    `coti_imag` TINYINT NULL,
    `coti_terminos` TEXT NULL,

    UNIQUE INDEX `coti_correlativo_UNIQUE`(`coti_correlativo`),
    UNIQUE INDEX `coti_nog_UNIQUE`(`coti_nog`),
    PRIMARY KEY (`idcotizacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_cotizacion` (
    `iddetalle_cotizacion` INTEGER NOT NULL AUTO_INCREMENT,
    `det_idcotizacion` INTEGER NULL,
    `det_descripcion` TEXT NULL,
    `det_cantidad` INTEGER NULL,
    `det_img` TEXT NULL,
    `det_precio_unitario` VARCHAR(45) NOT NULL,
    `det_precio_rent` DECIMAL(10, 2) NOT NULL,
    `det_a_ganar` DECIMAL(10, 2) NULL,
    `det_isr` DECIMAL(10, 2) NULL,
    `det_iva` DECIMAL(10, 2) NULL,
    `det_otros_gastos` DECIMAL(10, 2) NULL,

    INDEX `fk_det_coti_idx`(`det_idcotizacion`),
    PRIMARY KEY (`iddetalle_cotizacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_rol` FOREIGN KEY (`rol`) REFERENCES `roles`(`idroles`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalle_cotizacion` ADD CONSTRAINT `fk_det_coti` FOREIGN KEY (`det_idcotizacion`) REFERENCES `cotizacion`(`idcotizacion`) ON DELETE CASCADE ON UPDATE CASCADE;
