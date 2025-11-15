const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Conectando a MongoDB...');
    console.log('📝 URI:', process.env.MONGODB_URI ? '✅ Existe' : '❌ No existe');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ ERROR MongoDB:', error.message);
    console.log('💡 URI usada:', process.env.MONGODB_URI);
    process.exit(1);
  }
};

module.exports = connectDB;