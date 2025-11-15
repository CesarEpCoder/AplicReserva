const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // ← AGREGAR ESTO
const connectDB = require('./config/database');
const User = require('./models/User'); // ← MOVER ARRIBA
require('dotenv').config();

// DEBUG: Verificar variables de entorno
console.log('🔍 Variables de entorno:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Existe' : '❌ No existe');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Existe' : '❌ No existe');

const app = express();

// Conectar a MongoDB con manejo de errores
try {
  connectDB();
} catch (error) {
  console.log('❌ Error al conectar MongoDB:', error.message);
}

// 🔥 AGREGAR ESTA FUNCIÓN PARA CREAR SUPERADMIN
const crearSuperAdminPorDefecto = async () => {
  try {
    console.log('🔍 Buscando superadmin existente...');
    const adminExistente = await User.findOne({ email: 'super@admin.com' }); // ← CAMBIAR AQUÍ
    
    if (!adminExistente) {
      const superAdmin = new User({
        nombre: 'Super Administrador',
        email: 'super@admin.com', // ← Y AQUÍ
        password: '123456', // ← Y AQUÍ
        rol: 'superadmin'
      });
      
      await superAdmin.save(); // Esto SÍ ejecuta el pre-save hook
      
      console.log('🎉 SUPERADMIN CREADO POR DEFECTO');
      console.log('📧 Email: superadmin@futbol.com');
      console.log('🔑 Password: SuperAdmin123!');
      console.log('👤 Rol: superadmin');
      
      // Verificar que el password se hasheó
      const usuarioVerificado = await User.findOne({ email: 'superadmin@futbol.com' });
      console.log('🔐 Password hasheado:', usuarioVerificado.password !== 'SuperAdmin123!');
    } else {
      console.log('✅ Superadmin ya existe en la base de datos');
      
      // Si existe pero no puedes loguear, prueba resetear el password
      console.log('🔑 Para resetear password, elimina el usuario de la BD y reinicia el servidor');
    }
  } catch (error) {
    console.error('❌ Error creando superadmin:', error);
  }
};

// 🔥 LLAMAR LA FUNCIÓN DESPUÉS DE CONECTAR A MONGODB
// Usamos setTimeout para esperar que MongoDB se conecte
setTimeout(() => {
  crearSuperAdminPorDefecto();
}, 2000);

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/canchas', require('./routes/canchas'));
app.use('/api/reservas', require('./routes/reservas'));

app.get('/', (req, res) => {
  res.json({ message: 'API Gestor Reservas funcionando' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API funciona!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});