import { tbl_Menu } from "../models/tbl_Menu.js";
import { categoria } from "../models/categoria.js";
import fs from 'fs'; // para manejar archivos locales
import path from "path"; // investigar PARA MANIPULAR RUTAS DEL ARCHIVO
import multer from "multer"; // para subir archivos
import { fileURLToPath } from "url";
import { Op } from "sequelize";

// Obtén la ruta del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../public/uploads/imagenesMenu'); // aca meto la ruta del archivo
if (!fs.existsSync(uploadDir)) { // verifico si existe
    fs.mkdirSync(uploadDir, { recursive: true }); // si no existe lo creo 
}


// ============================================================================

/**
 * Configuración del middleware para subir archivos al servidor utilizando Multer.
 *
 * Este middleware define cómo y dónde se almacenarán los archivos subidos a través de las solicitudes HTTP.
 * Utiliza `multer.diskStorage` para especificar el destino y el nombre de los archivos subidos.
 *
 * @constant
 * @type {Object}
 * @property {Function} destination - Define la carpeta de destino donde se almacenarán los archivos subidos.
 * @property {Function} filename - Define cómo se nombrarán los archivos subidos. 
 * El nombre del archivo sigue el formato "pe-[timestamp]-[nombreOriginalDelArchivo]".
 *
 * @example
 * // Uso en una ruta para subir un archivo
 * app.post('/upload', upload.single('archivo'), (req, res) => {
 *     res.send('Archivo subido exitosamente');
 * });
 *
 * @requires multer - Debes tener instalado Multer para manejar las subidas de archivos.
 */

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // ruta donde se enviarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, "pe-" + Date.now() + "-" + file.originalname); // cómo se guardará el archivo
    },
});
const upload = multer({ storage: almacenamiento });

// ==========================================================================================




// FUNCION PARA INSERTAR LOS MENUS
/**
 * Inserta un nuevo menú en la base de datos.
 *
 * Esta función permite la inserción de un menú con su nombre, descripción, precio y la imagen del platillo. 
 * Utiliza Multer para gestionar la carga de archivos y realiza las validaciones necesarias para asegurarse 
 * de que solo se acepten imágenes en formato PNG o JPEG.
 *
 * @async
 * @function func_InsertarMenu
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.query - Los parámetros de consulta que contienen los detalles del menú.
 * @param {string} req.query.nombreMenu - El nombre del menú a insertar.
 * @param {string} req.query.descripcionMenu - La descripción del menú.
 * @param {number} req.query.precioMenu - El precio del menú.
 * @param {Object} req.file - Archivo subido que contiene la imagen del platillo.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito o el error de la operación.
 * @throws {Error} Devuelve un error si hay problemas con la carga del archivo o la inserción en la base de datos.
 */
export const func_InsertarMenu = (req, res) => {


    try {
        // Llamar al middleware de Multer directamente
        upload.single('imagenPlatillo')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                res.status(200).send({
                    status: false,
                    descripcion: "No se pudo insertar los datos. Verificar la parte de Multer.",
                    error: err
                });
            } else if (err) {
                res.status(200).send({
                    status: false,
                    descripcion: "No se pudo insertar los datos. Verificar la parte de Multer.",
                    error: err
                });
            } else {
                if (!req.file) {
                    return res.status(400).send({
                        status: false,
                        descripcion: "No se ha subido ningún archivo.",
                        error: "Archivo no encontrado"
                    });
                }
                console.log("ACA voy a mirar el Archivo :" + req.file);
                const { nombreMenu, descripcionMenu, precioMenu, CategoriumId } = req.body;

                if (nombreMenu != "" && descripcionMenu != "" && precioMenu != "" && CategoriumId != "") {

                    // Verificar que sea imagen
                    let archivo = req.file.mimetype.split("/");
                    let type = archivo[1];
                    if (type.toUpperCase() === "JPEG" || type.toUpperCase() === "PNG") {
                        const insertacionMenu = await tbl_Menu.create({
                            nombre: nombreMenu,
                            descripcion: descripcionMenu,
                            precio: precioMenu,
                            imagen: req.file.filename,
                            CategoriumId: CategoriumId
                        });
                        // Todo salió bien, enviamos la respuesta exitosa
                        res.status(200).send({
                            status: true,
                            descripcion: "Menú insertado con éxito",
                            datos: insertacionMenu,
                            error: null
                        });
                    } else {
                        fs.unlinkSync(req.file.path);
                        console.log("Archivo eliminado correctamente");
                        res.status(200).send({
                            status: false,
                            descripcion: "Solo se aceptan imágenes en formato PNG o JPEG",
                            error: null
                        });
                    }
                }
                else {
                    fs.unlinkSync(req.file.path);
                    res.status(200).send({
                        status: false,
                        descripcion: "Se estan Enviando Datos Nulos",
                        datos: null,
                        error: "Se estan Enviando Datos Nulos"
                    });

                }


            }
        });
    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API de insertar menú",
            datos: null,
            error: error
        });
    }
};

