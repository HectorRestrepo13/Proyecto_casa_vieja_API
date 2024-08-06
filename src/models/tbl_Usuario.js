import { DataTypes } from "sequelize";

import sequelize from "./conexion.js";

export const tbl_usuario = sequelize.define('Usuario', {
    cedula: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true // Define cedula como llave primaria

    },
    nombreCompleto: {
        type: DataTypes.STRING(85),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    correo: {
        type: DataTypes.STRING(85),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(85),
        allowNull: false
    },




}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)



tbl_usuario.associate = (models) => {
    tbl_usuario.belongsTo(models.tbl_Rol, {
        foreignKey: {
            allowNull: false,
        },
    });

    return tbl_usuario;
};