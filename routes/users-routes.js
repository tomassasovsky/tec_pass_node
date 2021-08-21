const { Router } = require('express')
const { check } = require('express-validator')

const userController = require('../controllers/users-controller')
const { roleExists, emailExists, userExists } = require('../helpers/db-validators')
const { validateFields, validateJWT } = require('../middlewares/middlewares')

const router = Router()

router.get('/', userController.usersGet)

router.put('/:id', [
  validateJWT,
  check('id', 'The parameter `id` is not valid').isMongoId(),
  check('id').custom(userExists),
  check('role').custom(roleExists),
  validateFields
], userController.usersPut)

router.post('/', [
  // check for errors and return them if there are any:
  validateJWT,
  check('name', 'The parameter \'name\' is required').notEmpty(),
  check('email', 'The parameter \'email\' is not valid').isEmail(),
  check('password', 'The parameter \'password\' is required and must contain at least 8 characters').isLength({ min: 8 }),
  check('email').custom(emailExists),
  check('role').custom(roleExists),
  validateFields
], userController.usersPost)

router.delete('/:id', [
  validateJWT,
  check('id', 'The parameter `id` is not valid').isMongoId(),
  check('id').custom(userExists),
  validateFields
], userController.usersDelete)

router.patch('/', userController.usersPatch)

module.exports = router