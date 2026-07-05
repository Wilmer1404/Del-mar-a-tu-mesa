const db = require('../db/connection');

async function listProveedores() {
  const { rows } = await db.query('SELECT * FROM proveedores ORDER BY nombre');
  return rows;
}

async function getProveedorById(id) {
  const { rows } = await db.query('SELECT * FROM proveedores WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { listProveedores, getProveedorById };
