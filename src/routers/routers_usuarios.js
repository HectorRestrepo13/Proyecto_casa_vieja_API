import Router from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { check, validationResult } from "express-validator";

import { CambiarEstadoUsuario, crearUsuario, EditarUsuario, TraerTodosUsuarios, TraerUsuarioId } from "../controllers/controllers_usuarios.js";
dotenv.config();
const rutaUsuario = Router();


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


rutaUsuario.post("/crearUsuario", [
    check('cedula', 'Ingresa una Cedula').not().isEmpty(),
    check('nombreCompleto', 'Ingresa Tu nombre Completo').not().isEmpty(),
    check('telefono', 'Ingresa Un numero de telefono').not().isEmpty(),
    check('correo', 'Ingresa el Correo').not().isEmpty(),
    check('paswordUsuario')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
        .matches(/[^a-zA-Z0-9]/).withMessage('La contraseña debe contener al menos un carácter especial.'),

    check('rol', 'Ingresa el Rol del Usuario').not().isEmpty(),


], customValidationMiddleware, crearUsuario);

rutaUsuario.put("/editarUsuario/:identificacion", [
    check('nombreCompleto', 'Ingresa el Nombre Completo').not().isEmpty(),
    check('telefono', 'Ingresa el numero de Telefono').not().isEmpty(),
    check('correo', 'Ingresa Un Correo').not().isEmpty(),
    check('paswordUsuario')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
        .matches(/[^a-zA-Z0-9]/).withMessage('La contraseña debe contener al menos un carácter especial.'),

    check('rolId', 'Ingresa el ID del Usuario').not().isEmpty(),
], customValidationMiddleware, verificarToken, EditarUsuario)

rutaUsuario.put("/cambiarEstado/:identificacion", [
    check('estado', 'Ingresa el Estado').not().isEmpty(),
    check('identificacion', 'Ingresa la Identificacion').not().isEmpty(),


], customValidationMiddleware, verificarToken, CambiarEstadoUsuario)

rutaUsuario.get("/traerTodos", verificarToken, TraerTodosUsuarios)

rutaUsuario.get("/traerUsuarioId/:identificacion", [
    check('identificacion', 'Ingresa la Identificacion').not().isEmpty(),
], customValidationMiddleware, verificarToken, TraerUsuarioId)

export default rutaUsuario