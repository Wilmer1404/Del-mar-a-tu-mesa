const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/AppError');
const db = require('../db/connection');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Token de acceso requerido.', 401);
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const { rows } = await db.query(
      'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = $1',
      [decoded.id]
    );

    if (!rows.length || !rows[0].activo) {
      throw new AppError('Usuario no encontrado o desactivado.', 401);
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Token inválido o expirado.', 401);
  }
};

module.exports.optional = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  try {
    await module.exports(req, res, next);
  } catch {
    req.user = null;
    next();
  }
};

module.exports.requireRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.rol)) {
    throw new AppError('No tienes permisos para esta acción.', 403);
  }
  next();
};
