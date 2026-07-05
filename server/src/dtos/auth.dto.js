const { rules } = require('../middlewares/validate');

const registerSchema = {
  nombre:   [rules.required('El nombre es requerido'), rules.isString()],
  email:    [rules.required('El email es requerido'), rules.isEmail('Email inválido')],
  password: [rules.required('La contraseña es requerida'), rules.minLength(6, 'La contraseña debe tener al menos 6 caracteres')],
  rol:      [rules.required('El rol es requerido'), rules.isIn(['pescador', 'comprador'])],
  telefono: [rules.isString()],
};

const loginSchema = {
  email:    [rules.required('El email es requerido'), rules.isEmail()],
  password: [rules.required('La contraseña es requerida')],
};

const updateProfileSchema = {
  nombre:     [rules.isString()],
  apellido:   [rules.isString()],
  telefono:   [rules.isString()],
  caleta_principal: [rules.isString()],
  embarcacion:      [rules.isString()],
  licencia_produce: [rules.isString()],
  metodo_pago:      [rules.isString()],
  empresa:          [rules.isString()],
};

const usuarioResponse = (user) => ({
  id: user.id,
  nombre: user.nombre,
  apellido: user.apellido,
  email: user.email,
  telefono: user.telefono,
  rol: user.rol,
  avatar_url: user.avatar_url,
  caleta_principal: user.caleta_principal,
  embarcacion: user.embarcacion,
  licencia_produce: user.licencia_produce,
  metodo_pago: user.metodo_pago,
  empresa: user.empresa,
  created_at: user.created_at,
});

module.exports = {
  registerSchema, loginSchema, updateProfileSchema, usuarioResponse,
};
