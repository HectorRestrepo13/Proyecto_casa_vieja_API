import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";

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
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
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
