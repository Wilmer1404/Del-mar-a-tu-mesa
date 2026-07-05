const { rules } = require('../middlewares/validate');

const createSchema = {
  captura_id: [rules.required('La captura es requerida')],
  fecha_vencimiento: [rules.required('La fecha de vencimiento es requerida')],
  precio_por_kg: [rules.isNumber(), rules.min(0)],
};

const updateSchema = {
  precio_por_kg: [rules.isNumber(), rules.min(0)],
  fecha_vencimiento: [rules.isString()],
  destacado: [],
  estado: [rules.isIn(['publicado', 'pendiente', 'vendido', 'expirado', 'revision'])],
};

const ofertaResponse = (o) => ({
  id: o.id,
  captura_id: o.captura_id,
  pescador_id: o.pescador_id,
  vendedor_nombre: o.vendedor_nombre,
  especie: o.especie,
  caleta: o.caleta,
  fecha_publicacion: o.fecha_publicacion,
  fecha_vencimiento: o.fecha_vencimiento,
  peso_capturado_kg: parseFloat(o.peso_capturado_kg),
  peso_disponible_kg: parseFloat(o.peso_disponible_kg),
  precio_por_kg: parseFloat(o.precio_por_kg),
  metodo_pesca: o.metodo_pesca,
  estado: o.estado,
  visitas: parseInt(o.visitas),
  reservas: parseInt(o.reservas),
  destacado: o.destacado,
  descripcion: o.descripcion,
  certificado: o.certificado,
  categoria: o.categoria,
  created_at: o.created_at,
});

const marketplaceResponse = (o) => ({
  ...ofertaResponse(o),
  kg_vendidos: parseFloat(o.kg_vendidos || 0),
  horas_restantes: o.horas_restantes ? Math.round(o.horas_restantes) : null,
});

module.exports = { createSchema, updateSchema, ofertaResponse, marketplaceResponse };
