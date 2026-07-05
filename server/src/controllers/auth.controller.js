const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const { usuarioResponse } = require('../dtos/auth.dto');

exports.register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  res.status(201).json({
    success: true,
    data: { user: usuarioResponse(user), token },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  res.json({
    success: true,
    data: { user: usuarioResponse(user), token },
  });
});

exports.me = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.json({ success: true, data: usuarioResponse(user) });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  res.json({ success: true, data: usuarioResponse(user) });
});
