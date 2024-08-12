import { tbl_Menu } from "../models/tbl_Menu.js";
import fs from 'fs'; // para manejar archivos locales
import path from "path"; // investigar PARA MANIPULAR RUTAS DEL ARCHIVO
import multer from "multer"; // para subir archivos
import { fileURLToPath } from "url";

// Obtén la ruta del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../public/uploads/imagenesMenu'); // aca meto la ruta del archivo
if (!fs.existsSync(uploadDir)) { // verifico si existe
    fs.mkdirSync(uploadDir, { recursive: true }); // si no existe lo creo 
}


// ============================================================================

// Configuración del middleware para subir archivos al servidor
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
export const func_InsertarMenu = (req, res) => {
    const { nombreMenu, descripcionMenu, precioMenu } = req.query;

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

                // Verificar que sea imagen
                let archivo = req.file.mimetype.split("/");
                let type = archivo[1];
                if (type.toUpperCase() === "JPEG" || type.toUpperCase() === "PNG") {
                    const insertacionMenu = await tbl_Menu.create({
                        nombre: nombreMenu,
                        descripcion: descripcionMenu,
                        precio: precioMenu,
                        imagen: req.file.filename
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

export const func_selecionarTodosLosMenus = async (req, res) => {

    try {
        var urlImagenMenu = null;
        let ArregloDatosMenu = new Array();

        const traerMenus = await tbl_Menu.findAll({});

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
                UrlImagen: urlImagenMenu

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

export const func_EditarMenu = (req, res) => {

    try {

        const { nombreMenu, descripcionMenu, precioMenu, idMenu } = req.query;

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
                            imagen: req.file.filename
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