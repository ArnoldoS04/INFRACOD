import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Inserta datos a cotizacion
export const saveCoti = async (req, res) => {
  try {
    const {
      coti_idempleado_crea,
      coti_idcliente,
      coti_nombre,
      coti_nit,
      coti_empresa,
      coti_direccion,
      coti_reg,
      coti_tel,
      coti_correo,
      coti_fecha_valida,
      coti_total,
      coti_total_rent,
      coti_xtaje_rent,
      coti_estado,
      coti_imag,
      coti_terminos,
      items,
    } = req.body;
    const coti_nog =
      req.body.coti_nog === "" ? null : parseInt(req.body.coti_nog, 10);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Mes en formato 2 dígitos

    const prefijo = `${year}${month}`;

    const correlativoNog =
      coti_nog !== null
        ? await prisma.cotizacion.findFirst({
            where: {
              coti_nog: coti_nog,
            },
            select: {
              coti_correlativo: true,
            },
          })
        : null;

    if (correlativoNog) {
      return res.status(404).json({
        mensaje: `Ya existe una cotización con este numero de NOG ${correlativoNog.coti_correlativo}.`,
      });
    }

    const maxCorrelativo = await prisma.cotizacion.findFirst({
      where: {
        coti_correlativo: {
          startsWith: prefijo,
        },
      },
      orderBy: {
        coti_correlativo: "desc",
      },
    });

    let newNumber = 1;

    if (maxCorrelativo) {
      const ultimoNumero = parseInt(maxCorrelativo.coti_correlativo.slice(-4));
      newNumber = ultimoNumero + 1;
    }

    const newCorrelativo = `${prefijo}${String(newNumber).padStart(4, "0")}`;
    const result = await prisma.$transaction(async (tx) => {
      const nuevaCotizacion = await tx.cotizacion.create({
        data: {
          coti_idempleado_crea,
          coti_idcliente,
          coti_correlativo: newCorrelativo,
          coti_nombre,
          coti_nit,
          coti_empresa,
          coti_direccion,
          coti_reg,
          coti_nog,
          coti_tel,
          coti_correo,
          coti_fecha_valida: coti_fecha_valida
            ? new Date(coti_fecha_valida)
            : undefined,
          coti_total: coti_total ? Number(coti_total) : undefined,
          coti_total_rent: coti_total_rent
            ? Number(coti_total_rent)
            : undefined,
          coti_xtaje_rent,
          coti_estado,
          coti_imag,
          coti_terminos,
        },
      });

      // 3. Insertar los detalles
      if (items.length > 0) {
        const detalles = items.map((item) => ({
          det_idcotizacion: nuevaCotizacion.idcotizacion,
          det_descripcion: item.det_descripcion,
          det_cantidad: parseInt(item.det_cantidad, 10),
          det_img: item.det_img,
          det_precio_unitario: item.det_precio_unitario,
          det_precio_rent: item.det_precio_unitario,
          det_a_ganar: item.det_a_ganar,
          det_isr: item.det_isr,
          det_iva: item.det_iva,
          det_otros_gastos: item.det_otros_gastos,
        }));

        await tx.detalle_cotizacion.createMany({
          data: detalles,
        });
      }

      return nuevaCotizacion;
    });

    return res.status(201).json({
      mensaje: "Cotización guardada exitosamente",
      correlativo: newCorrelativo,
    });
  } catch (error) {
    console.error("Error al guardar cotización:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtiene datos de cotizacion
export const dataCoti = async (req, res) => {
  try {
    const { id } = req.params;

    const cotizacion = await prisma.cotizacion.findUnique({
      where: { coti_correlativo: id },
      include: {
        detalle_cotizacion: true,
      },
    });

    if (!cotizacion) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    res.json(cotizacion);
  } catch (error) {
    console.log("Error al obtener datos cotizacion", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Edita datos de cotizacion
export const editCoti = async (req, res) => {
  const { id } = req.params;
  const {
    coti_idempleado_crea,
    coti_idcliente,
    coti_nombre,
    coti_nit,
    coti_empresa,
    coti_direccion,
    coti_reg,
    coti_tel,
    coti_correo,
    coti_fecha_valida,
    coti_total,
    coti_total_rent,
    coti_xtaje_rent,
    coti_estado,
    coti_imag,
    coti_terminos,
    items,
  } = req.body;

  const coti_nog =
    req.body.coti_nog === "" ? null : parseInt(req.body.coti_nog, 10);
  try {
    await prisma.$transaction(async (tx) => {
      // Buscamos el id de la cotizacion
      const idcotizacion = await tx.cotizacion.findUnique({
        where: { coti_correlativo: id },
        select: { idcotizacion: true },
      });

      // Actualizamos datos cotizacion
      await tx.cotizacion.update({
        where: { idcotizacion: idcotizacion.idcotizacion },
        data: {
          coti_idempleado_crea,
          coti_idcliente,
          coti_nombre,
          coti_nit,
          coti_empresa,
          coti_direccion,
          coti_reg,
          coti_nog,
          coti_tel,
          coti_correo,
          coti_fecha_valida: coti_fecha_valida
            ? new Date(coti_fecha_valida)
            : undefined,
          coti_total: coti_total ? Number(coti_total) : undefined,
          coti_total_rent: coti_total_rent
            ? Number(coti_total_rent)
            : undefined,
          coti_xtaje_rent,
          coti_estado,
          coti_imag,
          coti_terminos,
        },
      });
      // Primero borrar los detalles antiguos
      await tx.detalle_cotizacion.deleteMany({
        where: { det_idcotizacion: idcotizacion.idcotizacion },
      });

      // Se insertan los nuevos detalles de la cotizacion
      if (items.length > 0) {
        const detalles = items.map((item) => ({
          det_idcotizacion: idcotizacion.idcotizacion,
          det_descripcion: item.det_descripcion,
          det_cantidad: parseInt(item.det_cantidad, 10),
          det_img: item.img,
          det_precio_unitario: item.det_precio_unitario,
          det_precio_rent: item.det_precio_unitario,
          det_a_ganar: item.a_ganar,
          det_isr: item.isr,
          det_iva: item.iva,
          det_otros_gastos: item.otros_gastos,
        }));

        await tx.detalle_cotizacion.createMany({
          data: detalles,
        });
      }
    });

    res.json({ message: "Cotización actualizada correctamente" });
  } catch (error) {
    console.log("Error al actualizar cotizacion", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Reporte de cotizaciones
export const cotiAll = async (req, res) => {
  try {
    const data = await prisma.cotizacion.findMany({
      select: {
        coti_correlativo: true,
        coti_empresa: true,
        coti_nombre: true,
        coti_total: true,
      },
    });
    res.json(data);
  } catch (error) {
    console.log("Error al obtener todos los datos de cotizacion", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
