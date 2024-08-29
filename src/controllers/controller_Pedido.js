import { tbl_Pedido } from "../models/tbl_Pedido.js";
import { tbl_DetallePedidos } from "../models/tbl_DetallePedidos.js";
import { tbl_usuario } from "../models/tbl_Usuario.js";
import { tbl_Menu } from "../models/tbl_Menu.js";
import sequelize from "../models/conexion.js";
import { Op } from "sequelize";
import moment from "moment";


// FUNCION PARA TOMAR PEDIDO
/**
 * Crea un nuevo Pedido.
 *
 * Esta función recibe el pedido realizado por el mesero e inserta los datos en las tablas de Pedido y DetallePedido.
 * Utiliza una transacción de base de datos para asegurar que ambas inserciones (en Pedido y en DetallePedido) sean atómicas.
 * Si ocurre un error en cualquiera de las inserciones, la transacción completa se deshace, asegurando la consistencia de los datos.
 *
 * @async
 * @function func_InsertarPedido
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los detalles del pedido.
 * @param {number} req.body.valorTotal - El valor total del pedido.
 * @param {string} req.body.metodoPago - El método de pago del pedido.
 * @param {number} req.body.UsuarioId - El ID del usuario que realizó el pedido.
 * @param {Array.<Object>} req.body.datosMenu - Un array de objetos, cada uno representando un detalle del menú pedido.
 * @param {number} req.body.datosMenu[].cantidad - Cantidad del ítem en el pedido.
 * @param {number} req.body.datosMenu[].valorUnidad - Precio unitario del ítem.
 * @param {number} req.body.datosMenu[].MenuId - ID del menú.
 * @param {number} req.body.datosMenu[].MenuDelDiumId - ID del menú del día.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito o el error de la operación.
 */
export const func_InsertarPedido = async (req, res) => {

    const transaccion = await sequelize.transaction(); // Inicia una transacción

    const { valorTotal, metodoPago, UsuarioId, datosMenu } = req.body;

    try {

        // obtengo la fecha actual
        const fechaActual = new Date();

        const dia = String(fechaActual.getDate()).padStart(2, '0'); // Obtiene el día y lo formatea
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (0-11) y lo formatea
        const año = fechaActual.getFullYear(); // Obtiene el año
        const horas = String(fechaActual.getHours()).padStart(2, '0'); // Horas
        const minutos = String(fechaActual.getMinutes()).padStart(2, '0'); // Minutos
        const segundos = String(fechaActual.getSeconds()).padStart(2, '0'); // Segundos

        // Inserta los datos en la tabla Pedido
        const InsertarPedido = await tbl_Pedido.create({
            fechaPedido: `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`,
            valorTotal: valorTotal,
            metodoPago: metodoPago,
            UsuarioId: UsuarioId
        }, {
            transaction: transaccion
        });


        // despues inserto los datos en detallePedidos
        for (const element of datosMenu) {

            try {
                await tbl_DetallePedidos.create({
                    cantidad: element.cantidad,
                    valorUnidad: element.valorUnidad,
                    PedidoId: InsertarPedido.id,
                    MenuId: element.MenuId,
                    descripcion: element.descripcion
                }, {
                    transaction: transaccion
                })
            } catch (error) {
                await transaccion.rollback(); // aca daño la Insertada de las tablas

                res.status(500).send({
                    status: false,
                    descripcion: "Hubo un error en la API al Insertar Detalle Pedido",
                    datos: null,
                    error: error.message
                });
            }
        }


        await transaccion.commit();

        res.status(200).send({
            status: true,
            descripcion: "Se Inserto con exito el Pedido",
            datos: InsertarPedido.id,
            error: null
        });

    } catch (error) {
        // Si hay un error, se deshace la transacción
        await transaccion.rollback(); // aca daño la Insertada de las tablas

        res.status(500).send({
            status: false,
            descripcion: "Hubo un error en la API al Insertar Pedido",
            datos: null,
            error: error.message
        });

    }
}

// -- FIN FUNCION --


// FUNCION PARA ANULAR EL PEDIDO

