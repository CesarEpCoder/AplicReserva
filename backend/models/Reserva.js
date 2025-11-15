const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  canchaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cancha',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  },
  pagoId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

reservaSchema.index({ canchaId: 1, fecha: 1, hora: 1 }, { unique: true });

module.exports = mongoose.model('Reserva', reservaSchema);