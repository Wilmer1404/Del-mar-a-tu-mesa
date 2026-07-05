const { Router } = require('express');
const ctrl = require('../controllers/ordenes.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createSchema } = require('../dtos/ordenes.dto');

const router = Router();

router.use(auth);

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id/estado', ctrl.updateEstado);

module.exports = router;
