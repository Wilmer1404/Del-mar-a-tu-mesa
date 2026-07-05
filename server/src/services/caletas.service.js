const db = require('../db/connection');
const AppError = require('../utils/AppError');

async function list() {
  const { rows } = await db.query('SELECT * FROM caletas ORDER BY nombre');
  return rows;
}

async function getById(id) {
  const { rows } = await db.query('SELECT * FROM caletas WHERE id = $1', [id]);
  if (!rows.length) throw new AppError('Caleta no encontrada.', 404);

  const { rows: precios } = await db.query(
    'SELECT * FROM precios_caleta WHERE caleta_id = $1 ORDER BY especie',
    [id]
  );

  return { caleta: rows[0], precios };
}

async function updateEstado(id, estado) {
  const validos = ['abierto', 'alerta', 'cerrado'];
  if (!validos.includes(estado)) throw new AppError('Estado inválido.', 400);

  const { rows } = await db.query(
    'UPDATE caletas SET estado = $1 WHERE id = $2 RETURNING *',
    [estado, id]
  );
  if (!rows.length) throw new AppError('Caleta no encontrada.', 404);
  return rows[0];
}

module.exports = { list, getById, updateEstado };
