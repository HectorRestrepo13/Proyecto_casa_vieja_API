import { tbl_usuario } from "../models/tbl_Usuario.js";
import { tbl_Rol } from "../models/tbl_Rol.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import { Op } from "sequelize";

dotenv.config();

// FUNCION PARA REGISTRAR USUARIO
/**
 * Registra un nuevo usuario en la base de datos.
 *
 * Esta función recibe los datos de un nuevo usuario y lo registra en la base de datos. Antes de registrar el usuario, 
 * verifica si el usuario ya está registrado mediante su cédula. Si no lo está, encripta la contraseña utilizando bcrypt 
 * y luego inserta los datos en la tabla de usuarios.
 *
 * @async
 * @function func_registrarUsuario
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los datos del usuario a registrar.
 * @param {string} req.body.cedulaUsuario - La cédula del usuario.
 * @param {string} req.body.nombreUsuario - El nombre completo del usuario.
 * @param {string} req.body.telefonoUsuario - El número de teléfono del usuario.
 * @param {string} req.body.correoUsuario - El correo electrónico del usuario.
 * @param {string} req.body.paswordUsuario - La contraseña del usuario, que será encriptada antes de guardarla.
 * @param {number} req.body.idRol - El ID del rol asignado al usuario.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito o el error de la operación.
 * @throws {Error} Devuelve un error si ocurre un problema durante el registro del usuario o la encriptación de la contraseña.
 */

export const func_registrarUsuario = async (req, res) => {

    const { cedulaUsuario, nombreUsuario, telefonoUsuario, correoUsuario, paswordUsuario, idRol } = req.body;

    try {

        if (cedulaUsuario != "" && nombreUsuario != "" && telefonoUsuario != "" && correoUsuario != "" && paswordUsuario != "" && idRol != "") {
            const salRondas = 10;
            const contraIncriptada = paswordUsuario;

            // funcion para saber si el usuario ya esta registrado
            const usuarioExiste = await tbl_usuario.findOne({ where: { cedula: cedulaUsuario } });
            if (usuarioExiste === null) {
                //  PARA INCRITAR LA CONTRASEÑA UTILIZANDO BCRYPT
                bcrypt.hash(contraIncriptada, salRondas, async function (err, hash) {
                    if (!err) {

                        const insertacion = await tbl_usuario.create({
                            cedula: cedulaUsuario,
                            nombreCompleto: nombreUsuario,
                            telefono: telefonoUsuario,
                            correo: correoUsuario,
                            password: hash,
                            RolId: idRol,
                        });
                        // Todo salió bien, enviamos la respuesta exitosa
                        res.status(200).send({
                            status: true,
                            descripcion: "Usuario insertado con exito",
                            datos: insertacion,
                            error: null,
                            validaciones: null
                        })
                    }
                    else {
                        res.status(200).send({
                            status: false,
                            descripcion: "Hubo un error al Incriptar la Contraseña",
                            datos: null,
                            error: err,
                            validaciones: null
                        })
                    }


                });
                //  FIN INCRITACION 

            } else {

                res.status(200).send({
                    status: false,
                    descripcion: "Usuario ya esta Registrado",
                    datos: null,
                    error: null,
                    validaciones: null
                })

            }
        }
        else {
            res.status(200).send({
                status: false,
                descripcion: "Esta mandando datos Vacios",
                datos: null,
                error: null,
                validaciones: null
            })
        }


    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "No se pudo Insertar los datos",
            datos: null,
            error: error,
            validaciones: null
        })
    }
}

// -- FIN FUNCION --



// FUNCION INICIAR SESION
/**
 * Inicia sesión en el sistema.
 *
 * Esta función autentica a un usuario mediante su correo y contraseña. Si las credenciales son correctas, 
 * se genera un token JWT que permite el acceso a las funcionalidades protegidas del sistema. Si las credenciales 
 * no coinciden o el usuario no está registrado, se devuelve un mensaje de error adecuado.
 *
 * @async
 * @function func_iniciarSesion
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene las credenciales del usuario.
 * @param {string} req.body.correo - El correo electrónico del usuario.
 * @param {string} req.body.contra - La contraseña del usuario.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON que indica el éxito o el error de la operación, junto con un token JWT si la autenticación es exitosa.
 * @throws {Error} Devuelve un error si ocurre un problema durante la autenticación del usuario.
 */

export const func_iniciarSesion = async (req, res) => {

    let correo = req.body.correo;
    let contra = req.body.contra;
    try {
        if (correo != "" && contra != "") {
            // aca voy a traer los datos del Usuario con el correo si devuelve null es porque no esta registrado
            const verificacionCorreo = await tbl_usuario.findAll({
                where: {
                    correo: correo,
                },
            });

            if (verificacionCorreo.length > 0) {

                let contraBaseDatos = verificacionCorreo[0].password

                if (bcrypt.compareSync(contra, contraBaseDatos)) {

                    const token = jwt.sign({ datos: verificacionCorreo },
                        process.env.SECRET_JWT_KEY,
                        {
                            expiresIn: '12h'
                        }
                    )

                    res.status(200).send({
                        status: true,
                        descripcion: "Exitoso Considen los Usuarios",
                        error: null,
                        token: token,
                        datos: verificacionCorreo,
                        validaciones: null
                    })

                }
                else {
                    res.status(200).send({
                        status: false,
                        descripcion: "Contraseña Incorrecta",
                        error: null,
                        token: null,
                        datos: null,
                        validaciones: null
                    })
                }
            }
            else {
                res.status(200).send({
                    status: false,
                    descripcion: "Usuario no Registrado",
                    error: null,
                    token: null,
                    datos: null,
                    validaciones: null
                })
            }
        }
        else {
            res.status(200).send({
                status: false,
                descripcion: "Esta mandando Datos vacios",
                error: null,
                token: null,
                datos: null,
                validaciones: null
            })
        }

    } catch (error) {
        res.status(500).send({
            status: false,
            descripcion: "Hubo un error en la API",
            error: error.message,
            token: null,
            datos: null,
            validaciones: null
        })
    }
}

// -- FIN FUNCION --


// FUNCION PARA SELECCIONAR ROLES

export const fuc_selecionarRoles = async (req, res) => {

    try {
        const traerRoles = await tbl_Rol.findAll({
            where: {
                descripcion: {
                    [Op.ne]: 'ADMIN'  // Selecciona todos los registros donde 'rol' no sea 'ADMIN'
                }

            },
        });


        res.status(200).send({
            status: true,
            descripcion: "Consulta Exitosa!! Roles Traidos",
            error: null,
            datos: traerRoles,
            validaciones: null
        })


    } catch (error) {
        res.status(500).send({
            status: false,
            descripcion: "Hubo un error en la API",
            error: error.message,
            datos: null,
            validaciones: null
        })
    }
}

// -- FIN FUNCION --