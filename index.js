import express from 'express';
import path from 'path';
import sequelize from "./src/models/conexion.js";
import cors from 'cors';
import dotenv from 'dotenv'; // Importar dotenv lo antes posible
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

dotenv.config(); // Inicializar dotenv

const app = express();

// Configuración de CORS para permitir solicitudes desde múltiples orígenes
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(cookieParser()) // cookie
app.use(express.urlencoded({ extended: true }));

// Importar rutas
import rutaLogin from './src/routers/routers_login.js';
import rutaMenu from './src/routers/routers_menu.js';

// Usar rutas
app.use(rutaLogin);
app.use(rutaMenu);

// Obtener la ruta del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url); // import.meta.url: Proporciona la URL del módulo actual.
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta "public/uploads"
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));

// Asociaciones ENTRE LAS TABLAS
import { tbl_usuario } from './src/models/tbl_Usuario.js';
import { tbl_Rol } from './src/models/tbl_Rol.js';
import { tbl_Mesa } from './src/models/tbl_Mesa.js';
import { tbl_Pedidos } from './src/models/tbl_Pedidos.js';
import { tbl_Menu } from './src/models/tbl_Menu.js';
import { tbl_MenuDelDia } from './src/models/tbl_MenuDelDia.js';
import { tbl_Cierre } from './src/models/tbl_Cierre.js';

// Objeto de modelos
const models = { tbl_usuario, tbl_Rol, tbl_Mesa, tbl_Pedidos, tbl_Menu, tbl_MenuDelDia, tbl_Cierre };

// Establecer asociaciones
Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

const puerto = process.env.PORT || 3000;

app.server = app.listen(puerto, () => {
    console.log(`Server ejecutándose en el puerto ${puerto}...`);
});

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("Sincronización OK!");
    })
    .catch((error) => {
        console.log(`Error en la sincronización: ${error}`);
    });