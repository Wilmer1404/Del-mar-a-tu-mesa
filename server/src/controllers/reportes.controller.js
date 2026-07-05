const reportesService = require('../services/reportes.service');
const catchAsync = require('../utils/catchAsync');

exports.dashboard = catchAsync(async (req, res) => {
  const data = await reportesService.dashboard(req.user.id);
  res.json({ success: true, data });
});

exports.ventasMensuales = catchAsync(async (req, res) => {
  const data = await reportesService.ventasMensuales(req.user.id);
  res.json({ success: true, data });
});

exports.topEspecies = catchAsync(async (req, res) => {
  const data = await reportesService.topEspecies(req.user.id);
  res.json({ success: true, data });
});

exports.topCompradores = catchAsync(async (req, res) => {
  const data = await reportesService.topCompradores(req.user.id);
  res.json({ success: true, data });
});
