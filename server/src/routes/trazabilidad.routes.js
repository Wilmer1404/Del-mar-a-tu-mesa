const { Router } = require('express');
const ctrl = require('../controllers/trazabilidad.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createSchema } = require('../dtos/trazabilidad.dto');

const router = Router();

router.use(auth);

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);

module.exports = router;
