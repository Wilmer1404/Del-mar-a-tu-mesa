const trazabilidadService = require('../services/trazabilidad.service');
const catchAsync = require('../utils/catchAsync');
const { loteResponse } = require('../dtos/trazabilidad.dto');

exports.create = catchAsync(async (req, res) => {
  const lote = await trazabilidadService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: loteResponse(lote) });
});

exports.list = catchAsync(async (req, res) => {
  const result = await trazabilidadService.list(req.user.id, req.query);
  res.json({
    success: true,
    data: result.data.map(loteResponse),
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

exports.getById = catchAsync(async (req, res) => {
  const lote = await trazabilidadService.getById(req.params.id, req.user.id);
  res.json({ success: true, data: loteResponse(lote) });
});
