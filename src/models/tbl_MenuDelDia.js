import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";


export const tbl_MenuDelDia = sequelize.define("MenuDelDia",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Define cedula como llave primaria
            autoIncrement: true // Establece el campo como autoincrementable

        },
        nombre: {
            type: DataTypes.STRING(85),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        precio: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING(200),
            allowNull: true
        },


    }, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)


tbl_MenuDelDia.associate = (models) => {
    tbl_MenuDelDia.hasMany(models.tbl_Pedidos, {});

    return tbl_MenuDelDia;
};