import Router from "express";
import { menusMasVendidos, pedidosMasTomados, totalVentasCadaMes } from "../controllers/graficas.js";

const rutaGraficos = Router();


rutaGraficos.post("/datosMenusMasVendidos/", menusMasVendidos)
rutaGraficos.post("/pedidosMasTomados/", pedidosMasTomados)
rutaGraficos.post("/totalVentasCadaMes/", totalVentasCadaMes)




export default rutaGraficos;