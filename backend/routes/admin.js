const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rutas SIN middlewares temporalmente
router.post('/create', adminController.crearAdmin);
router.get('/list', adminController.listarAdmins);
router.delete('/delete/:id', adminController.eliminarAdmin);

module.exports = router;