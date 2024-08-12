import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Inicializar dotenv para cargar variables de entorno
dotenv.config();

/**
 * Inicializa una aplicación Express y configura sus middleware y rutas.
 * 
 * @module app
 */

// Inicializar Express
const app = express();

// Configurar middleware para parsear JSON y formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
import rutaCierre from './src/routers/routers_cierre.js';
import rutaUsuario from './src/routers/routers_usuarios.js';
import rutaMenu from './src/routers/routers_menu.js';
import rutaEvento from './src/routers/routers_eventos.js';

// Usar rutas
app.use('/api/login', rutaLogin);
app.use('/api/cierre', rutaCierre);
app.use('/api/usuario', rutaUsuario);
app.use('/api/menu', rutaMenu);
app.use('/api/evento', rutaEvento);

// Obtener la ruta del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta "public/uploads"
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));

// Importar modelos y establecer asociaciones
import { tbl_usuario } from './src/models/tbl_Usuario.js';
import { tbl_Rol } from './src/models/tbl_Rol.js';
import { tbl_Pedido } from './src/models/tbl_Pedido.js';
import { tbl_DetallePedidos } from './src/models/tbl_DetallePedidos.js';
import { tbl_Menu } from './src/models/tbl_Menu.js';
import { tbl_MenuDelDia } from './src/models/tbl_MenuDelDia.js';
import { tbl_Cierre } from './src/models/tbl_Cierre.js';
import { tbl_Eventos } from './src/models/tbl_Eventos.js';

// Objeto de modelos
const models = {
    tbl_usuario,
    tbl_Rol,
    tbl_Pedido,
    tbl_DetallePedidos,
    tbl_Menu,
    tbl_MenuDelDia,
    tbl_Cierre,
    tbl_Eventos,
};

// Establecer asociaciones entre modelos
Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

// Sincronizar con la base de datos
sequelize.sync({ force: false })
    .then(() => {
        console.log('¡Sincronización con la base de datos completada!');
    })
    .catch(error => {
        console.log(`Error en la sincronización: ${error}`);
    });

// Iniciar el servidor
const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
    console.log(`Servidor ejecutándose en el puerto ${puerto}...`);
});
