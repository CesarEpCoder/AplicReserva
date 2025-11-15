const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  dia: {
    type: String,
    enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    required: true
  },
  horaInicio: {
    type: String,
    required: true
  },
  horaFin: {
    type: String,
    required: true
  }
});

const canchaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  imagenUrl: {
    type: String,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  horarios: [horarioSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cancha', canchaSchema);