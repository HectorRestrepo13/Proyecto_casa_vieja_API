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
    }
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
    tbl_DetallePedidos.belongsTo(models.tbl_MenuDelDia, {
        foreignKey: {
            allowNull: true,
        },
    });

    return tbl_DetallePedidos;
};
