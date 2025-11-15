const Reserva = require('../models/Reserva');
const Cancha = require('../models/Cancha');

const crearReservaTemporal = async (req, res) => {
  try {
    const { canchaId, fecha, hora } = req.body;

    // Verificar disponibilidad
    const reservaExistente = await Reserva.findOne({
      canchaId,
      fecha: new Date(fecha),
      hora,
      estado: 'confirmada'
    });

    if (reservaExistente) {
      return res.status(400).json({ message: 'El horario no está disponible' });
    }

    // Crear reserva temporal
    const reserva = await Reserva.create({
      usuarioId: req.user.id,
      canchaId,
      fecha: new Date(fecha),
      hora,
      estado: 'pendiente'
    });

    // Simular pago con Mercado Pago (simplificado)
    const pagoSimulado = {
      id: `pago_${Date.now()}`,
      status: 'approved',
      init_point: `/user/pago-simulado.html?reservaId=${reserva._id}`
    };

    res.json({
      message: 'Reserva creada, proceder al pago',
      reservaId: reserva._id,
      pago: pagoSimulado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creando reserva', error: error.message });
  }
};

const confirmarPago = async (req, res) => {
  try {
    const { reservaId } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (reserva.usuarioId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para confirmar esta reserva' });
    }

    reserva.estado = 'confirmada';
    reserva.pagoId = `pago_confirmado_${Date.now()}`;
    await reserva.save();

    res.json({
      message: 'Pago confirmado y reserva activada',
      reserva
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirmando pago', error: error.message });
  }
};

const verMisReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find({ usuarioId: req.user.id })
      .populate('canchaId', 'nombre descripcion imagenUrl')
      .sort({ fecha: -1 });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo reservas', error: error.message });
  }
};

// NUEVAS FUNCIONES PARA ADMIN
const getReservasAdmin = async (req, res) => {
  try {
    console.log('🔍 Obteniendo reservas para admin...');
    
    const { canchaId, fecha, estado } = req.query;
    
    let filtro = {};
    
    // Filtrar por cancha si se especifica
    if (canchaId) {
      filtro.canchaId = canchaId;
    }
    
    // Filtrar por fecha si se especifica
    if (fecha) {
      filtro.fecha = new Date(fecha);
    }
    
    // Filtrar por estado si se especifica
    if (estado) {
      filtro.estado = estado;
    }

    console.log('📋 Filtros aplicados:', filtro);

    const reservas = await Reserva.find(filtro)
      .populate('usuarioId', 'nombre email')
      .populate('canchaId', 'nombre imagenUrl')
      .sort({ fecha: -1, hora: -1 });

    console.log(`✅ ${reservas.length} reservas encontradas`);

    res.json(reservas);
  } catch (error) {
    console.error('❌ Error obteniendo reservas admin:', error);
    res.status(500).json({ 
      message: 'Error obteniendo reservas',
      error: error.message 
    });
  }
};

const confirmarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(
      req.params.id,
      { estado: 'confirmada' },
      { new: true }
    ).populate('usuarioId', 'nombre email')
     .populate('canchaId', 'nombre');

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ 
      message: 'Reserva confirmada exitosamente',
      reserva 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error confirmando reserva',
      error: error.message 
    });
  }
};

const rechazarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(
      req.params.id,
      { estado: 'rechazada' },
      { new: true }
    ).populate('usuarioId', 'nombre email')
     .populate('canchaId', 'nombre');

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ 
      message: 'Reserva rechazada exitosamente',
      reserva 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error rechazando reserva',
      error: error.message 
    });
  }
};

const cancelarReservaAdmin = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelada' },
      { new: true }
    ).populate('usuarioId', 'nombre email')
     .populate('canchaId', 'nombre');

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ 
      message: 'Reserva cancelada exitosamente',
      reserva 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error cancelando reserva',
      error: error.message 
    });
  }
};

module.exports = {
  crearReservaTemporal,
  confirmarPago,
  verMisReservas,
  getReservasAdmin,
  confirmarReserva,
  rechazarReserva,
  cancelarReservaAdmin
};