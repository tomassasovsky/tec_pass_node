const { Router } = require('express')
const { check } = require('express-validator')

const { login, token, logout } = require('../controllers/auth-controller')
const { verifyRefreshToken } = require('../helpers/jwt-helper')
const { validateFields } = require('../middlewares/validate-fields')

const router = Router()

router.post('/login', [
  check('email', '· El correo es un campo requerido').not().isEmpty(),
  check('email', '· El correo no es válido').isEmail(),
  check('password', '· La contraseña es un campo requerido').not().isEmpty(),
  check('password', '· La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
  validateFields,
], login)

router.post('/logout', [
  verifyRefreshToken,
  validateFields,
], logout)

router.post('/token', [
  verifyRefreshToken,
  validateFields,
], token)

module.exports = router;