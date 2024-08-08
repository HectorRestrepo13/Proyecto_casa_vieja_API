import Router from "express";
import { CambiarEstadoUsuario, crearUsuario, EditarUsuario, TraerTodosUsuarios, TraerUsuarioId } from "../controllers/controllers_usuarios.js";

const rutaUsuario = Router();

rutaUsuario.post("/crearUsuario", crearUsuario);
rutaUsuario.put("/editarUsuario/:identificacion", EditarUsuario)
rutaUsuario.put("/cambiarEstado/:identificacion", CambiarEstadoUsuario)
rutaUsuario.get("/traerTodos", TraerTodosUsuarios)
rutaUsuario.get("/traerUsuarioId/:identificacion", TraerUsuarioId)

export default rutaUsuario