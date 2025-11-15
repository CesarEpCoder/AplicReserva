const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'canchas',
    format: async (req, file) => 'png',
    public_id: (req, file) => `cancha_${Date.now()}`
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    // Verificar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

const uploadMiddleware = upload.single('imagen');

// Middleware con debug integrado
const uploadWithDebug = (req, res, next) => {
  console.log('🔍 === UPLOAD MIDDLEWARE INICIADO ===');
  console.log('🔍 Headers:', req.headers);
  console.log('🔍 Content-Type:', req.headers['content-type']);
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('❌ ERROR en upload middleware:', err.message);
      return res.status(400).json({
        message: 'Error al subir la imagen',
        error: err.message
      });
    }
    
    console.log('🔍 === UPLOAD COMPLETADO ===');
    console.log('🔍 Archivo subido:', req.file);
    console.log('🔍 Body recibido:', req.body);
    
    next();
  });
};

console.log('☁️ Cloudinary Config Check:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret length:', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 'undefined');

module.exports = uploadWithDebug; // ← SOLO UNA EXPORTACIÓN