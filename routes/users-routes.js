const { Router } = require('express')
const { check } = require('express-validator')

const userController = require('../controllers/users-controller')
const { emailExists, userExists } = require('../helpers/db-validators')
const { validateFields, validateJWT } = require('../middlewares/middlewares')

const router = Router()

router.get('/', userController.usersGet)

router.put('/:id', [
  validateJWT,
  check('id', 'El identificador de usuario no es válido').isMongoId(),
  check('id').custom(userExists),
  validateFields
], userController.usersPut)

router.post('/', [
  // check for errors and return them if there are any:
  check('name', 'El nombre es obligatorio').notEmpty(),
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatorio').isLength({ min: 8 }),
  check('email').custom(emailExists),
  validateFields
], userController.usersPost)

router.delete('/', [
  validateJWT,
  validateFields
], userController.usersDelete)

router.patch('/', [
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'El correo es obligatorio').not().isEmpty(),
  validateFields
], userController.usersPatch)

module.exports = router