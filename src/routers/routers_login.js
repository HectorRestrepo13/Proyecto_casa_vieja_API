import { Router } from "express";
import { func_registrarUsuario, func_iniciarSesion } from "../controllers/login.js";



let rutaLogin = Router();
rutaLogin.post("/login/registrarUsuario/", func_registrarUsuario)
rutaLogin.get("/login/iniciarSesion/", func_iniciarSesion)



export default rutaLogin;