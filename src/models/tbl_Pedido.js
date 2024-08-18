import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";


export const tbl_Pedido = sequelize.define("Pedidos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define cedula como llave primaria
        autoIncrement: true // Establece el campo como autoincrementable

    },
    fechaPedido: {
        type: DataTypes.DATE,
        allowNull: false
    },
    valorTotal: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: null,
        defaultValue: "Preparacion" //Valor por defecto 1 (activo)

    },
    metodoPago: {
        type: DataTypes.STRING,
        allowNull: null,
    }

}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)


tbl_Pedido.associate = (models) => {
    tbl_Pedido.belongsTo(models.tbl_usuario, {
        foreignKey: {
            allowNull: false,
        },
    });


    tbl_Pedido.hasMany(models.tbl_DetallePedidos, {});


    return tbl_Pedido;
};