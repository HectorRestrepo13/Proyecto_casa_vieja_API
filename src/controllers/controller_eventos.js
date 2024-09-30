import { tbl_Eventos } from "../models/tbl_Eventos.js";

/**
 * Crear un nuevo evento.
 *
 * Este endpoint permite crear un evento en la base de datos con los detalles proporcionados en el cuerpo de la solicitud.
 *
 * @async
 * @function crearEvento
 * @param {Object} req - Objeto de solicitud (Request) de Express. Debe incluir los datos del evento en `req.body`.
 * @param {string} req.body.nombreEvento - Nombre del evento.
 * @param {string} req.body.nombrePersona - Nombre de la persona encargada del evento.
 * @param {number} req.body.cantidadPersonas - Cantidad de personas que asistirán al evento.
 * @param {number} req.body.abono - Monto del abono para el evento.
 * @param {Date} req.body.fecha - Fecha del evento.
 * @param {string} [req.body.descripcion] - Descripción opcional del evento.
 * @param {string} req.body.nombreReservante - Nombre de la persona que reservó el evento.
 * @param {string} req.body.telefonoReservante - Teléfono de contacto de la persona que reservó el evento.
 * @param {string} [req.body.emailReservante] - Correo electrónico opcional de la persona que reservó el evento.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito de la creación del evento o un mensaje de error en caso contrario.
 */
