import { DataTypes } from "sequelize";

import sequelize from "./conexion.js";

export const tbl_usuario = sequelize.define(
    "Usuario",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      cedula: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nombreCompleto: {
        type: DataTypes.STRING(85),
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      correo: {
        type: DataTypes.STRING(85),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(85),
        allowNull: false,
      },
      RolId: { // Definición del campo RolId
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:1 //Valor por defecto 1 (activo)
    }
    },
    {
      timestamps: false, // Desactiva las columnas createdAt y updatedAt
    }
  );

tbl_usuario.associate = (models) => {
  tbl_usuario.belongsTo(models.tbl_Rol, {
    foreignKey: {
      allowNull: false,
    },
  });

  tbl_usuario.hasMany(models.tbl_Mesa, {});

  return tbl_usuario;
};
