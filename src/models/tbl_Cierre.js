import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";

/**
 * Modelo de la tabla Cierre.
 * 
 * Representa el cierre de una operación con detalles como la cantidad de platos, valor total, fecha y cantidad de eventos. 
 * Este modelo define la estructura de la tabla Cierre en la base de datos.
 * 
 * @typedef {Object} Cierre
 * @property {number} id - Identificador único del cierre. Es autoincrementable y la clave primaria.
 * @property {number} cantidadPlatos - Cantidad de platos involucrados en el cierre.
 * @property {number} valorTotal - Valor total asociado al cierre.
 * @property {Date} fecha - Fecha en que se realizó el cierre.
 * @property {number} cantidadEventos - Cantidad de eventos incluidos en el cierre.
 */
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
    valorTotalPlatosVendidos: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    valorTotalEvento: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    cantidadEventos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)