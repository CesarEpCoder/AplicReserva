const Cancha = require('../models/Cancha');
const Reserva = require('../models/Reserva');

const crearCancha = async (req, res) => {
  try {
    console.log('🔍 INICIANDO crearCancha...');
    console.log('📝 Body:', req.body);
    console.log('🖼️ File:', req.file);
    console.log('👤 User:', req.user);

    const { nombre, descripcion, horarios } = req.body;
    
    if (!req.file) {
      console.log('❌ No hay archivo');
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    console.log('📋 Horarios recibidos (raw):', horarios);
    console.log('📋 Tipo de horarios:', typeof horarios);

    // PARSEAR los horarios de string JSON a objeto
    let horariosParsed;
    try {
      horariosParsed = JSON.parse(horarios);
      console.log('📋 Horarios parseados:', horariosParsed);
    } catch (parseError) {
      console.error('❌ Error parseando horarios:', parseError);
      return res.status(400).json({ message: 'Formato de horarios inválido' });
    }

    const cancha = await Cancha.create({
      nombre,
      descripcion,
      imagenUrl: req.file.path,
      adminId: req.user.id,
      horarios: horariosParsed  // Usar los horarios parseados
    });

    console.log('✅ Cancha creada:', cancha);

    res.status(201).json({
      message: 'Cancha creada exitosamente',
      cancha
    });
  } catch (error) {
    console.error('❌ ERROR en crearCancha:', error);
    res.status(500).json({ 
      message: 'Error creando cancha', 
      error: error.message,
      stack: error.stack // Para más detalles
    });
  }
};

const listarMisCanchas = async (req, res) => {
  try {
    const canchas = await Cancha.find({ adminId: req.user.id });
    res.json(canchas);
  } catch (error) {
    res.status(500).json({ message: 'Error listando canchas', error: error.message });
  }
};

const listarTodasCanchas = async (req, res) => {
  try {
    const canchas = await Cancha.find().populate('adminId', 'nombre email');
    res.json(canchas);
  } catch (error) {
    res.status(500).json({ message: 'Error listando canchas', error: error.message });
  }
};

const editarCancha = async (req, res) => {
  try {
    console.log('🔍 INICIANDO editarCancha...');
    console.log('📝 ID:', req.params.id);
    console.log('📝 Body:', req.body);
    console.log('🖼️ File:', req.file);
    console.log('👤 User:', req.user);

    const cancha = await Cancha.findById(req.params.id);
    
    if (!cancha) {
      console.log('❌ Cancha no encontrada');
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    if (cancha.adminId.toString() !== req.user.id) {
      console.log('❌ Sin permisos');
      return res.status(403).json({ message: 'No tienes permiso para editar esta cancha' });
    }

    const { nombre, descripcion, horarios } = req.body;
    
    // Parsear horarios si vienen como string
    let horariosParsed = horarios;
    if (typeof horarios === 'string') {
      try {
        horariosParsed = JSON.parse(horarios);
        console.log('📋 Horarios parseados:', horariosParsed);
      } catch (error) {
        console.error('❌ Error parseando horarios:', error);
        return res.status(400).json({ message: 'Formato de horarios inválido' });
      }
    }

    const datosActualizados = { 
      nombre, 
      descripcion, 
      horarios: horariosParsed 
    };
    
    if (req.file) {
      datosActualizados.imagenUrl = req.file.path;
      console.log('🖼️ Nueva imagen:', req.file.path);
    }

    console.log('📝 Datos actualizados:', datosActualizados);

    const canchaActualizada = await Cancha.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true, runValidators: true }
    );

    console.log('✅ Cancha actualizada:', canchaActualizada);

    res.json({
      message: 'Cancha actualizada exitosamente',
      cancha: canchaActualizada
    });
  } catch (error) {
    console.error('❌ ERROR en editarCancha:', error);
    res.status(500).json({ 
      message: 'Error editando cancha', 
      error: error.message 
    });
  }
};

const eliminarCancha = async (req, res) => {
  try {
    const cancha = await Cancha.findById(req.params.id);
    
    if (!cancha) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    if (cancha.adminId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta cancha' });
    }

    await Cancha.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cancha eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando cancha', error: error.message });
  }
};

const actualizarHorarios = async (req, res) => {
  try {
    const { horarios } = req.body;
    const cancha = await Cancha.findById(req.params.id);
    
    if (!cancha) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    if (cancha.adminId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta cancha' });
    }

    cancha.horarios = horarios;
    await cancha.save();

    res.json({
      message: 'Horarios actualizados exitosamente',
      cancha
    });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando horarios', error: error.message });
  }
};

const verDisponibilidad = async (req, res) => {
  try {
    const { fecha } = req.query;
    const cancha = await Cancha.findById(req.params.id);
    
    if (!cancha) {
      return res.status(404).json({ message: 'Cancha no encontrada' });
    }

    // Obtener reservas confirmadas para esa fecha
    const reservas = await Reserva.find({
      canchaId: req.params.id,
      fecha: new Date(fecha),
      estado: 'confirmada'
    });

    const horasOcupadas = reservas.map(r => r.hora);
    const horariosDisponibles = cancha.horarios.filter(horario => 
      !horasOcupadas.includes(horario.horaInicio)
    );

    res.json(horariosDisponibles);
  } catch (error) {
    res.status(500).json({ message: 'Error consultando disponibilidad', error: error.message });
  }
};

module.exports = {
  crearCancha,
  listarMisCanchas,
  listarTodasCanchas,
  editarCancha,
  eliminarCancha,
  actualizarHorarios,
  verDisponibilidad
};