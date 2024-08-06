import { DataTypes } from "sequelize";

import sequelize from "./conexion.js";

export const tbl_Mesa = sequelize.define("Mesa", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define cedula como llave primaria
        autoIncrement: true // Establece el campo como autoincrementable

    },
    numeroDeMesa: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    fechaPedido: {
        type: DataTypes.DATE,
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


tbl_Mesa.associate = (models) => {
    tbl_Mesa.belongsTo(models.tbl_usuario, {
        foreignKey: {
            allowNull: false,
        },
    });


    tbl_Mesa.hasMany(models.tbl_Pedidos, {});


    return tbl_Mesa;
};