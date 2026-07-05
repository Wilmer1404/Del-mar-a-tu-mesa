const { Router } = require('express');

const router = Router();

router.use('/auth',        require('./auth.routes'));
router.use('/capturas',    require('./capturas.routes'));
router.use('/ofertas',     require('./ofertas.routes'));
router.use('/caletas',     require('./caletas.routes'));
router.use('/ordenes',     require('./ordenes.routes'));
router.use('/lotes',       require('./trazabilidad.routes'));
router.use('/reportes',    require('./reportes.routes'));
router.use('/precios',     require('./precios.routes'));
router.use('/insumos',     require('./insumos.routes'));

module.exports = router;
