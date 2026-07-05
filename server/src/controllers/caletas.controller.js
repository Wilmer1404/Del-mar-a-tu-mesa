const caletasService = require('../services/caletas.service');
const catchAsync = require('../utils/catchAsync');
const { caletaResponse, caletaDetailResponse } = require('../dtos/caletas.dto');

exports.list = catchAsync(async (req, res) => {
  const caletas = await caletasService.list();
  res.json({ success: true, data: caletas.map(caletaResponse) });
});

exports.getById = catchAsync(async (req, res) => {
  const { caleta, precios } = await caletasService.getById(req.params.id);
  res.json({ success: true, data: caletaDetailResponse(caleta, precios) });
});

exports.updateEstado = catchAsync(async (req, res) => {
  const caleta = await caletasService.updateEstado(req.params.id, req.body.estado);
  res.json({ success: true, data: caletaResponse(caleta) });
});
