import { tbl_Cierre } from "../models/tbl_Cierre.js";

// Crear cierre
export const crearCierre = async (req, res) => {
  const { cantidadPlatos, valorTotal, fecha, cantidadEventos } = req.body;

  // Validar los datos requeridos
  if (!cantidadPlatos || !valorTotal || !fecha || !cantidadEventos) {
    return res.status(400).json({
      status: "error",
      message: "Todos los campos son obligatorios.",
    });
  }

  try {
    const nuevoCierre = await tbl_Cierre.create({
      cantidadPlatos,
      valorTotal,
      fecha,
      cantidadEventos,
    });

    res.status(201).json({
      status: "success",
      message: "Cierre realizado con éxito.",
      data: nuevoCierre,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al realizar el cierre.",
      error: error.message,
    });
  }
};

// Editar cierre
export const editarCierre = async (req, res) => {
  const { id } = req.params;
  const { cantidadPlatos, valorTotal, fecha, cantidadEventos } = req.body;

  // Validar los datos requeridos
  if (!id || !cantidadPlatos || !valorTotal || !fecha || !cantidadEventos) {
    return res.status(400).json({
      status: "error",
      message: "Todos los campos son obligatorios",
    });
  }

  try {
    const cierreExistente = await tbl_Cierre.findByPk(id);

    if (!cierreExistente) {
      return res.status(404).json({
        status: "error",
        message: "Cierre no encontrado.",
      });
    }

    await tbl_Cierre.update(
      {
        cantidadPlatos,
        valorTotal,
        fecha,
        cantidadEventos,
      },
      { where: { id } }
    );

    res.status(200).json({
      status: "success",
      message: "Cierre actualizado con éxito.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar el cierre.",
      error: error.message,
    });
  }
};

//Traer todos los cierres
export const traerTodosCierre = async (req, res) => {
  try {
    const traerTodos = await tbl_Cierre.findAll();
    if (traerTodos.length > 0) {
      res.status(200).json({
        status: "succes",
        message: traerTodos,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No hay cierres registrados",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al traer todos los campos",
      error: error.message,
    });
  }
};

//Traer cierre por ID
export const traerCierreID = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Debes ingresar el id del cierre",
    });
  }

  try {
    const cierreExistente = await tbl_Cierre.findByPk(id);
    if (!cierreExistente) {
      res.status(400).json({
        status: "eror",
        message: "No se encontro el cierre",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: cierreExistente,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al realizar la consulta",
      error: error.message,
    });
  }
};
