import Router from "express";
import { menusMasVendidos, pedidosMasTomados } from "../controllers/graficas.js";

const rutaGraficos = Router();


rutaGraficos.get("/datosMenusMasVendidos/", menusMasVendidos)
rutaGraficos.get("/pedidosMasTomados/", pedidosMasTomados)



export default rutaGraficos;