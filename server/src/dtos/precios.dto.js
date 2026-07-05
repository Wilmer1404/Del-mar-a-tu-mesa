const lonjaResponse = (p) => ({
  id: p.id,
  especie: p.especie,
  precio: parseFloat(p.precio),
  cambio_pct: p.cambio_pct,
  tendencia: p.tendencia,
  fecha: p.fecha,
});

module.exports = { lonjaResponse };
