import { Router } from "express";
import { func_InsertarPedido, func_EditarPedido } from "../controllers/controller_Pedido.js";
import { check, validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

let rutaPedido = Router();
dotenv.config();

// ESTA FUNCION ES LA QUE VA VERIFICAR LOS ERRORES Y VA MADAR UN MENSAJE DE ERROR

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

// -- FIN FUNCION --

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


// RUTA INSERTAR PEDIDO
rutaPedido.post("/insertarPedido/", [
    check("valorTotal", "Ingrese el Valor Total").not().isEmpty(),
    check("metodoPago", "Ingrese el Metodo de Pago").not().isEmpty(),
    check("UsuarioId", "Ingrese el ID del Usuario que Atendio").not().isEmpty(),
    check("datosMenu", "Ingrese los Datos del Menu").not().isEmpty(),

], customValidationMiddleware, verificarToken, func_InsertarPedido)

// RUTA EDITAR PEDIDO
rutaPedido.put("/editarPedido/", [
    check("nuevoEstado", "Ingrese el Nuevo estado del Pedido").not().isEmpty(),
    check("idPedido", "Ingresa el ID del Pedido para poder Editar").not().isEmpty()

], customValidationMiddleware, verificarToken, func_EditarPedido)

export default rutaPedido;
