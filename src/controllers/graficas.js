import { tbl_DetallePedidos } from "../models/tbl_DetallePedidos.js";
import { tbl_Menu } from "../models/tbl_Menu.js";
import { tbl_Pedido } from "../models/tbl_Pedido.js";
import { tbl_usuario } from "../models/tbl_Usuario.js";

import { Op, fn, col, literal } from "sequelize";

// primer Grafico
// Mostrar los productos de menor vendidos a los mas vendidos

// ACA VOY OBTENER LOS DATOS DE LOS PRODUCTOS MAS VENDIDOS DE CADA MES 
// mandando el año y el mes

export const menusMasVendidos = async (req, res) => {

    const { año, mes } = req.body;

    // Código a ejecutar si 'año' y 'mes' son números y no están vacíos
    if (año !== "" && mes !== "" && !isNaN(año) && !isNaN(mes)) {

        try {

            let consultarValoresVentas = await tbl_DetallePedidos.findAll({
                attributes: [
                    [col('Menu.nombre'), 'nombre'],  // Corregir la referencia al nombre del menú
                    [fn('SUM', col('DetallePedidos.cantidad')), 'total_cantidad']
                ],
                include: [
                    {
                        model: tbl_Pedido,
                        attributes: [], // No necesitamos atributos de 'Pedidos' en los resultados
                        where: {
                            fechaPedido: {
                                [Op.and]: [
                                    literal(`YEAR(fechaPedido) =${año} `),
                                    literal(`MONTH(fechaPedido) = ${mes}`)
                                ]
                            },
                            estado: 'Entregado'
                        }
                    },
                    {
                        model: tbl_Menu,
                        attributes: [] // No necesitamos otros atributos de 'Menus' en los resultados
                    }
                ],
                group: ['Menu.nombre'],
                order: [[literal('total_cantidad'), 'DESC']]
            })




            res.json({
                status: true,
                descripcion: "Datos Traidos con Exito",
                data: consultarValoresVentas,
                error: null
            })

        } catch (error) {
            res.json({
                status: false,
                descripcion: "Hubo un Error en la API",
                data: null,
                error: error
            })
        }

    } else {
        // Manejar el caso donde 'año' o 'mes' no son válidos

        res.json({
            status: false,
            descripcion: "Hubo un Error en la API",
            data: null,
            error: "Error al Enviar los Parametros,Estan Nulos o no son Numeros"
        })
    }







}

// -- FIN FUNCION --



// FUNCION PARA TENER LOS DATOS DE LOS MESEROS QUE A HECHO MAS PEDIDOS EN EL AÑO Y MES QUE ESCOJA EL ADMIN

export const pedidosMasTomados = async (req, res) => {

    const { año, mes } = req.body;

    // Código a ejecutar si 'año' y 'mes' son números y no están vacíos
    if (año !== "" && mes !== "" && !isNaN(año) && !isNaN(mes)) {

        try {


            const resultado = await tbl_Pedido.findAll({
                attributes: [
                    [col('Usuario.nombreCompleto'), 'nombreCompleto'], // Obtener el nombre completo del usuario
                    [fn('COUNT', col('pedidos.id')), 'total_pedidos'] // Contar el número total de pedidos
                ],
                include: [
                    {
                        model: tbl_usuario,
                        attributes: [], // No necesitamos otros atributos de usuarios en los resultados

                    }
                ],
                where: {
                    estado: 'Entregado',
                    fechaPedido: {
                        [Op.and]: [
                            literal(`YEAR(fechaPedido) = ${año}`),
                            literal(`MONTH(fechaPedido) = ${mes}`)
                        ]
                    }
                },
                group: ['nombreCompleto'] // Agrupar por el nombre completo del usuario
            });



            res.json({
                status: true,
                descripcion: "Datos Traidos con Exito",
                data: resultado,
                error: null
            })



        } catch (error) {
            res.json({
                status: false,
                descripcion: "Hubo un Error en la API",
                data: null,
                error: error
            })

        }

    }
    else {

        res.json({
            status: false,
            descripcion: "Hubo un Error en la API",
            data: null,
            error: "Error al Enviar los Parametros,Estan Nulos o no son Numeros"
        })
    }


}