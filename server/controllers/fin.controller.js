import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Obtiene categorias de catalogo
export const categorias = async (req, res) => {
  const { id } = req.params;
  const status = 1;
  console.log(id);
  try {
    const categoria = await prisma.catalogo.findMany({
      where: { cat_categoria: Number(id), cat_estado: status },
      select: {
        idcatalogo: true,
        cat_nombre: true,
      },
    });
    res.status(200).json(categoria);
  } catch (error) {
    console.log("Error al obtener categorias", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Inserta nuevo ingreso
export const saveIngreso = async (req, res) => {
  try {
    const {
      ing_categoria,
      ing_cot_correlativo,
      ing_metodo_pago,
      ing_nreferencia,
      ing_descripcion,
      ing_fecha_fact,
      ing_fecha_crea,
      ing_monto,
    } = req.body;

    const ingreso = await prisma.ingreso.create({
      data: {
        ing_categoria,
        ing_cot_correlativo,
        ing_metodo_pago,
        ing_nreferencia,
        ing_descripcion,
        ing_fecha_fact,
        ing_fecha_crea,
        ing_monto,
      },
    });

    res.status(201).json({ message: "Ingreso creado exitosamente" });
  } catch (error) {
    console.log("Error al insertar ingreso", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtiene todos los ingresos del mes
export const getIngresos = async (req, res) => {
  try {
    const ingresos = await prisma.ingreso.findMany({
      orderBy: { ing_fecha_crea: "desc" },
    });
    res.status(200).json(ingresos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ingresos" });
  }
};

export const getEgresos = async (req, res) => {
  try {
    const egresos = await prisma.egreso.findMany({
      orderBy: { egs_fecha_crea: "desc" },
    });
    res.status(200).json(egresos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener egresos" });
  }
};

// Crea un nuevo egreso
export const saveEgreso = async (req, res) => {
  try {
    const {
      egs_categoria,
      egs_nocompra,
      egs_metodo_pago,
      egs_nreferencia,
      egs_descripcion,
      egs_fecha_fact,
      egs_monto,
    } = req.body;

    const egreso = await prisma.egreso.create({
      data: {
        egs_categoria,
        egs_nocompra,
        egs_metodo_pago,
        egs_nreferencia,
        egs_descripcion,
        egs_fecha_fact: new Date(egs_fecha_fact),
        egs_monto,
      },
    });

    res.status(201).json({ message: "Egreso creado exitosamente" });
  } catch (error) {
    console.log("Error al insertar egreso", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
