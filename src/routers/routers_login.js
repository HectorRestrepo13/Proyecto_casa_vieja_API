import { Router } from "express";
import { check, validationResult } from "express-validator";
import { func_registrarUsuario, func_iniciarSesion } from "../controllers/login.js";

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

let rutaLogin = Router();

// RUTAS
// RUTA REGISTRAR USUARIO
rutaLogin.post("/login/registrarUsuario/", [
    check('cedulaUsuario', 'Debe Ingresar La Cedula').not().isEmpty(),
    check('nombreUsuario', 'debe ingresar un nombre').not().isEmpty(),
    check('telefonoUsuario', 'Debe ingresar un Telefono').not().isEmpty(),
    check('idRol', 'Debe Ingresar el IdRol').not().isEmpty(),
    check('correoUsuario', 'email obligatorio').isEmail(),
    check('paswordUsuario')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
        .matches(/[^a-zA-Z0-9]/).withMessage('La contraseña debe contener al menos un carácter especial.'),

], customValidationMiddleware, func_registrarUsuario);

// RUTA INICIAR SESION
rutaLogin.post("/login/iniciarSesion/", [
    check('correo', 'Debe Ingresar un Correo').not().isEmpty(),
    check('correo', 'email obligatorio').isEmail(),
    check('contra', 'debe ingresar una contraseña').not().isEmpty(),
], customValidationMiddleware, func_iniciarSesion)



export default rutaLogin;