const ordenesService = require('../services/ordenes.service');
const catchAsync = require('../utils/catchAsync');
const { ordenResponse } = require('../dtos/ordenes.dto');

exports.create = catchAsync(async (req, res) => {
  const orden = await ordenesService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: ordenResponse(orden) });
});

exports.list = catchAsync(async (req, res) => {
  const result = await ordenesService.list(req.user.id, req.query);
  res.json({
    success: true,
    data: result.data.map(ordenResponse),
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

exports.getById = catchAsync(async (req, res) => {
  const { orden, items } = await ordenesService.getById(req.params.id, req.user.id);
  res.json({ success: true, data: { ...ordenResponse(orden), items } });
});

exports.updateEstado = catchAsync(async (req, res) => {
  const orden = await ordenesService.updateEstado(req.params.id, req.user.id, req.body.estado);
  res.json({ success: true, data: ordenResponse(orden) });
});
