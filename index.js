import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./src/models/conexion.js";

// Inicializar dotenv para cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Configurar middleware para parsear JSON
app.use(express.json());

// Configurar CORS para permitir solicitudes desde múltiples orígenes
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Importar rutas
import rutaLogin from "./src/routers/routers_login.js";
import rutaCierre from "./src/routers/routers_cierre.js";
import rutaUsuario from "./src/routers/routers_usuarios.js";

// Usar rutas
app.use("/api/login", rutaLogin);
app.use("/api/cierre", rutaCierre);
app.use("/api/usuario", rutaUsuario);


// Obtener la ruta del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta "public/uploads"
app.use("/uploads", express.static(path.join(__dirname, "./public/uploads")));

// Asociaciones entre las tablas
import { tbl_usuario } from "./src/models/tbl_Usuario.js";
import { tbl_Rol } from "./src/models/tbl_Rol.js";
import { tbl_Mesa } from "./src/models/tbl_Mesa.js";
import { tbl_Pedidos } from "./src/models/tbl_Pedidos.js";
import { tbl_Menu } from "./src/models/tbl_Menu.js";
import { tbl_MenuDelDia } from "./src/models/tbl_MenuDelDia.js";
import { tbl_Cierre } from "./src/models/tbl_Cierre.js";
import { tbl_Eventos } from "./src/models/tbl_Eventos.js";

// Objeto de modelos
const models = {
  tbl_usuario,
  tbl_Rol,
  tbl_Mesa,
  tbl_Pedidos,
  tbl_Menu,
  tbl_MenuDelDia,
  tbl_Cierre,
  tbl_Eventos,
};

// Establecer asociaciones
Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

// Iniciar el servidor
const puerto = process.env.PORT || 3000;
app.server = app.listen(puerto, () => {
  console.log(`Server ejecutandose en ${puerto}...`);
});

// Sincronizar con la base de datos
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("sincronizacion ok!");
  })
  .catch((error) => {
    console.log(`error en la sincronizacion ${error}`);
  });
