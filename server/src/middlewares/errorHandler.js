const AppError = require('../utils/AppError');

module.exports = (err, req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'El recurso ya existe (valor duplicado).',
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: 'Referencia inválida: el recurso relacionado no existe.',
    });
  }

  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor.',
  });
};
