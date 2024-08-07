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