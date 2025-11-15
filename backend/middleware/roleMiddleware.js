const isSuperAdmin = (req, res, next) => {
  if (req.user.rol !== 'superadmin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol superadmin' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.rol !== 'superadmin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol admin' });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.rol !== 'user') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol user' });
  }
  next();
};

module.exports = { isSuperAdmin, isAdmin, isUser };