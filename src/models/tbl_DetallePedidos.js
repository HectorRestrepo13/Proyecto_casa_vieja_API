import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";


export const tbl_DetallePedidos = sequelize.define("DetallePedidos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valorUnidad: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(300),
        allowNull: true
    },

}, {
    timestamps: false
});

tbl_DetallePedidos.associate = (models) => {
    tbl_DetallePedidos.belongsTo(models.tbl_Pedido, {
        foreignKey: {
            allowNull: false,
        },
    });
    tbl_DetallePedidos.belongsTo(models.tbl_Menu, {
        foreignKey: {
            allowNull: true,
        },
    });


    return tbl_DetallePedidos;
};
