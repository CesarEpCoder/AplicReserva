const User = require('../models/User');

const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Crear admin
    const admin = await User.create({
      nombre,
      email,
      password,
      rol: 'admin'
    });

    res.status(201).json({
      message: 'Admin creado exitosamente',
      admin: {
        id: admin._id,
        nombre: admin.nombre,
        email: admin.email,
        rol: admin.rol
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creando admin', error: error.message });
  }
};

const listarAdmins = async (req, res) => {
  try {
    const admins = await User.find({ rol: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error listando admins', error: error.message });
  }
};

const eliminarAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    
    if (!admin || admin.rol !== 'admin') {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando admin', error: error.message });
  }
};

module.exports = { crearAdmin, listarAdmins, eliminarAdmin };