import Router from "express";
import { cambiarEstadoEvento, crearEvento, editarEvento, traerEventoId, traerTodosEventos } from "../controllers/controller_eventos.js";

const rutaEvento = Router();

rutaEvento.post("/crearEvento",crearEvento);
rutaEvento.put("/editarEvento/:id",editarEvento);
rutaEvento.put("/cambiarEstado/:id",cambiarEstadoEvento);
rutaEvento.get("/traerTodo", traerTodosEventos);
rutaEvento.get("/traerTodoId/:id", traerEventoId);
export default rutaEvento;