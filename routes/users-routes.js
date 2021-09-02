const { Router } = require('express')
const { check } = require('express-validator')

const userController = require('../controllers/users-controller')
const { validateFields } = require('../middlewares/validate-fields')

const {
  emailExists,
  rutExists,
  phoneExists,
  userExists,
  rutValid,
  passwordConfirmation,
  verifyAccessToken,
} = require('../helpers/helpers')

const router = Router()

router.get('/', [
  verifyAccessToken,
  validateFields
], userController.usersGet)

router.post('/', [
  // check for errors and return them if there are any:
  check('name', '· El nombre es obligatorio').notEmpty(),
  check('email', '· El correo no es válido').isEmail(),
  check('rut').custom(rutExists),
  check('rut').custom(rutValid),
  check('phone', '· El teléfono es obligatorio').notEmpty(),
  check('phone').custom(phoneExists),
  check('password', '· La contraseña debe tener por lo menos 8 caracteres').isLength({ min: 8 }),
  check('password').custom(passwordConfirmation),
  check('email').custom(emailExists),
  validateFields
], userController.usersPost)

router.put('/', [
  verifyAccessToken,
  validateFields
], userController.usersPut)

router.delete('/', [
  verifyAccessToken,
  validateFields,
], userController.usersDelete)

router.patch('/', [
  check('email', '· El correo no es válido').isEmail(),
  check('password', '· El correo es obligatorio').not().isEmpty(),
  validateFields
], userController.usersPatch)

module.exports = router