import { tbl_Eventos } from "../models/tbl_Eventos.js";

//Creamos el evento
export const crearEvento = async (req, res) => {
    const {
        nombreEvento,
        nombrePersona,
        cantidadPersonas,
        abono,
        fecha,
        descripcion,
        nombreReservante,
        telefonoReservante,
        emailReservante
    } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!nombreEvento || !nombrePersona || !cantidadPersonas || !abono || !fecha || !nombreReservante || !telefonoReservante) {
        return res.status(400).json({
            status: "error",
            message: "Debe de ingresar todos los campos obligatorios correctamente"
        });
    }

    try {
        // Crear un nuevo evento en la base de datos
        const nuevoEvento = await tbl_Eventos.create({
            nombreEvento,
            nombrePersona,
            cantidadPersonas,
            abono,
            fecha,
            descripcion, // este campo es opcional
            nombreReservante,
            telefonoReservante,
            emailReservante // este campo es opcional
        });

        // Responder con éxito y enviar el evento creado
        res.status(201).json({
            status: "success",
            message: "Evento creado exitosamente",
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({
            status: "error",
            message: "Hubo un problema al crear el evento",
            error: error.message
        });
    }
}


// Editamos el evento
export const editarEvento = async (req, res) => {
    const { id } = req.params;
    const { nombreEvento, nombrePersona, cantidadPersonas, abono, fecha, descripcion, nombreReservante, telefonoReservante, emailReservante } = req.body;

    if (!id || !nombreEvento || !nombrePersona || !cantidadPersonas || !abono || !fecha || !descripcion || !nombreReservante || !telefonoReservante || !emailReservante) {
        return res.status(400).json({
            status: "error",
            message: "Debe de ingresar todos los campos correctamente"
        });
    }

    try {
        const evento = await tbl_Eventos.findByPk(id);
        
        if (!evento) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        evento.nombreEvento = nombreEvento;
        evento.nombrePersona = nombrePersona;
        evento.cantidadPersonas = cantidadPersonas;
        evento.abono = abono;
        evento.fecha = fecha;
        evento.descripcion = descripcion;
        evento.nombreReservante = nombreReservante;
        evento.telefonoReservante = telefonoReservante;
        evento.emailReservante = emailReservante;

        await evento.save();

        res.status(200).json({
            status: "success",
            message: "Evento actualizado correctamente",
        
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Hubo un error al actualizar el evento",
            error: error.message
        });
    }
};


//Cambiamos el estado del evento

export const cambiarEstadoEvento = async (req, res)=>{
    const {estado}=req.body;
    const {id}=req.params;

    if(!id || (estado !==0 && estado !==1)){
        res.status(400).json({
            status:"error",
            message:"Debes de ingresar todos los datos"
        });
    }
    try {
        const eventoExistente =await tbl_Eventos.findOne({
            where:{
                id:id
            }
        })
        if(!eventoExistente){
            res.status(400).json({
                status:"error",
                message:"El evento no existe"
            });
        }
        await tbl_Eventos.update(
            {estado}, 
        {where:{
            id:id
        }})
        res.status(200).json({
            status:"success",
            message:"Estado cambiado con exito"
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message:"Error en el servidor",
            error:error.message
        });  
    }
}


//Traer evento
export const traerTodosEventos = async (req, res)=>{
    try {
        const traerTodo= await tbl_Eventos.findAll();
        res.status(200).json({
            status:"success",
            message:"datos traidos con exito",
            data:traerTodo
        });
    } catch (error) {
        res.status(500).json({
            status:"error",
            message:"Error del servidor",
          error:error.message
        }); 
    }
}

// Traer evento por id
export const traerEventoId = async (req, res) => {
    const { id } = req.params;

    // Verifica si se proporcionó un ID
    if (!id) {
        return res.status(400).json({
            status: "error",
            message: "Debes ingresar un ID válido.",
        });
    }

    try {
        // Busca el evento en la base de datos por su ID
        const eventoExistente = await tbl_Eventos.findOne({ where: { id } });

        // Verifica si el evento existe
        if (!eventoExistente) {
            return res.status(404).json({
                status: "error",
                message: "No hay eventos con ese ID.",
            });
        }

        // Devuelve el evento encontrado
        return res.status(200).json({
            status: "success",
            data: eventoExistente,
        });
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al buscar el evento.",
            error: error.message,
        });
    }
};
