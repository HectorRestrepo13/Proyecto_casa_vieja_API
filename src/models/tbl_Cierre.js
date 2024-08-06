import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";


export const tbl_Cierre = sequelize.define("Cierre", {

    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define cedula como llave primaria
        autoIncrement: true // Establece el campo como autoincrementable

    },
    cantidadPlatos: {
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
    cantidadEventos: {
        type: DataTypes.DATE,
        allowNull: false
    },

}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)