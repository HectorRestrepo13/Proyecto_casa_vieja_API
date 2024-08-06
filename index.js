
import express from 'express'
import path from 'path'
import sequelize from "./src/models/conexion.js";
import cors from 'cors'
let app = express();
app.use(cors())


// llamo las rutas
import rutaLogin from './src/routers/routers_login.js';


app.use(rutaLogin)


// Configurar CORS para permitir solicitudes desde múltiples orígenes
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

import dotenv from 'dotenv'; // llamo la libreria 
dotenv.config();

app.use(express.json());
const puerto = process.env.PORT || 3000;


import { fileURLToPath } from 'url';


// En Node.js, cuando se utiliza CommonJS (CJS), __dirname y _
// _filename están disponibles por defecto y representan el directorio actual y
//  la ruta del archivo actual, respectivamente. Sin embargo, cuando se utiliza ECMAScript
//   Modules (ESM) especificando "type": "module" en el archivo package.json, estas variables 
//   no están disponibles. Para obtener el mismo resultado, necesitas usar la API de import.meta.url.

// Obtener la ruta del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url);  // import.meta.url: Proporciona la URL del módulo actual.
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
// -- FIN --

app.server = app.listen(puerto, () => {
    console.log(`Server ejecutandose en ${puerto}...`);
});

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("sincronizacion ok!");
    })
    .catch((error) => {
        console.log(`error en la sincronizacion ${error}`);
    });


