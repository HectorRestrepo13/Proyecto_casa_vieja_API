import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";


export const tbl_Menu = sequelize.define("Menu", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define cedula como llave primaria
        autoIncrement: true, // Establece el campo como autoincrementable
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
    estado: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: 'activo' // Valor predeterminado
    },

}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)


tbl_Menu.associate = (models) => {

    tbl_Menu.belongsTo(models.categoria, {
        foreignKey: {
            allowNull: false,
        },
    });


    tbl_Menu.hasMany(models.tbl_DetallePedidos, {});

    return tbl_Menu;
};
