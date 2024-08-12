import { tbl_usuario } from "../models/tbl_Usuario.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";

dotenv.config();

// FUNCION PARA REGISTRAR USUARIO

export const func_registrarUsuario = async (req, res) => {

    const { cedulaUsuario, nombreUsuario, telefonoUsuario, correoUsuario, paswordUsuario, idRol } = req.body;


    try {

        if (cedulaUsuario != "" && nombreUsuario != "" && telefonoUsuario != "" && correoUsuario != "" && paswordUsuario != "" && idRol != "") {
            const salRondas = 10;
            const contraIncriptada = `s0/\/${paswordUsuario}\P4$$w0rD`;

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
                            error: null
                        })


                    }
                    else {
                        res.status(200).send({
                            status: false,
                            descripcion: "Hubo un error al Incriptar la Contraseña",
                            datos: null,
                            error: err
                        })
                    }


                });
                //  FIN INCRITACION 

            } else {

                res.status(200).send({
                    status: false,
                    descripcion: "Usuario ya esta Registrado",
                    datos: null,
                    error: null
                })

            }
        }
        else {
            res.status(200).send({
                status: false,
                descripcion: "Esta mandando datos Vacios",
                datos: null,
                error: null
            })
        }


    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "No se pudo Insertar los datos",
            datos: null,
            error: error
        })
    }


}

// -- FIN FUNCION --



// FUNCION INICIAR SESION

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

                if (bcrypt.compareSync(`s0/\/${contra}\P4$$w0rD`, contraBaseDatos)) {

                    const token = jwt.sign({ datos: verificacionCorreo },
                        process.env.SECRET_JWT_KEY,
                        {
                            expiresIn: '2h'
                        }
                    )

                    res.status(200).send({
                        status: true,
                        descripcion: "Exitoso Considen los Usuarios",
                        error: null,
                        token: token,
                        datos: verificacionCorreo
                    })


                }
                else {
                    res.status(200).send({
                        status: false,
                        descripcion: "Contraseña Incorrecta",
                        error: null,
                        token: null,
                        datos: null
                    })
                }

            }
            else {
                res.status(200).send({
                    status: false,
                    descripcion: "Usuario no Registrado",
                    error: null,
                    token: null,
                    datos: null
                })
            }
        }
        else {
            res.status(200).send({
                status: false,
                descripcion: "Esta mandando Datos vacios",
                error: null,
                token: null,
                datos: null
            })
        }



    } catch (error) {
        res.status(200).send({
            status: false,
            descripcion: "Hubo un error en la API",
            error: error.message,
            token: null,
            datos: null
        })
    }

}


// -- FIN FUNCION --