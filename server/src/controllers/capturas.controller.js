const capturasService = require('../services/capturas.service');
const catchAsync = require('../utils/catchAsync');
const { capturaResponse } = require('../dtos/capturas.dto');

exports.create = catchAsync(async (req, res) => {
  const captura = await capturasService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: capturaResponse(captura) });
});

exports.list = catchAsync(async (req, res) => {
  const result = await capturasService.list(req.user.id, req.query);
  res.json({
    success: true,
    data: result.data.map(capturaResponse),
    meta: { total: result.total, page: result.page, limit: result.limit },
  });
});

exports.getById = catchAsync(async (req, res) => {
  const captura = await capturasService.getById(req.params.id, req.user.id);
  res.json({ success: true, data: capturaResponse(captura) });
});

exports.update = catchAsync(async (req, res) => {
  const captura = await capturasService.update(req.params.id, req.user.id, req.body);
  res.json({ success: true, data: capturaResponse(captura) });
});

exports.remove = catchAsync(async (req, res) => {
  await capturasService.remove(req.params.id, req.user.id);
  res.json({ success: true, data: null });
});