/**
 * Edita el estado de un pedido existente.
 *
 * Esta función permite actualizar el estado de un pedido en la base de datos.
 * Recibe el nuevo estado del pedido y el ID del pedido que se desea actualizar.
 * Si el pedido no se encuentra, retorna un error 404. En caso de éxito, devuelve una confirmación.
 *
 * @async
 * @function func_EditarPedido
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los detalles de la actualización.
 * @param {string} req.body.nuevoEstado - El nuevo estado que se le asignará al pedido.
 * @param {number} req.body.idPedido - El ID del pedido que se desea actualizar.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON indicando el éxito o error de la operación.
 * 
 */

export const func_EditarPedido = async (req, res) => {

    const { nuevoEstado, idPedido } = req.body;

    try {

        // Realizar la actualización
        const [actualizacionEstado] = await tbl_Pedido.update(
            {
                estado: nuevoEstado,
            },
            {
                where: { id: idPedido }  // Condición para encontrar el pedido a actualizar
            }
        );

        if (actualizacionEstado === 0) {
            // Si no se actualizó ningún registro
            return res.status(404).json({
                status: false,
                descripcion: "Pedido no encontrado",
                datos: null,
                error: null
            });
        }

        // Si la actualización fue exitosa
        res.status(200).json({
            status: true,
            descripcion: "Pedido actualizado con éxito",
            datos: actualizacionEstado,
            error: null
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            descripcion: "Hubo un error en la API al Editar el estado",
            datos: null,
            error: error.message
        });
    }

}

// - FIN FUNCION --


//  FUNCION PARA SELECCIONAR LOS PEDIDOS DEL DIA ACTUAL 


export const seleccionarPedidos = async (req, res) => {
    try {
        // Obtener inicio y fin del día actual
        const inicioDia = moment().startOf('day').toDate();
        const finDia = moment().endOf('day').toDate();


        const seleccionarPedidos = await tbl_Pedido.findAll({
            where: {
                fechaPedido: {
                    [Op.between]: [inicioDia, finDia]
                }
            },
            include: [{
                model: tbl_DetallePedidos,
                required: true, // Esto asegura que solo se devuelvan los pedidos que tienen un detalle asociado (INNER JOIN)
                include: [{
                    model: tbl_Menu, // Incluye los datos del menú relacionado
                    required: true, // Asegura que solo se devuelvan los detalles que tienen un menú asociado (INNER JOIN)
                }]
            },
            {
                model: tbl_usuario,
                required: true, // Esto asegura que solo se devuelvan los pedidos que tienen un detalle asociado (INNER JOIN)
            },

            ]
        });

        res.status(200).json({
            status: true,
            descripcion: "Pedidos seleccionados con éxito",
            datos: seleccionarPedidos,
            error: null
        });
    } catch (error) {
        console.error('Error al seleccionar pedidos:', error);
        res.status(500).json({
            status: false,
            descripcion: "Hubo un error en la API al seleccionar los pedidos",
            datos: null,
            error: error.message
        });
    }
};
// -- FIN FUNCION --



// FUNCION PARA EDITAR EL METODO DE PAGO 
export const editarMetodoPago = async (req, res) => {

    const { nuevoMetodoPago, idPedido } = req.body;

    try {

        // Realizar la actualización
        const [actualizacionEstado] = await tbl_Pedido.update(
            {
                metodoPago: nuevoMetodoPago,
            },
            {
                where: { id: idPedido }  // Condición para encontrar el pedido a actualizar
            }
        );

        if (actualizacionEstado === 0) {
            // Si no se actualizó ningún registro
            return res.status(404).json({
                status: false,
                descripcion: "Pedido no encontrado",
                datos: null,
                error: null
            });
        }

        // Si la actualización fue exitosa
        res.status(200).json({
            status: true,
            descripcion: "Pedido actualizado con éxito",
            datos: actualizacionEstado,
            error: null
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            descripcion: "Hubo un error en la API al Editar el estado",
            datos: null,
            error: error.message
        });
    }

}

// - FIN FUNCION --