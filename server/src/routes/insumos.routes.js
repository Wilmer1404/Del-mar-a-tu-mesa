const { Router } = require('express');
const ctrl = require('../controllers/insumos.controller');

const router = Router();

router.get('/proveedores', ctrl.listProveedores);

module.exports = router;
