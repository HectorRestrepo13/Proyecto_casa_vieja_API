import Router from "express";
import { check, validationResult } from "express-validator";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { cambiarEstadoEvento, crearEvento, editarEvento, traerEventoId, traerTodosEventos } from "../controllers/controller_eventos.js";

const rutaEvento = Router();
dotenv.config();

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




rutaEvento.post("/crearEvento", [
    check('nombrePersona', 'Ingrese el nombre de la Persona').not().isEmpty(),
    check('cantidadPersonas', 'Ingrese la Cantidad de Personas').not().isEmpty(),
    check('abono', 'Ingrese la Cantidad de Abono').not().isEmpty(),
    check('nombreEvento', 'Ingrese el Nombre del Evento').not().isEmpty(),
    check('fecha', 'Ingrese la Fecha del Evento').not().isEmpty(),
    check('descripcion', 'Ingrese la Descripcion').not().isEmpty(),
    check('nombreReservante', 'Ingrese el Nombre del Reservante').not().isEmpty(),
    check('telefonoReservante', 'Ingrese el Telefono del Reservante').not().isEmpty(),
    check('emailReservante', 'email obligatorio').isEmail(),
], customValidationMiddleware, verificarToken, crearEvento);

rutaEvento.put("/editarEvento/:id", [
    check('nombrePersona', 'Ingrese el nombre de la Persona').not().isEmpty(),
    check('cantidadPersonas', 'Ingrese la Cantidad de Personas').not().isEmpty(),
    check('abono', 'Ingrese la Cantidad de Abono').not().isEmpty(),
    check('nombreEvento', 'Ingrese el Nombre del Evento').not().isEmpty(),
    check('fecha', 'Ingrese la Fecha del Evento').not().isEmpty(),
    check('descripcion', 'Ingrese la Descripcion').not().isEmpty(),
    check('nombreReservante', 'Ingrese el Nombre del Reservante').not().isEmpty(),
    check('telefonoReservante', 'Ingrese el Telefono del Reservante').not().isEmpty(),
    check('emailReservante', 'email obligatorio').isEmail(),
], customValidationMiddleware, verificarToken, editarEvento);

rutaEvento.put("/cambiarEstado/:id", [
    check("estado", "Ingrese el Estado").not().isEmpty(),
    check("id", "Ingrese el ID").not().isEmpty(),

], customValidationMiddleware, verificarToken, cambiarEstadoEvento);

rutaEvento.get("/traerTodo", verificarToken, traerTodosEventos);

rutaEvento.get("/traerTodoId/:id", [
    check("id", "Ingrese el ID del Evento").not().isEmail(),
], customValidationMiddleware, verificarToken, traerEventoId);
export default rutaEvento;