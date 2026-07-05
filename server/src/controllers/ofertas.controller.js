const ofertasService = require('../services/ofertas.service');
const catchAsync = require('../utils/catchAsync');
const { ofertaResponse, marketplaceResponse } = require('../dtos/ofertas.dto');

exports.create = catchAsync(async (req, res) => {
  const oferta = await ofertasService.createFromCaptura(req.user.id, req.body);
  res.status(201).json({ success: true, data: ofertaResponse(oferta) });
});

exports.list = catchAsync(async (req, res) => {
  const result = await ofertasService.list(req.user.id, req.query);
  res.json({
    success: true,
    data: result.data.map(ofertaResponse),
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

exports.getById = catchAsync(async (req, res) => {
  const oferta = await ofertasService.getById(req.params.id);
  res.json({ success: true, data: ofertaResponse(oferta) });
});

exports.update = catchAsync(async (req, res) => {
  const oferta = await ofertasService.update(req.params.id, req.user.id, req.body);
  res.json({ success: true, data: ofertaResponse(oferta) });
});

exports.remove = catchAsync(async (req, res) => {
  await ofertasService.remove(req.params.id, req.user.id);
  res.json({ success: true, data: null });
});

exports.marketplace = catchAsync(async (req, res) => {
  const result = await ofertasService.marketplace(req.query);
  res.json({
    success: true,
    data: result.data.map(marketplaceResponse),
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});
