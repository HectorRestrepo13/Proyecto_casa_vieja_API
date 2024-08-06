import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno desde el archivo .env

// instanciar la clase sequelize y le pasamos 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql' // ojo el dialecto define el gestor de base de datos , recordar descargar el driver "npm i mysql2"
})

sequelize.authenticate().then(() => {
    console.log('conexion exitosa')
}).catch(error => {
    console.log("error en la conexion", error)

})

export default sequelize;