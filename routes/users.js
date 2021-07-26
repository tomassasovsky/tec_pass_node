const { Router } = require('express');
const userController = require('../controllers/users');

const router = Router();

router.get('/', userController.usersGet)
router.post('/', userController.usersPost)
router.put('/:id', userController.usersPut)
router.delete('/', userController.usersDelete)
router.patch('/', userController.usersPatch)

module.exports = router; 