const { rules } = require('../middlewares/validate');

const createSchema = {
  captura_id: [rules.required('La captura es requerida')],
};

const loteResponse = (l) => ({
  id: l.id,
  captura_id: l.captura_id,
  pescador_id: l.pescador_id,
  especie: l.especie,
  caleta: l.caleta,
  fecha_captura: l.fecha_captura,
  peso_kg: parseFloat(l.peso_kg),
  precio_kg: parseFloat(l.precio_kg),
  metodo_pesca: l.metodo_pesca,
  estado: l.estado,
  qr_generado: l.qr_generado,
  qr_data_url: l.qr_data_url,
  sernapesca_validado: l.sernapesca_validado,
  created_at: l.created_at,
});

module.exports = { createSchema, loteResponse };
