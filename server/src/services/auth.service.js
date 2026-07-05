const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const config = require('../config');
const AppError = require('../utils/AppError');

async function register({ nombre, email, password, rol, telefono }) {
  const exists = await db.query('SELECT id FROM usuarios WHERE email = $1', [email]);
  if (exists.rows.length) throw new AppError('El email ya está registrado.', 409);

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol, telefono)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre, email, hash, rol, telefono || null]
  );

  const token = jwt.sign({ id: rows[0].id, rol: rows[0].rol }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return { user: rows[0], token };
}

async function login(email, password) {
  const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  if (!rows.length) throw new AppError('Credenciales inválidas.', 401);

  const user = rows[0];
  if (!user.activo) throw new AppError('Cuenta desactivada.', 401);

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new AppError('Credenciales inválidas.', 401);

  await db.query('UPDATE usuarios SET last_login_at = NOW() WHERE id = $1', [user.id]);

  const token = jwt.sign({ id: user.id, rol: user.rol }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return { user, token };
}

async function getProfile(userId) {
  const { rows } = await db.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
  if (!rows.length) throw new AppError('Usuario no encontrado.', 404);
  return rows[0];
}

async function updateProfile(userId, data) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }

  if (!fields.length) throw new AppError('No hay datos para actualizar.', 400);

  values.push(userId);
  const { rows } = await db.query(
    `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0];
}

module.exports = { register, login, getProfile, updateProfile };
