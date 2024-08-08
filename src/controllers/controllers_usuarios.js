import { tbl_usuario } from "../models/tbl_Usuario.js";
import { tbl_Rol } from "../models/tbl_Rol.js";
import bcrypt from "bcrypt";

//Crear usuario
export const crearUsuario = async (req, res) => {
  const { cedula, nombreCompleto, telefono, correo, password, rol } = req.body;

  if (!cedula || !nombreCompleto || !telefono || !correo || !password || !rol) {
    return res.status(400).json({
      status: "error",
      message: `Tienes que completar todos los campos.${rol}`,
    });
  }
  // Verificar si el correo electrónico o la identificación ya existen en la base de datos
  const correoExistente = await tbl_usuario.findOne({ where: { correo } });
  const identificacionExistente = await tbl_usuario.findOne({
    where: { cedula },
  });

  //Decisiones de usuario existente
  if (correoExistente) {
    return res.status(400).json({
      status: "error",
      message: "El correo proporcionado ya existe en la base de datos",
    });
  }
  if (identificacionExistente) {
    return res.status(400).json({
      status: "error",
      message: "La identificacion proporcionada ya existe en la base de datos",
    });
  }
  // Verificar que el rol exista
  const rolExistente = await tbl_Rol.findByPk(rol);
  if (!rolExistente) {
    return res.status(400).json({
      status: "error",
      message: "El rol proporcionado no encontrado",
    });
  }
  try {
    // Encriptar la contraseña con una sal única
    const hashedPassword = bcrypt.hashSync(password, 10);
    const creaNuevo = await tbl_usuario.create({
      cedula,
      nombreCompleto,
      telefono,
      correo,
      password: hashedPassword,
      RolId: rol,
    });

    res.status(200).json({
      status: "success",
      message: "Se creo el usuario correctamente",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error del servidor al insertar el usuario",
      error: error.message,
    });
  }
};

// Editar usuario
export const EditarUsuario = async (req, res) => {
  const { nombreCompleto, telefono, correo, password, rolId } = req.body;
  const { identificacion } = req.params;

  if (
    !nombreCompleto ||
    !telefono ||
    !correo ||
    !password ||
    !rolId ||
    !identificacion
  ) {
    return res.status(400).json({
      status: "error",
      message: "Debes ingresar todos los datos",
    });
  }

  try {
    // Verificar si el usuario existe
    const usuarioExistente = await tbl_usuario.findOne({
      where: { cedula: identificacion },
    });
    if (!usuarioExistente) {
      return res.status(404).json({
        status: "error",
        message: "La identificación proporcionada no existe",
      });
    }

    // Encriptar la contraseña con una sal única
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Actualizar el usuario
    await tbl_usuario.update(
      {
        nombreCompleto,
        telefono,
        correo,
        password: hashedPassword,
        rolId: rolId, // Asegúrate de que el nombre de la columna coincida
      },
      {
        where: { cedula: identificacion }, // Asegúrate de que la columna de búsqueda sea correcta
      }
    );

    res.status(200).json({
      status: "success",
      message: "Se editó el usuario con éxito",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Cambiar estado del usuario
export const CambiarEstadoUsuario = async (req, res) => {
  const { identificacion } = req.params;
  const { estado } = req.body; // El estado debe ser 1 (activo) o 0 (inactivo)

  if (!identificacion || (estado !== 0 && estado !== 1)) {
    return res.status(400).json({
      status: "error",
      message:
        "Debes proporcionar una identificación y un estado válido (0 o 1)",
    });
  }

  try {
    // Buscar el usuario por identificación
    const usuarioExistente = await tbl_usuario.findOne({
      where: { cedula: identificacion },
    });

    if (!usuarioExistente) {
      return res.status(404).json({
        status: "error",
        message: "La identificación proporcionada no existe",
      });
    }

    // Actualizar el estado del usuario
    await tbl_usuario.update(
      { estado }, // Asegúrate de que tu modelo tenga un campo `estado`
      { where: { cedula: identificacion } }
    );

    res.status(200).json({
      status: "success",
      message: "Estado del usuario actualizado con éxito",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};


//Traer todos los usuarios
export const TraerTodosUsuarios = async (req, res)=>{
   
try {
    const traerTodos = await tbl_usuario.findAll();
    if(traerTodos.length>0){
        res.status(200).json({
            status:"success",
            message:traerTodos
        });
    }else{
        res.status(400).json({
            status:"error",
            message:"No se encuentran usuarios en la base de datos"
        });
    };
} catch (error) {
    res.status(500).json({
        status:"error",
        message:"error del servidor",
        error:error.message
    });
}
};


// Traer usuario por ID
export const TraerUsuarioId = async (req, res) => {
    const { identificacion } = req.params;
  
    if (!identificacion) {
      return res.status(400).json({
        status: "error",
        message: "Debes proporcionar una identificación",
      });
    }
  
    try {
      // Buscar el usuario por identificación
      const usuario = await tbl_usuario.findOne({ where: { cedula: identificacion } });
  
      if (!usuario) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        });
      }
  
      res.status(200).json({
        status: "success",
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error en el servidor",
        error: error.message,
      });
    }
  };