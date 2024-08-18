import { DataTypes } from "sequelize";

import sequelize from "./conexion.js";

export const tbl_Rol = sequelize.define('Rol', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define cedula como llave primaria
        autoIncrement: true // Establece el campo como autoincrementable


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


// Hook para agregar datos iniciales después de sincronizar
tbl_Rol.afterSync(async () => {
    const tbl_RolsIniciales = [
        { descripcion: "ADMIN" },
        { descripcion: "CAJERO" },
        { descripcion: "MESERO" },

    ];

    //findOrCreate: Intenta encontrar una fila con la descripción especificada. Si no la encuentra, la crea.

    for (const cat of tbl_RolsIniciales) {
        await tbl_Rol.findOrCreate({ where: { descripcion: cat.descripcion } });
    }
});