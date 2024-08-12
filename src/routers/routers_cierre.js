import Router from "express";
import { crearCierre, editarCierre, traerCierreID, traerTodosCierre } from "../controllers/controller_cierre.js";

const rutaCierre = Router();

rutaCierre.post("/crearCierre", crearCierre);
rutaCierre.put("/editarCierre/:id", editarCierre)
rutaCierre.get("/traerTodos",traerTodosCierre)
rutaCierre.get("/traerCierreID/:id", traerCierreID)


export default rutaCierre;
