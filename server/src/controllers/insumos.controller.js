const insumosService = require('../services/insumos.service');
const catchAsync = require('../utils/catchAsync');

exports.listProveedores = catchAsync(async (req, res) => {
  const data = await insumosService.listProveedores();
  res.json({ success: true, data });
});