// -- FIN FUNCION -- 



// FUNCION PARA SELECCIONAR TODOS LOS MENUS
/**
 * Selecciona todos los menús de la base de datos.
 *
 * Esta función recupera todos los menús disponibles en la base de datos y genera la URL correspondiente 
 * para la imagen de cada menú, verificando la existencia del archivo en el sistema de archivos. Si la imagen 
 * existe, se incluye en los datos de respuesta.
 *
 * @async
 * @function func_selecionarTodosLosMenus
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {string} req.protocol - El protocolo utilizado en la solicitud (http o https).
 * @param {Object} req.headers - Los encabezados de la solicitud, utilizados para construir la URL de la imagen.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON con todos los menús disponibles, incluyendo la URL de la imagen si está disponible.
 * @throws {Error} Devuelve un error si ocurre un problema durante la consulta o la verificación de la existencia de la imagen.
 */

export const func_selecionarTodosLosMenus = async (req, res) => {

    let estadoMenu = req.params.estadoMenu;

    try {
        var urlImagenMenu = null;
        let ArregloDatosMenu = new Array();

        const traerMenus = await tbl_Menu.findAll({
            include: [{
                model: categoria, // El modelo de la tabla relacionada
            }],
            where: {
                estado: {
                    [Op.eq]: estadoMenu  // Selecciona registros donde 'nombre' contiene la palabra 'activo'
                }
            },
        });

        // recorro los datos que me trae para coger el nombre de la imagen para poder enviar la URL de la imagen

        traerMenus.map((menu) => {

            // obtengo la ruta Absoluta de la imagen 
            let RutaImagenMenu = path.resolve(__dirname, `../../public/uploads/imagenesMenu/${menu.imagen}`)
            console.log(" la ruta absoluta " + RutaImagenMenu)
            // compruebo de que la imagen exista en esa ruta 
            // creo una promesa para poder verificar ya que el "fs.access" es asincronico
            let verificacionEXistencia = new Promise((resolve, reject) => {
                fs.access(RutaImagenMenu, fs.constants.F_OK, (error) => {
                    if (error) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
            })

            if (verificacionEXistencia) {
                // Generación de URL
                urlImagenMenu = `${req.protocol}://${req.get('host')}/uploads/imagenesMenu/${menu.imagen}`;

            }

            let datosMenu = {
                id: menu.id,
                nombre: menu.nombre,
                descripcion: menu.descripcion,
                precio: menu.precio,
                estado: menu.estado,
                UrlImagen: urlImagenMenu,
                categoria: menu.Categorium.descripcion,
                idCategoria: menu.Categorium.id

            }

            ArregloDatosMenu.push(datosMenu)
        })


        res.status(200).send({
            status: true,
            descripcion: "Todos los Menus Selecionados con exito",
            datos: ArregloDatosMenu,
            error: null
        });


    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API al Selecionar todos los  menus",
            datos: null,
            error: error
        });
    }
}
// -- FIN FUNCION --


// FUNCION PARA SELECCIONAR EL MENU POR CATEGORIA
/**
 * Selecciona EL MENU ESPECIFICO por la categoria del menú de la base de datos.
 *
 * Esta función recupera todos los menús disponibles en la base de datos y genera la URL correspondiente 
 * para la imagen de cada menú, verificando la existencia del archivo en el sistema de archivos. Si la imagen 
 * existe, se incluye en los datos de respuesta.
 *
 * @async
 * @function func_selecionarMenuEspecificoCategoria
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {string} req.protocol - El protocolo utilizado en la solicitud (http o https).
 * @param {int} req.body.idCategoria - Aca recibo el id de la categoria Menu.
 * @param {Object} req.headers - Los encabezados de la solicitud, utilizados para construir la URL de la imagen.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON con todos los menús disponibles, incluyendo la URL de la imagen si está disponible.
 * @throws {Error} Devuelve un error si ocurre un problema durante la consulta o la verificación de la existencia de la imagen.
 */



