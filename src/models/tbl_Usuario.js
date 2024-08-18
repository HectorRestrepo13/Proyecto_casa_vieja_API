import { DataTypes } from "sequelize";
import sequelize from "./conexion.js";


/**
 * Modelo de la tabla Usuario.
 * 
 * Representa un usuario con detalles como identificación, nombre, teléfono, correo electrónico, contraseña, rol y estado. 
 * Este modelo define la estructura de la tabla Usuario en la base de datos.
 * 
 * @typedef {Object} Usuario
 * @property {number} id - Identificador único del usuario. Es autoincrementable y la clave primaria.
 * @property {number} cedula - Identificación del usuario (por ejemplo, número de cédula o DNI).
 * @property {string} nombreCompleto - Nombre completo del usuario.
 * @property {string} [telefono] - Teléfono opcional del usuario.
 * @property {string} correo - Correo electrónico del usuario.
 * @property {string} password - Contraseña del usuario en formato encriptado.
 * @property {number} RolId - Identificador del rol del usuario.
 * @property {boolean} estado - Estado del usuario (activo o inactivo). Por defecto es 1 (activo).
 */
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
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1 //Valor por defecto 1 (activo)
    }
  },
  {
    timestamps: false, // Desactiva las columnas createdAt y updatedAt
  }
);


/**
* Define las asociaciones del modelo Usuario.
* 
* El modelo Usuario tiene las siguientes asociaciones:
* - Pertenece a un Rol a través del campo `RolId`.
* - Tiene muchos Pedidos.
* 
* @param {Object} models - Los modelos de Sequelize que se utilizarán para definir las asociaciones.
* @returns {Object} - El modelo Usuario con las asociaciones definidas.
*/
tbl_usuario.associate = (models) => {
  tbl_usuario.belongsTo(models.tbl_Rol, {
    foreignKey: {
      allowNull: false,
    },
  });

  tbl_usuario.hasMany(models.tbl_Pedido, {});

  return tbl_usuario;
};
