const { Router } = require('express');
const ctrl = require('../controllers/reportes.controller');
const auth = require('../middlewares/auth');

const router = Router();

router.use(auth);

router.get('/dashboard', ctrl.dashboard);
router.get('/ventas', ctrl.ventasMensuales);
router.get('/especies', ctrl.topEspecies);
router.get('/compradores', ctrl.topCompradores);

module.exports = router;
