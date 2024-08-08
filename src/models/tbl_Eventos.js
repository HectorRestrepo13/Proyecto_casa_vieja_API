import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";

export const tbl_Eventos = sequelize.define("Eventos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define id como llave primaria
        autoIncrement: true // Establece el campo como autoincrementable
    },
    nombreEvento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidadPersonas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valorTotal: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:1 //Valor por defecto 1 (activo)
    }
}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
});
