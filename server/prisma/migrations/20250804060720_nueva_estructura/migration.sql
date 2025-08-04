-- CreateTable
CREATE TABLE `empleado` (
    `idempleado` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_codigo` VARCHAR(15) NOT NULL,
    `emp_nombre` VARCHAR(45) NULL,
    `emp_nombre2` VARCHAR(45) NULL,
    `emp_nombre3` VARCHAR(45) NULL,
    `emp_apellido` VARCHAR(45) NULL,
    `emp_apellido2` VARCHAR(45) NULL,
    `emp_apellido_casada` VARCHAR(45) NULL,
    `emp_dpi` VARCHAR(45) NULL,
    `emp_fecha_nacimiento` DATETIME(3) NULL,
    `emp_genero` VARCHAR(45) NULL,
    `emp_fecha_ingreso` DATETIME(3) NULL,
    `emp_fecha_egreso` DATETIME(3) NULL,
    `emp_correo` LONGTEXT NULL,
    `emp_direccion` LONGTEXT NULL,
    `emp_celular` BIGINT NULL,
    `emp_salario` DOUBLE NULL,
    `emp_estado` CHAR(1) NULL,
    `puestoId` INTEGER NOT NULL,

    UNIQUE INDEX `empleado_emp_codigo_key`(`emp_codigo`),
    UNIQUE INDEX `empleado_emp_dpi_key`(`emp_dpi`),
    INDEX `empleado_puestoId_fkey`(`puestoId`),
    PRIMARY KEY (`idempleado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `idroles` INTEGER NOT NULL,
    `rol` VARCHAR(45) NULL,
    `descripcion` VARCHAR(100) NULL,
    `status` CHAR(1) NULL DEFAULT 'A',

    PRIMARY KEY (`idroles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `puesto` (
    `idpuesto` INTEGER NOT NULL AUTO_INCREMENT,
    `pue_nombre` VARCHAR(100) NOT NULL,
    `pue_estado` BOOLEAN NOT NULL DEFAULT true,
    `pue_fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `areaId` INTEGER NOT NULL,

    INDEX `puesto_areaId_fkey`(`areaId`),
    PRIMARY KEY (`idpuesto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area` (
    `idarea` INTEGER NOT NULL AUTO_INCREMENT,
    `are_nombre` VARCHAR(100) NOT NULL,
    `are_estado` BOOLEAN NOT NULL DEFAULT true,
    `are_fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idarea`)
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
    `coti_estado` INTEGER NULL DEFAULT 1,
    `coti_imag` TINYINT NULL,
    `coti_terminos` TEXT NULL,

    UNIQUE INDEX `coti_correlativo_UNIQUE`(`coti_correlativo`),
    UNIQUE INDEX `coti_nog_UNIQUE`(`coti_nog`),
    INDEX `cotizacion_coti_estado_fkey`(`coti_estado`),
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

-- CreateTable
CREATE TABLE `catalogo` (
    `idcatalogo` INTEGER NOT NULL AUTO_INCREMENT,
    `cat_categoria` INTEGER NOT NULL,
    `cat_nombre` VARCHAR(45) NOT NULL,
    `cat_estado` TINYINT NOT NULL,
    `cat_fecha_crea` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idcatalogo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingreso` (
    `idingreso` INTEGER NOT NULL AUTO_INCREMENT,
    `ing_categoria` INTEGER NULL,
    `ing_cot_correlativo` INTEGER NULL,
    `ing_metodo_pago` INTEGER NULL,
    `ing_nreferencia` VARCHAR(45) NULL,
    `ing_descripcion` TEXT NULL,
    `ing_fecha_fact` DATE NULL,
    `ing_fecha_crea` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ing_monto` DECIMAL(10, 2) NULL,

    INDEX `fk_cot_ing_idx`(`ing_cot_correlativo`),
    PRIMARY KEY (`idingreso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `egreso` (
    `idegreso` INTEGER NOT NULL AUTO_INCREMENT,
    `egs_categoria` INTEGER NULL,
    `egs_nocompra` VARCHAR(45) NULL,
    `egs_metodo_pago` INTEGER NULL,
    `egs_nreferencia` VARCHAR(45) NULL,
    `egs_descripcion` TEXT NULL,
    `egs_fecha_fact` DATE NULL,
    `egs_fecha_crea` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `egs_monto` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`idegreso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `empleado` ADD CONSTRAINT `empleado_puestoId_fkey` FOREIGN KEY (`puestoId`) REFERENCES `puesto`(`idpuesto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `puesto` ADD CONSTRAINT `puesto_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`idarea`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_rol` FOREIGN KEY (`rol`) REFERENCES `roles`(`idroles`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cotizacion` ADD CONSTRAINT `cotizacion_coti_estado_fkey` FOREIGN KEY (`coti_estado`) REFERENCES `catalogo`(`idcatalogo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalle_cotizacion` ADD CONSTRAINT `fk_det_coti` FOREIGN KEY (`det_idcotizacion`) REFERENCES `cotizacion`(`idcotizacion`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingreso` ADD CONSTRAINT `fk_cot_ing` FOREIGN KEY (`ing_cot_correlativo`) REFERENCES `cotizacion`(`idcotizacion`) ON DELETE CASCADE ON UPDATE CASCADE;
