import { Router } from "express";
import { func_InsertarMenu, func_selecionarTodosLosMenus, func_EliminarMenu, func_EditarMenu } from "../controllers/controller_menu.js";
import { check, validationResult } from "express-validator";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

let rutaMenu = Router();

// FUNCION PARA VERIFICAR EL TOKEN

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.SECRET_JWT_KEY, (err, decodedData) => {
            if (err) {
                return res.status(401).send({
                    status: false,
                    descripcion: "Token no válido",
                    datos: null,
                    error: err.message
                });
            }

            // Puedes acceder a los datos decodificados del token aquí
            // req.userData = decodedData;
            next();
        });
    } else {
        return res.status(403).send({
            status: false,
            descripcion: "Token no proporcionado",
            datos: null,
            error: null
        });
    }
};

// -- FIN FUNCION --


// FUNCION PARA VALIDAR LOS DATOS EXPRESS VALIDATOR

const customValidationMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    // Si hay errores en la validación, personaliza la respuesta
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            descripcion: 'Errores en la validación de los datos',
            datos: null,
            error: errors.array().map(error => ({
                param: error.param,
                msg: error.msg,
                value: error.value
            }))
        });
    }

    // Si no hay errores, pasa al siguiente middleware
    next();
};

// RUTA INSERTAR MENU
rutaMenu.post("/menu/InsertarMenu/",
    [
        check('nombreMenu', 'Ingresa el Nombre del Menu').not().isEmpty(),
        check('descripcionMenu', 'Ingresa una descripcion del Menu').not().isEmpty(),
        check('precioMenu', 'Ingresa el Precio del Menu').not().isEmpty(),


    ], customValidationMiddleware, verificarToken, func_InsertarMenu);

// RUTA SELECIONAR TODOS LOS MENUS
rutaMenu.get("/menu/selecionarTodosLosMenus/", verificarToken, func_selecionarTodosLosMenus);

// RUTA ELIMINAR MENU
rutaMenu.delete("/menu/EliminarMenu/",
    [
        check('idMenu', 'Debe ingresar una URL válida de la imagen').not().isEmpty(),
        check('urlImagenMenu', 'debe ingresar La URL de la Imagen').not().isEmpty(),

    ], customValidationMiddleware, verificarToken, func_EliminarMenu);

// RUTA PARA EDITAR MENU

rutaMenu.put("/menu/EditarMenu/",
    [
        check('nombreMenu', 'Ingresa el Nombre del Menu').not().isEmpty(),
        check('descripcionMenu', 'Ingresa una descripcion del Menu').not().isEmpty(),
        check('precioMenu', 'Ingresa el Precio del Menu').not().isEmpty(),

    ], customValidationMiddleware, verificarToken, func_EditarMenu);


export default rutaMenu;