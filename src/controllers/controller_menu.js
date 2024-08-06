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


// configuracion del middleware para subir archivos al server
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // aca coloco la ruta donde se va enviar los archivos
    },
    filename: (req, file, cb) => {
        cb(null, "pe-" + Date.now() + "-" + file.originalname); // aca coloco como quiero que se guarde el archivo
    },
});
const upload = multer({ storage: almacenamiento });

//==================================================================








// FUNCION PARA INSERTAR LOS MENUS

export const func_InsertarMenu = (req, res) => {
    const { nombreMenu, descripcionMenu, precioMenu, estadoMenu } = req.query;


    try {




        res.status(200).send({
            status: true,
            descripcion: "Insertacion de la API Exitoso",
            datos: nombreMenu,
            error: null
        })




    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API de Insertar Menu",
            datos: null,
            error: error
        })
    }


}


// -- FIN FUNCION --