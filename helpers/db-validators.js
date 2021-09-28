const User = require('../models/user-model')
const Project = require('../models/project-model')

const { buildError } = require('./build-error');
const Invite = require('../models/invite-model');
const { request } = require('express');

const emailExists = async (email = '') => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error('Este correo ya tiene una cuenta vinculada');
  }
}

const rutExists = async (rut = '') => {
  const exists = await User.findOne({ rut });
  if (exists) {
    throw new Error('Este RUT ya tiene una cuenta vinculada');
  }
}

const phoneExists = async (phone = '') => {
  const exists = await User.findOne({ phone });
  if (exists) {
    throw new Error('Este teléfono ya tiene una cuenta vinculada');
  }
}

const userExists = async (id = '') => {
  const exists = await User.findById(id);
  if (!exists) {
    throw new Error('Este usuario no existe');
  }
}

const projectExists = async (req, res, next) => {
  const project = await Project.findById(req.body.projectId);

  if (!project) {
    return res.status(404).json(buildError('El proyecto no existe', 'projectId'))
  }

  if ((req.user.type === 'PROJECT_ADMIN' && req.user.projects.includes(project._id)) || req.user.type === 'TECHNICIAN') {
    req.project = project;
    next();
  } else {
    return res.status(403).json(buildError('El usuario no tiene acceso al proyecto', 'access'))
  }
}

const inviteExists = async (req = request, res, next) => {
  const invite = await Invite.findById(req.params.id);
  await invite.populate('inviteRecipients').execPopulate();

  if (!invite) return res.status(404).json(buildError('La invitación no existe', 'inviteId'))

  const userInvite = invite.inviteRecipients.find((recipient) => recipient.user.toString() == req.user._id.toString());

  if (userInvite) {
    req.invite = invite;
    req.userInvite = userInvite;
    next();
  } else if (req.user._id.toString() == invite.from) {
    req.invite = invite;
    next();
  } else {
    return res.status(403).json(buildError('El usuario no tiene acceso a la invitación', 'access'))
  }
}

module.exports = {
  emailExists,
  rutExists,
  phoneExists,
  userExists,
  projectExists,
  inviteExists,
}