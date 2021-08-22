const { Router } = require('express')
const { check } = require('express-validator')

const { login } = require('../controllers/auth-controller')
const { validateFields } = require('../middlewares/validate-fields')

const router = Router()

router.post('/login', [
  check('email', 'El correo es un campo requerido').isEmail(),
  check('password', 'La contraseña es un campo requerido').not().isEmpty(),
  validateFields,
], login)

module.exports = router;