const { Router } = require('express')
const { check } = require('express-validator')

const inviteController = require('../controllers/invite-controller')
const { validateFields } = require('../middlewares/validate-fields')

const { verifyAccessToken, projectExists, inviteExists } = require('../helpers/helpers')

const router = Router()

router.get('/:id', [
  verifyAccessToken,
  inviteExists,
  validateFields
], inviteController.getInvite)

router.post('/send', [
  verifyAccessToken,
  projectExists,
  check('recipients', '· Los recipientes de la invitación son obligatorios').notEmpty().isArray(),
  validateFields
], inviteController.sendInvite)

router.post('/accept/:id', [
  verifyAccessToken,
  inviteExists,
  validateFields,
], inviteController.acceptInvite)

router.post('/decline/:id', [
  verifyAccessToken,
  inviteExists,
  validateFields,
], inviteController.declineInvite)

module.exports = router