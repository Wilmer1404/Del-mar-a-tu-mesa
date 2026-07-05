const { Router } = require('express');
const ctrl = require('../controllers/ofertas.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createSchema, updateSchema } = require('../dtos/ofertas.dto');

const router = Router();

router.get('/marketplace', auth.optional, ctrl.marketplace);

router.use(auth);

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id', validate(updateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