export const crearEvento = async (req, res) => {
    const {
        nombreEvento,
        nombrePersona,
        cantidadPersonas,
        abono,
        descripcion,
        nombreReservante,
        telefonoReservante,
        emailReservante,
        fechaInicio,
        fechaFin,
        estado,
        valorEvento
    } = req.body;
    console.log(req.body)
    // Validar que todos los campos obligatorios estén presentes
    if (!nombreEvento || !nombrePersona || !cantidadPersonas || !abono || !fechaInicio || !nombreReservante || !telefonoReservante) {
        return res.status(400).json({
            status: "error",
            message: "Debe de ingresar todos los campos obligatorios correctamente"
        });
    }

    try {
        // Crear un nuevo evento en la base de datos
        const nuevoEvento = await tbl_Eventos.create({
            nombreEvento,
            nombrePersona,
            cantidadPersonas,
            abono,
            valorEvento,
            fechaInicio,
            fechaFin,
            descripcion, // este campo es opcional
            estado,
            nombreReservante,
            telefonoReservante,
            emailReservante,// este campo es opcional

        });

        // Responder con éxito y enviar el evento creado
        res.status(201).json({
            status: "success",
            message: "Evento creado exitosamente",
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({
            status: "error",
            message: "Hubo un problema al crear el evento",
            error: error.message
        });
    }
}


/**
 * Editar un evento existente.
 *
 * Este endpoint permite actualizar los detalles de un evento específico en la base de datos
 * usando el identificador proporcionado en los parámetros de la solicitud y los datos nuevos en el cuerpo de la solicitud.
 *
 * @async
 * @function editarEvento
 * @param {Object} req - Objeto de solicitud (Request) de Express. Debe incluir el identificador del evento en los parámetros y los datos actualizados en `req.body`.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.id - Identificador del evento a actualizar.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene los datos actualizados del evento.
 * @param {string} req.body.nombreEvento - Nuevo nombre del evento.
 * @param {string} req.body.nombrePersona - Nuevo nombre de la persona encargada del evento.
 * @param {number} req.body.cantidadPersonas - Nueva cantidad de personas que asistirán al evento.
 * @param {number} req.body.abono - Nuevo monto del abono para el evento.
 * @param {Date} req.body.fecha - Nueva fecha del evento.
 * @param {string} req.body.descripcion - Nueva descripción del evento.
 * @param {string} req.body.nombreReservante - Nuevo nombre de la persona que reservó el evento.
 * @param {string} req.body.telefonoReservante - Nuevo teléfono de contacto de la persona que reservó el evento.
 * @param {string} req.body.emailReservante - Nuevo correo electrónico de la persona que reservó el evento.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito de la actualización del evento o un mensaje de error en caso contrario.
 */
export const editarEvento = async (req, res) => {
    const { id } = req.params;
    const { nombreEvento, nombrePersona, cantidadPersonas, abono, descripcion, nombreReservante, telefonoReservante, emailReservante, fechaInicio, fechaFin, estado, valorEvento } = req.body;

    if (!id || !nombreEvento || !nombrePersona || !cantidadPersonas || !abono || !nombreReservante || !telefonoReservante || !emailReservante) {
        return res.status(400).json({
            status: "error",
            message: "Debe de ingresar todos los campos correctamente"
        });
    }

    try {
        const evento = await tbl_Eventos.findByPk(id);

        if (!evento) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        evento.nombreEvento = nombreEvento;
        evento.nombrePersona = nombrePersona;
        evento.cantidadPersonas = cantidadPersonas;
        evento.abono = abono;
        evento.valorEvento = valorEvento;
        evento.fechaInicio = fechaInicio;
        evento.fechaFin = fechaFin;
        evento.estado = estado;
        evento.descripcion = descripcion;
        evento.nombreReservante = nombreReservante;
        evento.telefonoReservante = telefonoReservante;
        evento.emailReservante = emailReservante;

        await evento.save();

        res.status(200).json({
            status: "success",
            message: "Evento actualizado correctamente",

        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Hubo un error al actualizar el evento",
            error: error.message
        });
    }
};


/**
 * Cambiar el estado de un evento existente.
 *
 * Este endpoint permite actualizar el estado de un evento específico en la base de datos
 * usando el identificador proporcionado en los parámetros de la solicitud y el nuevo estado en el cuerpo de la solicitud.
 *
 * @async
 * @function cambiarEstadoEvento
 * @param {Object} req - Objeto de solicitud (Request) de Express. Debe incluir el identificador del evento en los parámetros y el nuevo estado en `req.body`.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.id - Identificador del evento cuyo estado se desea cambiar.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene el nuevo estado del evento.
 * @param {number} req.body.estado - Nuevo estado del evento. Debe ser 0 (inactivo) o 1 (activo).
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito del cambio de estado o un mensaje de error en caso contrario.
 */
export const cambiarEstadoEvento = async (req, res) => {
    const { estado } = req.body;
    const { id } = req.params;

    if (!id || (estado !== 0 && estado !== 1)) {
        res.status(400).json({
            status: "error",
            message: "Debes de ingresar todos los datos"
        });
    }
    try {
        const eventoExistente = await tbl_Eventos.findOne({
            where: {
                id: id
            }
        })
        if (!eventoExistente) {
            res.status(400).json({
                status: "error",
                message: "El evento no existe"
            });
        }
        await tbl_Eventos.update(
            { estado },
            {
                where: {
                    id: id
                }
            })
        res.status(200).json({
            status: "success",
            message: "Estado cambiado con exito"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error: error.message
        });
    }
}


/**
 * Obtener todos los eventos registrados en la base de datos.
 *
 * Este endpoint recupera todos los eventos existentes en la base de datos y los devuelve en la respuesta.
 *
 * @async
 * @function traerTodosEventos
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que contiene una lista de todos los eventos registrados o un mensaje de error en caso de problemas con el servidor.
 */
export const traerTodosEventos = async (req, res) => {
    try {
        const traerTodo = await tbl_Eventos.findAll();
        res.status(200).json({
            status: "success",
            message: "datos traidos con exito",
            data: traerTodo
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error del servidor",
            error: error.message
        });
    }
}

/**
 * Obtener un evento específico por su ID.
 *
 * Este endpoint recupera un evento de la base de datos utilizando su ID proporcionado en los parámetros de la solicitud.
 *
 * @async
 * @function traerEventoId
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {string} req.params.id - El ID del evento que se desea recuperar.
 * @returns {JSON} Devuelve un objeto JSON con el evento encontrado o un mensaje de error si el evento no existe o hay un problema con la solicitud.
 */
export const traerEventoId = async (req, res) => {
    const { id } = req.params;

    // Verifica si se proporcionó un ID
    if (!id) {
        return res.status(400).json({
            status: "error",
            message: "Debes ingresar un ID válido.",
        });
    }

    try {
        // Busca el evento en la base de datos por su ID
        const eventoExistente = await tbl_Eventos.findOne({ where: { id } });

        // Verifica si el evento existe
        if (!eventoExistente) {
            return res.status(404).json({
                status: "error",
                message: "No hay eventos con ese ID.",
            });
        }

        // Devuelve el evento encontrado
        return res.status(200).json({
            status: "success",
            data: eventoExistente,
        });
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al buscar el evento.",
            error: error.message,
        });
    }
};
