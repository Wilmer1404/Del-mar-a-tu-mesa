const AppError = require('../utils/AppError');

module.exports = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    for (const rule of rules) {
      const error = rule(value, field);
      if (error) {
        errors.push(error);
        break;
      }
    }
  }

  if (errors.length) {
    throw new AppError(errors.join('. '), 400);
  }
  next();
};

module.exports.rules = {
  required: (msg) => (v, f) => (!v || (typeof v === 'string' && !v.trim())) ? (msg || `${f} es requerido`) : null,
  isString: (msg) => (v, f) => (v !== undefined && typeof v !== 'string') ? (msg || `${f} debe ser texto`) : null,
  isNumber: (msg) => (v, f) => (v !== undefined && isNaN(Number(v))) ? (msg || `${f} debe ser un número`) : null,
  min: (min, msg) => (v, f) => (v !== undefined && Number(v) < min) ? (msg || `${f} debe ser mayor o igual a ${min}`) : null,
  max: (max, msg) => (v, f) => (v !== undefined && Number(v) > max) ? (msg || `${f} debe ser menor o igual a ${max}`) : null,
  isIn: (values, msg) => (v, f) => (v && !values.includes(v)) ? (msg || `${f} debe ser uno de: ${values.join(', ')}`) : null,
  isEmail: (msg) => (v, f) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ? (msg || `${f} debe ser un email válido`) : null,
  minLength: (min, msg) => (v, f) => (v && v.length < min) ? (msg || `${f} debe tener al menos ${min} caracteres`) : null,
};