export const func_selecionarMenuEspecificoCategoria = async (req, res) => {

    let { idCategoria } = req.body


    try {
        var urlImagenMenu = null;
        let ArregloDatosMenu = new Array();

        const traerMenus = await tbl_Menu.findAll({
            where: {
                CategoriumId: idCategoria,
                estado: {
                    [Op.eq]: 'activo'  // Selecciona registros donde 'estado' contiene la palabra 'activo'
                }
            },
            include: [{
                model: categoria, // El modelo de la tabla relacionada
            }]
        });

        // recorro los datos que me trae para coger el nombre de la imagen para poder enviar la URL de la imagen

        traerMenus.map((menu) => {

            // obtengo la ruta Absoluta de la imagen 
            let RutaImagenMenu = path.resolve(__dirname, `../../public/uploads/imagenesMenu/${menu.imagen}`)
            console.log(" la ruta absoluta " + RutaImagenMenu)
            // compruebo de que la imagen exista en esa ruta 
            // creo una promesa para poder verificar ya que el "fs.access" es asincronico
            let verificacionEXistencia = new Promise((resolve, reject) => {
                fs.access(RutaImagenMenu, fs.constants.F_OK, (error) => {
                    if (error) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
            })

            if (verificacionEXistencia) {
                // Generación de URL
                urlImagenMenu = `${req.protocol}://${req.get('host')}/uploads/imagenesMenu/${menu.imagen}`;

            }

            let datosMenu = {
                id: menu.id,
                nombre: menu.nombre,
                descripcion: menu.descripcion,
                precio: menu.precio,
                estado: menu.estado,
                UrlImagen: urlImagenMenu,
                categoria: menu.Categorium.descripcion,
                idCategoria: menu.Categorium.id


            }

            ArregloDatosMenu.push(datosMenu)
        })


        res.status(200).send({
            status: true,
            descripcion: "Todos los Menus Selecionados con exito",
            datos: ArregloDatosMenu,
            error: null
        });


    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API al Selecionar todos los  menus",
            datos: null,
            error: error
        });
    }
}


// -- FIN FUNCION --







// FUNCION PARA ELIMINAR UN MENU CON EL ID
/**
 * Elimina un menú de la base de datos y su imagen asociada en el sistema de archivos.
 *
 * Esta función recibe el ID del menú a eliminar y la URL de su imagen. Primero, verifica si la imagen 
 * existe en el sistema de archivos y, si es así, procede a eliminar el menú de la base de datos y su imagen 
 * del sistema de archivos.
 *
 * @async
 * @function func_EliminarMenu
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los detalles del menú a eliminar.
 * @param {number} req.body.idMenu - El ID del menú que se desea eliminar.
 * @param {string} req.body.urlImagenMenu - La URL de la imagen asociada al menú que se va a eliminar.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito o el error de la operación.
 * @throws {Error} Devuelve un error si ocurre un problema durante la eliminación del menú o la imagen.
 */

export const func_EliminarMenu = async (req, res) => {

    try {

        const { idMenu, urlImagenMenu } = req.body;

        const nombreArchivo = urlImagenMenu.split('/').pop();
        // obtengo la ruta Absoluta de la imagen 
        let RutaImagenMenu = path.resolve(__dirname, `../../public/uploads/imagenesMenu/${nombreArchivo}`)

        // Verificar si la ruta existe
        if (fs.existsSync(RutaImagenMenu)) {
            const resultadoEliminacionMenu = await tbl_Menu.destroy({
                where: {
                    id: idMenu
                }
            });
            if (resultadoEliminacionMenu) {

                // SE ELIMINO DE LA BASE DE DATOS AHORA TOCA ELIMINARLO EN EL LOCAL LA IMAGEN  
                if (urlImagenMenu != null) {


                    fs.unlinkSync(RutaImagenMenu); // elimino la imagen


                }

                res.status(200).send({
                    status: true,
                    descripcion: "Menu eliminado exitosamente",
                    datos: resultadoEliminacionMenu,
                    error: null
                });
            } else {
                res.status(200).send({
                    status: false,
                    descripcion: "No se encontró el Menu con el ID proporcionado",
                    datos: resultadoEliminacionMenu,
                    error: null
                });
            }

        } else {
            res.status(200).send({
                status: false,
                descripcion: "la imagen no existe",
                datos: RutaImagenMenu,
                error: null
            });
        }


    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API al Eliminar el menu",
            datos: null,
            error: error
        });
    }

}

// -- FIN FUNCION --


// FUNCION PARA EDITAR EL MENU

/**
 * Edita un menú existente en la base de datos, con la opción de actualizar la imagen asociada.
 *
 * Esta función permite actualizar los detalles de un menú, como nombre, descripción, precio, y opcionalmente, 
 * la imagen del platillo. Si se sube una nueva imagen, se actualiza en la base de datos; de lo contrario, solo se 
 * actualizan los detalles sin cambiar la imagen existente.
 *
 * @async
 * @function func_EditarMenu
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.query - Parámetros de consulta que contienen los detalles del menú a actualizar.
 * @param {string} req.query.nombreMenu - El nuevo nombre del menú.
 * @param {string} req.query.descripcionMenu - La nueva descripción del menú.
 * @param {number} req.query.precioMenu - El nuevo precio del menú.
 * @param {number} req.query.idMenu - El ID del menú que se desea editar.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito o el error de la operación.
 * @throws {Error} Devuelve un error si ocurre un problema durante la edición del menú.
 */

