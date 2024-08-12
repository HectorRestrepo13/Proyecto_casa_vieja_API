import Router from "express";
import { check, validationResult } from "express-validator";
import jwt from 'jsonwebtoken'
import { crearCierre, editarCierre, traerCierreID, traerTodosCierre } from "../controllers/controller_cierre.js";
import dotenv from 'dotenv'
const rutaCierre = Router();
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

rutaCierre.post("/crearCierre", [
    check('cantidadPlatos', 'Ingrese la Cantidad de Platos').not().isEmpty(),
    check('valorTotal', 'Ingrese el Valor total').not().isEmpty(),
    check('fecha', 'Ingresa la Fecha').not().isEmpty(),
    check('cantidadEventos', 'Ingresa la Cantidad de eventos').not().isEmpty(),
], customValidationMiddleware, verificarToken, crearCierre);

rutaCierre.put("/editarCierre/:id", [
    check('id', 'Ingresa el ID').not().isEmpty(),
    check('cantidadPlatos', 'Ingrese la Cantidad de Platos').not().isEmpty(),
    check('valorTotal', 'Ingrese el Valor total').not().isEmpty(),
    check('fecha', 'Ingresa la Fecha').not().isEmpty(),
    check('cantidadEventos', 'Ingresa la Cantidad de eventos').not().isEmpty(),

], customValidationMiddleware, verificarToken, editarCierre)

rutaCierre.get("/traerTodos", verificarToken, traerTodosCierre)

rutaCierre.get("/traerCierreID/:id", [
    check("id", "Ingresa el ID para poder selecionarlo").not().isEmpty()
], customValidationMiddleware, verificarToken, traerCierreID)


export default rutaCierre;
