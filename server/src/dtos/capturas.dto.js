const { rules } = require('../middlewares/validate');

const createSchema = {
  especie:       [rules.required('La especie es requerida')],
  caleta_origen: [rules.required('La caleta de origen es requerida')],
  cantidad_kg:   [rules.required('La cantidad es requerida'), rules.isNumber(), rules.min(0.01)],
  precio_por_kg: [rules.required('El precio es requerido'), rules.isNumber(), rules.min(0)],
  fecha_hora_captura: [rules.required('La fecha de captura es requerida')],
  metodo_pesca:  [rules.required('El método de pesca es requerido'),
    rules.isIn(['artesanal_espinel', 'artesanal_red', 'palangre', 'buceo', 'trampa'])],
  observaciones: [rules.isString()],
};

const updateSchema = {
  especie:       [rules.isString()],
  caleta_origen: [rules.isString()],
  cantidad_kg:   [rules.isNumber(), rules.min(0.01)],
  precio_por_kg: [rules.isNumber(), rules.min(0)],
  metodo_pesca:  [rules.isIn(['artesanal_espinel', 'artesanal_red', 'palangre', 'buceo', 'trampa'])],
  observaciones: [rules.isString()],
};

const capturaResponse = (c) => ({
  id: c.id,
  pescador_id: c.pescador_id,
  especie: c.especie,
  caleta_origen: c.caleta_origen,
  cantidad_kg: parseFloat(c.cantidad_kg),
  precio_por_kg: parseFloat(c.precio_por_kg),
  fecha_hora_captura: c.fecha_hora_captura,
  metodo_pesca: c.metodo_pesca,
  observaciones: c.observaciones,
  foto_url: c.foto_url,
  estado: c.estado,
  batch_id: c.batch_id,
  certificado_sernapesca: c.certificado_sernapesca,
  created_at: c.created_at,
});

module.exports = { createSchema, updateSchema, capturaResponse };
