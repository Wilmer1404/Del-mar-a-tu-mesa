const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../dtos/auth.dto');

const router = Router();

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.get('/me', auth, ctrl.me);
router.put('/profile', auth, validate(updateProfileSchema), ctrl.updateProfile);

module.exports = router;
