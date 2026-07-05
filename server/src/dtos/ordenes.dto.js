const { rules } = require('../middlewares/validate');

const createSchema = {
  items: [
    (v) => !Array.isArray(v) || v.length === 0 ? 'Debe incluir al menos un item' : null,
    (v) => v?.some(i => !i.oferta_id || !i.cantidad_kg) ? 'Cada item requiere oferta_id y cantidad_kg' : null,
  ],
};

const ordenResponse = (o) => ({
  id: o.id,
  comprador_id: o.comprador_id,
  proveedor_nombre: o.proveedor_nombre,
  tipo: o.tipo,
  producto_nombre: o.producto_nombre,
  fecha_orden: o.fecha_orden,
  cantidad: o.cantidad,
  total: parseFloat(o.total),
  estado: o.estado,
  factura_url: o.factura_url,
  created_at: o.created_at,
});

module.exports = { createSchema, ordenResponse };
