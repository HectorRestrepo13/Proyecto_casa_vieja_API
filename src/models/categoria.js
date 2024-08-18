import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";

export const categoria = sequelize.define("Categoria", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define cedula como llave primaria
        autoIncrement: true, // Establece el campo como autoincrementable

    },

    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

}, {
    timestamps: false // Desactiva las columnas createdAt y updatedAt
}
)


categoria.associate = (models) => {

    categoria.hasMany(models.tbl_Menu, {});


    return categoria;
};


// Hook para agregar datos iniciales después de sincronizar
categoria.afterSync(async () => {
    const categoriasIniciales = [
        { descripcion: "Entradas" },
        { descripcion: "Plato Fuerte" },
        { descripcion: "Postres" },
        { descripcion: "Licores" },
        { descripcion: "Bebidas" },
        { descripcion: "Infantil" },


    ];

    //findOrCreate: Intenta encontrar una fila con la descripción especificada. Si no la encuentra, la crea.

    for (const cat of categoriasIniciales) {
        await categoria.findOrCreate({ where: { descripcion: cat.descripcion } });
    }
});

