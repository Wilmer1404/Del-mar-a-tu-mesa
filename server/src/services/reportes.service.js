const db = require('../db/connection');
const AppError = require('../utils/AppError');

async function dashboard(pescadorId) {
  const [ventas, ofertas, capturas] = await Promise.all([
    db.query(
      `SELECT COALESCE(SUM((peso_capturado_kg - peso_disponible_kg) * precio_por_kg), 0) AS total
       FROM ofertas WHERE pescador_id = $1 AND estado IN ('publicado', 'vendido')
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE)`,
      [pescadorId]
    ),
    db.query(
      `SELECT
        COUNT(*) FILTER (WHERE estado = 'publicado') AS activas,
        COUNT(*) FILTER (WHERE estado = 'vendido') AS vendidas,
        COUNT(*) AS total
       FROM ofertas WHERE pescador_id = $1`,
      [pescadorId]
    ),
    db.query(
      `SELECT COUNT(*) FROM capturas WHERE pescador_id = $1
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE)`,
      [pescadorId]
    ),
  ]);

  const totalVentas = parseFloat(ventas.rows[0].total) || 0;

  return {
    total_ventas_mes: totalVentas,
    ofertas_activas: parseInt(ofertas.rows[0].activas),
    ofertas_vendidas: parseInt(ofertas.rows[0].vendidas),
    total_ofertas: parseInt(ofertas.rows[0].total),
    capturas_mes: parseInt(capturas.rows[0].count),
  };
}

async function ventasMensuales(pescadorId) {
  const { rows } = await db.query(
    `SELECT
      TO_CHAR(created_at, 'Mon') AS mes,
      EXTRACT(MONTH FROM created_at) AS mes_num,
      EXTRACT(YEAR FROM created_at) AS anio,
      COALESCE(SUM((peso_capturado_kg - peso_disponible_kg) * precio_por_kg), 0) AS valor
     FROM ofertas
     WHERE pescador_id = $1 AND estado = 'vendido'
       AND created_at >= CURRENT_DATE - INTERVAL '6 months'
     GROUP BY mes, mes_num, anio
     ORDER BY anio, mes_num`,
    [pescadorId]
  );
  return rows;
}

async function topEspecies(pescadorId) {
  const { rows } = await db.query(
    `SELECT
      especie AS nombre_especie,
      SUM(peso_capturado_kg - peso_disponible_kg) AS kg_vendidos,
      SUM((peso_capturado_kg - peso_disponible_kg) * precio_por_kg) AS ingresos
     FROM ofertas
     WHERE pescador_id = $1 AND estado = 'vendido'
     GROUP BY especie
     ORDER BY ingresos DESC
     LIMIT 5`,
    [pescadorId]
  );

  const maxIngresos = rows.length ? Math.max(...rows.map(r => parseFloat(r.ingresos))) : 0;

  return rows.map((r, i) => ({
    ...r,
    kg_vendidos: parseFloat(r.kg_vendidos) || 0,
    ingresos: parseFloat(r.ingresos) || 0,
    porcentaje: maxIngresos ? Math.round((parseFloat(r.ingresos) / maxIngresos) * 100) : 0,
  }));
}

async function topCompradores(pescadorId) {
  const { rows } = await db.query(
    `SELECT
      proveedor_nombre AS nombre,
      COUNT(*) AS pedidos,
      SUM(total) AS monto_total
     FROM ordenes_compra
     WHERE proveedor_nombre IN (
       SELECT nombre FROM usuarios WHERE id = $1
     )
     GROUP BY proveedor_nombre
     ORDER BY monto_total DESC
     LIMIT 5`,
    [pescadorId]
  );
  return rows;
}

module.exports = { dashboard, ventasMensuales, topEspecies, topCompradores };
