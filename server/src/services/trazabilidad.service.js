const db = require('../db/connection');
const AppError = require('../utils/AppError');

async function create(pescadorId, { captura_id }) {
  const { rows } = await db.query(
    'SELECT * FROM capturas WHERE id = $1 AND pescador_id = $2',
    [captura_id, pescadorId]
  );
  if (!rows.length) throw new AppError('Captura no encontrada.', 404);

  const c = rows[0];
  const loteId = 'LT-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' +
    String(Math.floor(Math.random() * 900) + 100);

  const { rows: lote } = await db.query(
    `INSERT INTO lotes_trazabilidad (id, captura_id, pescador_id, especie, caleta,
      fecha_captura, peso_kg, precio_kg, metodo_pesca, estado, qr_generado, sernapesca_validado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pendiente', true, $10)
     RETURNING *`,
    [loteId, captura_id, pescadorId, c.especie, c.caleta_origen,
     c.fecha_hora_captura, c.cantidad_kg, c.precio_por_kg, c.metodo_pesca,
     c.certificado_sernapesca]
  );

  return lote[0];
}

async function list(pescadorId, { estado, search, page = 1, limit = 20 }) {
  const conditions = ['pescador_id = $1'];
  const values = [pescadorId];
  let idx = 2;

  if (estado) {
    conditions.push(`estado = $${idx++}`);
    values.push(estado);
  }
  if (search) {
    conditions.push(`(especie ILIKE $${idx} OR caleta ILIKE $${idx} OR id ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }

  const offset = (page - 1) * limit;
  const { rows } = await db.query(
    `SELECT * FROM lotes_trazabilidad WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );

  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) FROM lotes_trazabilidad WHERE ${conditions.join(' AND ')}`,
    values
  );

  return { data: rows, total: parseInt(countRows[0].count), page, limit };
}

async function getById(id, pescadorId) {
  const { rows } = await db.query(
    'SELECT * FROM lotes_trazabilidad WHERE id = $1 AND pescador_id = $2',
    [id, pescadorId]
  );
  if (!rows.length) throw new AppError('Lote no encontrado.', 404);
  return rows[0];
}

module.exports = { create, list, getById };
