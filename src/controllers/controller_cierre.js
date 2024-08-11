import { tbl_Cierre } from "../models/tbl_Cierre.js";

/**
 * Crea un nuevo cierre de jornada.
 *
 * Este endpoint recibe los detalles de un cierre de jornada, valida los campos requeridos
 * y crea un nuevo registro en la base de datos con la información proporcionada.
 *
 * @async
 * @function crearCierre
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los detalles del cierre.
 * @param {number} req.body.cantidadPlatos - La cantidad total de platos servidos en la jornada.
 * @param {number} req.body.valorTotal - El valor total recaudado en la jornada.
 * @param {string} req.body.fecha - La fecha del cierre en formato `YYYY-MM-DD`.
 * @param {number} req.body.cantidadEventos - La cantidad total de eventos realizados en la jornada.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito o el error de la operación.
 */
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

/**
 * Editar un cierre existente.
 *
 * Este endpoint permite editar los detalles de un cierre existente en la base de datos.
 * Los campos obligatorios deben ser proporcionados en la solicitud.
 *
 * @async
 * @function editarCierre
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.params - Parámetros de la ruta.
 * @param {number} req.params.id - El ID del cierre a editar.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los nuevos detalles del cierre.
 * @param {number} req.body.cantidadPlatos - La nueva cantidad total de platos servidos.
 * @param {number} req.body.valorTotal - El nuevo valor total recaudado.
 * @param {string} req.body.fecha - La nueva fecha del cierre en formato `YYYY-MM-DD`.
 * @param {number} req.body.cantidadEventos - La nueva cantidad total de eventos realizados.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito o el error de la operación.
 */
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

/**
 * Traer todos los cierres.
 *
 * Este endpoint permite obtener todos los registros de cierres de la base de datos.
 *
 * @async
 * @function traerTodosCierre
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que contiene todos los cierres o un mensaje de error si no hay cierres.
 */
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

/**
 * Traer cierre por ID.
 *
 * Este endpoint permite obtener un cierre específico de la base de datos utilizando su ID.
 *
 * @async
 * @function traerCierreID
 * @param {Object} req - Objeto de solicitud (Request) de Express. Debe incluir el ID del cierre en `req.params`.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que contiene los datos del cierre o un mensaje de error si no se encuentra.
 */
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
