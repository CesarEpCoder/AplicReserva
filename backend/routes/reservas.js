const express = require('express');
const {
  crearReservaTemporal,
  confirmarPago,
  verMisReservas,
  getReservasAdmin,
  confirmarReserva,
  rechazarReserva,
  cancelarReservaAdmin
} = require('../controllers/reservaController');
const authMiddleware = require('../middleware/authMiddleware');
const { isUser, isAdmin } = require('../middleware/roleMiddleware');
const router = express.Router();

// Rutas Usuario
router.post('/crear-temporal', authMiddleware, isUser, crearReservaTemporal);
router.post('/confirmar-pago', authMiddleware, isUser, confirmarPago);
router.get('/mis-reservas', authMiddleware, isUser, verMisReservas);

// Rutas Admin
router.get('/admin', authMiddleware, isAdmin, getReservasAdmin);
router.put('/:id/confirmar', authMiddleware, isAdmin, confirmarReserva);
router.put('/:id/rechazar', authMiddleware, isAdmin, rechazarReserva);
router.put('/:id/cancelar-admin', authMiddleware, isAdmin, cancelarReservaAdmin);

module.exports = router;