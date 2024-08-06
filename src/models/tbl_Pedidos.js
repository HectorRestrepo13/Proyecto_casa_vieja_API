import { DataTypes } from "sequelize";

import sequelize from "./conexion.js";

export const tbl_Pedidos = sequelize.define("Pedidos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define cedula como llave primaria
        autoIncrement: true // Establece el campo como autoincrementable

    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valorUnidad: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    valorTotal: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)


tbl_Pedidos.associate = (models) => {
    tbl_Pedidos.belongsTo(models.tbl_Mesa, {
        foreignKey: {
            allowNull: false,
        },
    });
    tbl_Pedidos.belongsTo(models.tbl_Menu, {
        foreignKey: {
            allowNull: true,
        },
    });
    tbl_Pedidos.belongsTo(models.tbl_MenuDelDia, {
        foreignKey: {
            allowNull: true,
        },
    });

    return tbl_Pedidos;
};