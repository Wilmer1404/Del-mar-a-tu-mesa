const db = require('../db/connection');
const AppError = require('../utils/AppError');

async function create(compradorId, { items }) {
  let ofertasValidas = [];
  let total = 0;

  for (const item of items) {
    const { rows } = await db.query(
      'SELECT * FROM ofertas WHERE id = $1 AND estado = $2 AND peso_disponible_kg >= $3',
      [item.oferta_id, 'publicado', item.cantidad_kg]
    );
    if (!rows.length) throw new AppError(`Oferta ${item.oferta_id} no disponible.`, 400);
    ofertasValidas.push({ oferta: rows[0], cantidad: item.cantidad_kg });
    total += rows[0].precio_por_kg * item.cantidad_kg;
  }

  const ordenId = 'OC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' +
    String(Math.floor(Math.random() * 900) + 100);

  const primera = ofertasValidas[0];
  const { rows: orden } = await db.query(
    `INSERT INTO ordenes_compra (id, comprador_id, proveedor_nombre, tipo, producto_nombre,
      fecha_orden, cantidad, total, estado)
     VALUES ($1, $2, $3, 'producto_pesca', $4, CURRENT_DATE, $5, $6, 'pendiente')
     RETURNING *`,
    [ordenId, compradorId, primera.oferta.vendedor_nombre || 'Pescador',
     primera.oferta.especie, `${primera.cantidad} kg`, total]
  );

  for (const item of ofertasValidas) {
    await db.query(
      `INSERT INTO orden_items (orden_id, oferta_id, producto_nombre, cantidad_kg, precio_unitario, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [ordenId, item.oferta.id, item.oferta.especie, item.cantidad,
       item.oferta.precio_por_kg, item.oferta.precio_por_kg * item.cantidad]
    );

    await db.query(
      'UPDATE ofertas SET peso_disponible_kg = peso_disponible_kg - $1, reservas = reservas + 1 WHERE id = $2',
      [item.cantidad, item.oferta.id]
    );
  }

  return orden[0];
}

async function list(compradorId, { estado, page = 1, limit = 20 }) {
  const conditions = ['comprador_id = $1'];
  const values = [compradorId];
  let idx = 2;

  if (estado) {
    conditions.push(`estado = $${idx++}`);
    values.push(estado);
  }

  const offset = (page - 1) * limit;
  const { rows } = await db.query(
    `SELECT * FROM ordenes_compra WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );

  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) FROM ordenes_compra WHERE ${conditions.join(' AND ')}`,
    values
  );

  return { data: rows, total: parseInt(countRows[0].count), page, limit };
}

async function getById(id, compradorId) {
  const { rows } = await db.query(
    'SELECT * FROM ordenes_compra WHERE id = $1 AND comprador_id = $2',
    [id, compradorId]
  );
  if (!rows.length) throw new AppError('Orden no encontrada.', 404);

  const { rows: items } = await db.query(
    'SELECT * FROM orden_items WHERE orden_id = $1', [id]
  );

  return { orden: rows[0], items };
}

async function updateEstado(id, compradorId, estado) {
  const validos = ['pendiente', 'entregado', 'en_camino', 'cancelado'];
  if (!validos.includes(estado)) throw new AppError('Estado inválido.', 400);

  const { rows } = await db.query(
    'UPDATE ordenes_compra SET estado = $1 WHERE id = $2 AND comprador_id = $3 RETURNING *',
    [estado, id, compradorId]
  );
  if (!rows.length) throw new AppError('Orden no encontrada.', 404);
  return rows[0];
}

module.exports = { create, list, getById, updateEstado };