export const func_EditarMenu = (req, res) => {

    try {

        const { nombreMenu, descripcionMenu, precioMenu, idMenu, idCategoria } = req.query;

        // Llamar al middleware de Multer directamente
        upload.single('imagenPlatillo')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                res.status(200).send({
                    status: false,
                    descripcion: "No se pudo insertar los datos. Verificar la parte de Multer.",
                    error: err
                });
            } else if (err) {
                res.status(200).send({
                    status: false,
                    descripcion: "No se pudo insertar los datos. Verificar la parte de Multer.",
                    error: err
                });
            } else {

                console.log("ACA voy a mirar el Archivo :" + req.file);

                if (!req.file) {

                    //  ACA SE VA ACTUALIZAR EL MENU PERO SIN LA IMAGEN

                    const [insertacionMenu] = await tbl_Menu.update({
                        nombre: nombreMenu,
                        descripcion: descripcionMenu,
                        precio: precioMenu,
                        CategoriumId: idCategoria
                    },
                        {
                            where: { id: idMenu }
                        });

                    if (insertacionMenu > 0) {
                        // Todo salió bien, enviamos la respuesta exitosa
                        res.status(200).send({
                            status: true,
                            descripcion: "Menú insertado con éxito",
                            datos: insertacionMenu,
                            error: null
                        });
                    }
                    else {
                        // Si no se actulizo 
                        res.status(200).send({
                            status: false,
                            descripcion: "ID No encontrado Verificar",
                            datos: insertacionMenu,
                            error: null
                        });
                    }
                }
                else {

                    // ACA SE ACTULIZA CON LA IMAGEN

                    // Verificar que sea imagen
                    let archivo = req.file.mimetype.split("/");
                    let type = archivo[1];
                    if (type.toUpperCase() === "JPEG" || type.toUpperCase() === "PNG") {


                        const [insertacionMenu] = await tbl_Menu.update({
                            nombre: nombreMenu,
                            descripcion: descripcionMenu,
                            precio: precioMenu,
                            imagen: req.file.filename,
                            CategoriumId: idCategoria
                        },
                            {
                                where: { id: idMenu }
                            });


                        if (insertacionMenu > 0) {
                            // Todo salió bien, enviamos la respuesta exitosa
                            res.status(200).send({
                                status: true,
                                descripcion: "Menú insertado con éxito",
                                datos: insertacionMenu,
                                error: null
                            });
                        }
                        else {

                            fs.unlinkSync(req.file.path); // elimino el archivo ya que no se guardo en la base de datos

                            // Si no se actulizo 
                            res.status(200).send({
                                status: false,
                                descripcion: "ID No encontrado Verificar",
                                datos: insertacionMenu,
                                error: null
                            });
                        }


                    } else {
                        fs.unlinkSync(req.file.path);
                        console.log("Archivo eliminado correctamente");
                        res.status(200).send({
                            status: false,
                            descripcion: "Solo se aceptan imágenes en formato PNG o JPEG",
                            error: null
                        });
                    }
                }

            }
        });

    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API al Editar el Menu",
            datos: null,
            error: error
        });
    }

}

// -- FIN FUNCION --

// FUNCION PARA SELECCIONAR LAS CATEGORIAS

export const seleccionarCategorias = async (req, res) => {


    try {

        const traerCategorias = await categoria.findAll({});

        res.status(200).send({
            status: true,
            descripcion: "Exito al Seleccionar las Categorias",
            datos: traerCategorias,
            error: null
        });


    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API al Seleccionar las Categorias",
            datos: null,
            error: error
        });
    }

}

// -- FIN FUNCION --


export const anularItemMenu = async (req, res) => {

    const { idMenu, nuevoEstado } = req.body;

    try {

        const [result] = await tbl_Menu.update(
            { estado: nuevoEstado }, // Campos a actualizar
            {
                where: {
                    id: idMenu,
                },
            }
        );

        if (result > 0) {
            res.status(200).send({
                status: true,
                descripcion: "Item Anulado con Exito",
                datos: result,
                error: null
            });
        }
        else {
            res.status(200).send({
                status: false,
                descripcion: "Ese Menu no Existe",
                datos: result,
                error: null
            });
        }




    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API al Anular  el Item del Menu",
            datos: null,
            error: error
        });
    }



}