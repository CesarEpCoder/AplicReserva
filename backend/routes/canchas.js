const express = require('express');
const {
  crearCancha,
  listarMisCanchas,
  listarTodasCanchas,
  editarCancha,
  eliminarCancha,
  actualizarHorarios,
  verDisponibilidad
} = require('../controllers/canchaController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin, isUser } = require('../middleware/roleMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const router = express.Router();

// Rutas Admin
router.post('/create', authMiddleware, isAdmin, uploadMiddleware, crearCancha);
router.get('/mis-canchas', authMiddleware, isAdmin, listarMisCanchas);
router.put('/edit/:id', authMiddleware, isAdmin, uploadMiddleware, editarCancha);
router.delete('/delete/:id', authMiddleware, isAdmin, eliminarCancha);
router.put('/:id/horarios', authMiddleware, isAdmin, actualizarHorarios);

// Rutas Usuario
router.get('/todas', listarTodasCanchas);
router.get('/:id/disponibilidad', authMiddleware, isUser, verDisponibilidad);

module.exports = router;