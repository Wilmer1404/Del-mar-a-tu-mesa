const { Router } = require('express');
const ctrl = require('../controllers/caletas.controller');
const auth = require('../middlewares/auth');

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.put('/:id/estado', auth, ctrl.updateEstado);

module.exports = router;
