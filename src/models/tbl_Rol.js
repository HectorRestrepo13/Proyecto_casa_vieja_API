import { DataTypes } from "sequelize";

import sequelize from "./conexion.js";

export const tbl_Rol = sequelize.define('Rol', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true // Define cedula como llave primaria

    },
    descripcion: {
        type: DataTypes.STRING(50),
        allowNull: false
    },


}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)

tbl_Rol.associate = (models) => {
    tbl_Rol.hasMany(models.tbl_usuario, {});

    return tbl_Rol;
};
