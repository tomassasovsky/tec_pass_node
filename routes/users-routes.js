const { Router } = require('express')
const { check } = require('express-validator')

const userController = require('../controllers/users-controller')
const { emailExists, rutExists, phoneExists, userExists } = require('../helpers/db-validators')
const { validateFields, validateJWT } = require('../middlewares/middlewares')

const { rutValid } = require('../helpers/rut-validator')

const router = Router()

router.get('/', userController.usersGet)

router.put('/:id', [
  validateJWT,
  check('id', '· El identificador de usuario no es válido').isMongoId(),
  check('id').custom(userExists),
  validateFields
], userController.usersPut)

router.post('/', [
  // check for errors and return them if there are any:
  check('name', '· El nombre es obligatorio').notEmpty(),
  check('email', '· El correo no es válido').isEmail(),
  check('rut').custom(rutExists),
  check('rut').custom(rutValid),
  check('phone', '· El teléfono es obligatorio').notEmpty(),
  check('phone').custom(phoneExists),
  check('password', '· La contraseña debe tener por lo menos 8 caracteres').isLength({ min: 8 }),
  check('email').custom(emailExists),
  validateFields
], userController.usersPost)

router.delete('/', [
  validateJWT,
  validateFields
], userController.usersDelete)

router.patch('/', [
  check('email', '· El correo no es válido').isEmail(),
  check('password', '· El correo es obligatorio').not().isEmpty(),
  validateFields
], userController.usersPatch)

module.exports = router