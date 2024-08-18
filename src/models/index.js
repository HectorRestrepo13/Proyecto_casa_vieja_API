import sequelize from './conexion.js'; // Asegúrate de importar la conexión a la base de datos
import { categoria } from './categoria.js';
import { tbl_Cierre } from './tbl_Cierre.js';
import { tbl_DetallePedidos } from './tbl_DetallePedidos.js';
import { tbl_Eventos } from './tbl_Eventos.js';
import { tbl_Menu } from './tbl_Menu.js';
import { tbl_MenuDelDia } from './tbl_MenuDelDia.js';
import { tbl_Pedido } from './tbl_Pedido.js';
import { tbl_Rol } from './tbl_Rol.js';
import { tbl_usuario } from './tbl_Usuario.js';
// Importa todos los modelos aquí

// Llama a los métodos associate después de definir todos los modelos

// Objeto de modelos
const models = { categoria, tbl_usuario, tbl_Rol, tbl_Pedido, tbl_Menu, tbl_MenuDelDia, tbl_Cierre, tbl_DetallePedidos, tbl_Eventos };

// Establecer asociaciones
Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

// Exporta todos los modelos y la conexión para que puedan ser usados en otros lugares
export { models }
export default sequelize;