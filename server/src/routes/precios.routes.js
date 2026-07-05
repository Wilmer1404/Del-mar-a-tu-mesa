const { Router } = require('express');
const ctrl = require('../controllers/precios.controller');

const router = Router();

router.get('/lonja', ctrl.lonja);
router.get('/historico', ctrl.historico);

module.exports = router;
