const { Router } = require('express');
const ctrl = require('../controllers/capturas.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createSchema, updateSchema } = require('../dtos/capturas.dto');

const router = Router();

router.use(auth);

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id', validate(updateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
