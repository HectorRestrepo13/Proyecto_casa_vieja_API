import { Router } from "express";
import { func_InsertarMenu } from "../controllers/controller_menu.js";

let rutaMenu = Router();

rutaMenu.post("/menu/InsertarMenu/", func_InsertarMenu);


export default rutaMenu;