const db = require('../db/connection');

async function lonja() {
  const { rows } = await db.query(
    `SELECT DISTINCT ON (especie) * FROM precios_lonja
     ORDER BY especie, fecha DESC`
  );
  return rows;
}

async function historicoLonja(especie, dias = 30) {
  const { rows } = await db.query(
    'SELECT * FROM precios_lonja WHERE especie = $1 AND fecha >= CURRENT_DATE - $2::integer ORDER BY fecha DESC',
    [especie, dias]
  );
  return rows;
}

module.exports = { lonja, historicoLonja };
