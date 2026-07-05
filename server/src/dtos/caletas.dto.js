const caletaResponse = (c) => ({
  id: c.id,
  nombre: c.nombre,
  distrito: c.distrito,
  region: c.region,
  latitud: parseFloat(c.latitud),
  longitud: parseFloat(c.longitud),
  estado: c.estado,
  pescadores: parseInt(c.pescadores),
  embarcaciones: parseInt(c.embarcaciones),
  viento: c.viento,
  temperatura_mar: c.temperatura_mar,
  oleaje: c.oleaje,
  descripcion: c.descripcion,
  color_mapa: c.color_mapa,
});

const caletaDetailResponse = (c, precios) => ({
  ...caletaResponse(c),
  precios,
});

module.exports = { caletaResponse, caletaDetailResponse };
