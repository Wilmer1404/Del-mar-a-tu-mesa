const db = require('../db/connection');
const AppError = require('../utils/AppError');

async function create(pescadorId, data) {
  const { rows } = await db.query(
    `INSERT INTO capturas (pescador_id, especie, caleta_origen, cantidad_kg, precio_por_kg,
      fecha_hora_captura, metodo_pesca, observaciones, foto_url, estado, batch_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pendiente',
      'LT-' || to_char(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('seq_batch_id')::TEXT, 3, '0'))
     RETURNING *`,
    [pescadorId, data.especie, data.caleta_origen, data.cantidad_kg, data.precio_por_kg,
     data.fecha_hora_captura, data.metodo_pesca, data.observaciones || null, data.foto_url || null]
  );
  return rows[0];
}

async function list(pescadorId, { estado, page = 1, limit = 20 }) {
  const conditions = ['pescador_id = $1'];
  const values = [pescadorId];
  let idx = 2;

  if (estado) {
    conditions.push(`estado = $${idx++}`);
    values.push(estado);
  }

  const offset = (page - 1) * limit;
  const { rows } = await db.query(
    `SELECT * FROM capturas WHERE ${conditions.join(' AND ')}
     ORDER BY fecha_hora_captura DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );

  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) FROM capturas WHERE ${conditions.join(' AND ')}`,
    values
  );

  return { data: rows, total: parseInt(countRows[0].count), page, limit };
}

async function getById(id, pescadorId) {
  const { rows } = await db.query(
    'SELECT * FROM capturas WHERE id = $1 AND pescador_id = $2',
    [id, pescadorId]
  );
  if (!rows.length) throw new AppError('Captura no encontrada.', 404);
  return rows[0];
}

async function update(id, pescadorId, data) {
  await getById(id, pescadorId);

  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined && key !== 'batch_id') {
      fields.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }

  if (!fields.length) throw new AppError('No hay datos para actualizar.', 400);

  values.push(id);
  const { rows } = await db.query(
    `UPDATE capturas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0];
}

async function remove(id, pescadorId) {
  const { rowCount } = await db.query(
    'DELETE FROM capturas WHERE id = $1 AND pescador_id = $2',
    [id, pescadorId]
  );
  if (!rowCount) throw new AppError('Captura no encontrada.', 404);
}

module.exports = { create, list, getById, update, remove };
