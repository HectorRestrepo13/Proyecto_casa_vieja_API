import { tbl_usuario } from "../models/tbl_Usuario.js";
import { tbl_Rol } from "../models/tbl_Rol.js";
import bcrypt from "bcrypt";

/**
 * Crear un nuevo usuario.
 *
 * Este endpoint permite crear un nuevo usuario en la base de datos. Valida los datos proporcionados, verifica si el correo electrónico y la identificación ya existen, y comprueba si el rol proporcionado es válido. Si todo está correcto, se encripta la contraseña y se crea el nuevo usuario.
 *
 * @async
 * @function crearUsuario
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {string} req.body.cedula - La cédula del usuario, que debe ser única.
 * @param {string} req.body.nombreCompleto - El nombre completo del usuario.
 * @param {string} req.body.telefono - El número de teléfono del usuario.
 * @param {string} req.body.correo - El correo electrónico del usuario, que debe ser único.
 * @param {string} req.body.password - La contraseña del usuario, que se encriptará antes de almacenarse.
 * @param {number} req.body.rol - El ID del rol del usuario, que debe existir en la base de datos.
 * @returns {JSON} Devuelve un objeto JSON con el estado de la operación. Si el usuario se crea correctamente, devuelve un mensaje de éxito. Si hay errores, devuelve mensajes de error específicos.
 */
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

/**
 * Editar un usuario existente.
 *
 * Este endpoint permite actualizar los detalles de un usuario en la base de datos. Valida los datos proporcionados, verifica si el usuario con la identificación dada existe, encripta la nueva contraseña y actualiza el usuario en la base de datos.
 *
 * @async
 * @function EditarUsuario
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {string} req.params.identificacion - La cédula del usuario a editar.
 * @param {string} req.body.nombreCompleto - El nuevo nombre completo del usuario.
 * @param {string} req.body.telefono - El nuevo número de teléfono del usuario.
 * @param {string} req.body.correo - El nuevo correo electrónico del usuario.
 * @param {string} req.body.password - La nueva contraseña del usuario, que se encriptará antes de almacenarse.
 * @param {number} req.body.rolId - El nuevo ID del rol del usuario, que debe existir en la base de datos.
 * @returns {JSON} Devuelve un objeto JSON con el estado de la operación. Si el usuario se edita correctamente, devuelve un mensaje de éxito. Si hay errores, devuelve mensajes de error específicos.
 */
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

/**
 * Cambia el estado de un usuario.
 *
 * Este endpoint permite actualizar el estado de un usuario en la base de datos. El estado debe ser 1 (activo) o 0 (inactivo). La función valida la identificación del usuario y el estado proporcionado, busca al usuario en la base de datos y actualiza su estado.
 *
 * @async
 * @function CambiarEstadoUsuario
 * @param {Object} req - Objeto de solicitud (Request) de Express.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @param {string} req.params.identificacion - La cédula del usuario cuyo estado se desea cambiar.
 * @param {number} req.body.estado - El nuevo estado del usuario, debe ser 1 (activo) o 0 (inactivo).
 * @returns {JSON} Devuelve un objeto JSON con el estado de la operación. Si el estado se actualiza correctamente, devuelve un mensaje de éxito. Si hay errores, devuelve mensajes de error específicos.
 */
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


/**
 * Obtiene todos los usuarios de la base de datos.
 *
 * Este endpoint permite recuperar una lista de todos los usuarios registrados en la base de datos. La función maneja la recuperación de datos y responde con la lista de usuarios o con un mensaje de error si no se encuentran usuarios o si ocurre un problema en el servidor.
 *
 * @async
 * @function TraerTodosUsuarios
 * @param {Object} req - Objeto de solicitud (Request) de Express. No se requieren parámetros específicos en la solicitud.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON con el estado de la operación y los datos de los usuarios si se encuentran, o un mensaje de error si no hay usuarios o ocurre un problema.
 * @throws {Object} Devuelve un objeto JSON con un mensaje de error en caso de fallo en la recuperación de datos.
 */
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


/**
 * Obtiene un usuario específico por su identificación.
 *
 * Este endpoint permite recuperar la información de un usuario registrado en la base de datos utilizando su identificación. La función maneja la búsqueda del usuario y responde con los datos del usuario si se encuentra, o con un mensaje de error si no se encuentra el usuario o si ocurre un problema en el servidor.
 *
 * @async
 * @function TraerUsuarioId
 * @param {Object} req - Objeto de solicitud (Request) de Express. Debe contener un parámetro en `req.params` con la identificación del usuario.
 * @param {Object} res - Objeto de respuesta (Response) de Express.
 * @returns {JSON} Devuelve un objeto JSON con el estado de la operación y los datos del usuario si se encuentra, o un mensaje de error si el usuario no se encuentra o ocurre un problema.
 * @throws {Object} Devuelve un objeto JSON con un mensaje de error en caso de que la identificación no se proporcione o de un fallo en la búsqueda del usuario.
 */
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