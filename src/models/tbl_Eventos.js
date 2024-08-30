import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";


/**
 * Modelo de la tabla Eventos.
 * 
 * Representa un evento con detalles como nombre, cantidad de personas, abono, fecha y estado. 
 * Este modelo define la estructura de la tabla Eventos en la base de datos.
 * 
 * @typedef {Object} Evento
 * @property {number} id - Identificador único del evento. Es autoincrementable y la clave primaria.
 * @property {string} nombreEvento - Nombre del evento.
 * @property {string} nombrePersona - Nombre de la persona encargada del evento.
 * @property {number} cantidadPersonas - Cantidad de personas involucradas en el evento.
 * @property {number} abono - Monto de abono asociado al evento.
 * @property {Date} fecha - Fecha en que se realiza el evento.
 * @property {string} [descripcion] - Descripción opcional del evento.
 * @property {boolean} estado - Estado del evento (activo o inactivo). Por defecto es 1 (activo).
 * @property {string} nombreReservante - Nombre de la persona que hace la reserva.
 * @property {string} telefonoReservante - Teléfono de la persona que hace la reserva.
 * @property {string} [emailReservante] - Correo electrónico opcional de la persona que hace la reserva.
 */
export const tbl_Eventos = sequelize.define("Eventos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nombreEvento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombrePersona: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidadPersonas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    abono: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    valorEvento: {
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
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pendiente"
    },
    // Datos básicos de la persona que va a reservar
    nombreReservante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefonoReservante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailReservante: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});
