const preciosService = require('../services/precios.service');
const catchAsync = require('../utils/catchAsync');
const { lonjaResponse } = require('../dtos/precios.dto');

exports.lonja = catchAsync(async (req, res) => {
  const precios = await preciosService.lonja();
  res.json({ success: true, data: precios.map(lonjaResponse) });
});

exports.historico = catchAsync(async (req, res) => {
  const { especie, dias } = req.query;
  const data = await preciosService.historicoLonja(especie, dias ? parseInt(dias) : 30);
  res.json({ success: true, data });
});
