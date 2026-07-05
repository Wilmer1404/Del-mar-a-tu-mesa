const db = require('../db/connection');
const AppError = require('../utils/AppError');

async function createFromCaptura(pescadorId, { captura_id, fecha_vencimiento, precio_por_kg }) {
  const captura = await db.query(
    'SELECT * FROM capturas WHERE id = $1 AND pescador_id = $2',
    [captura_id, pescadorId]
  );
  if (!captura.rows.length) throw new AppError('Captura no encontrada.', 404);

  const c = captura.rows[0];
  if (c.estado !== 'pendiente') throw new AppError('La captura ya tiene una oferta asociada.', 400);

  const ofertaId = 'OF-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' +
    String(Math.floor(Math.random() * 900) + 100);

  const { rows } = await db.query(
    `INSERT INTO ofertas (id, captura_id, pescador_id, especie, caleta, fecha_publicacion,
      fecha_vencimiento, peso_capturado_kg, peso_disponible_kg, precio_por_kg, metodo_pesca,
      estado, descripcion, certificado, categoria)
     VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6, $7, $7, $8, $9, 'pendiente', $10, $11, $12)
     RETURNING *`,
    [ofertaId, captura_id, pescadorId, c.especie, c.caleta_origen, fecha_vencimiento,
     c.cantidad_kg, precio_por_kg || c.precio_por_kg, c.metodo_pesca,
     c.observaciones, c.certificado_sernapesca, null]
  );

  await db.query('UPDATE capturas SET estado = $1 WHERE id = $2', ['publicado', captura_id]);
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
    `SELECT * FROM ofertas WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );

  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) FROM ofertas WHERE ${conditions.join(' AND ')}`,
    values
  );

  return { data: rows, total: parseInt(countRows[0].count), page, limit };
}

async function getById(id) {
  const { rows } = await db.query('SELECT * FROM ofertas WHERE id = $1', [id]);
  if (!rows.length) throw new AppError('Oferta no encontrada.', 404);
  return rows[0];
}

async function update(id, pescadorId, data) {
  const oferta = await getById(id);
  if (oferta.pescador_id !== pescadorId) throw new AppError('No autorizado.', 403);

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

  values.push(id);
  const { rows } = await db.query(
    `UPDATE ofertas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0];
}

async function remove(id, pescadorId) {
  const oferta = await getById(id);
  if (oferta.pescador_id !== pescadorId) throw new AppError('No autorizado.', 403);
  const { rowCount } = await db.query('DELETE FROM ofertas WHERE id = $1', [id]);
  if (!rowCount) throw new AppError('Oferta no encontrada.', 404);
}

async function marketplace({ categoria, search, sort, page = 1, limit = 20 }) {
  let conditions = ['estado = $1', 'peso_disponible_kg > $2'];
  const values = ['publicado', 0];
  let idx = 3;
  let orderBy = 'created_at DESC';

  if (categoria && categoria !== 'todos') {
    conditions.push(`categoria = $${idx++}`);
    values.push(categoria);
  }
  if (search) {
    conditions.push(`(especie ILIKE $${idx} OR caleta ILIKE $${idx} OR descripcion ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }
  if (sort === 'precio') orderBy = 'precio_por_kg ASC';
  if (sort === 'precio_desc') orderBy = 'precio_por_kg DESC';
  if (sort === 'reciente') orderBy = 'created_at DESC';

  const offset = (page - 1) * limit;
  const { rows } = await db.query(
    `SELECT o.*, u.nombre AS vendedor_nombre,
      (o.peso_capturado_kg - o.peso_disponible_kg) AS kg_vendidos,
      EXTRACT(EPOCH FROM (o.fecha_vencimiento - CURRENT_DATE)) / 3600 AS horas_restantes
     FROM ofertas o
     JOIN usuarios u ON u.id = o.pescador_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY o.destacado DESC, ${orderBy}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );

  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) FROM ofertas o
     JOIN usuarios u ON u.id = o.pescador_id
     WHERE ${conditions.join(' AND ')}`,
    values
  );

  return { data: rows, total: parseInt(countRows[0].count), page, limit };
}

async function incrementVisitas(ofertaId) {
  await db.query('UPDATE ofertas SET visitas = visitas + 1 WHERE id = $1', [ofertaId]);
}

module.exports = { createFromCaptura, list, getById, update, remove, marketplace, incrementVisitas };
