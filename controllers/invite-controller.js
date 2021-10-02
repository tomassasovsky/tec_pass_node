const { response, request } = require('express');
const OneSignal = require('onesignal-node');

const Invite = require('../models/invite-model');
const User = require('../models/user-model');

const { buildError } = require('../helpers/build-error');
const sendEmailInvite = require('../helpers/send-email');
const buildNotificationInvite = require('../helpers/build-notification');
const jsDateFromDartString = require('../helpers/js-date-from-dart-string');
const InviteRecipient = require('../models/invite-recipient-model');

const getInvite = async (req = request, res = response) => {
  const { invite } = req;
  res.status(200).json({ invite });
}

const sendInvite = async (req = request, res = response) => {
  const { recipients, dateFrom, dateTo, message } = req.body;
  const { project } = req;

  const inviteRecipients = [];
  const pushRecipients = [];
  const emailRecepients = [];

  for (const recipient of recipients) {
    const { email, phone } = recipient;

    const user = await User.findOne({ $or: [{ email }, { phone }] });

    const inviteRecipient = new InviteRecipient({ user, email });
    await inviteRecipient.save();
    inviteRecipients.push(inviteRecipient);

    if (user) pushRecipients.push(user);
    emailRecepients.push(recipient.email);
  }

  try {
    if (pushRecipients.length > 0) {
      const client = new OneSignal.Client(process.env.ONE_SIGNAL_APP_ID, process.env.ONE_SIGNAL_API_KEY);
      if (!client) return res.status(500).json(buildError('· No se ha podido conectarse con la aplicación de OneSignal', 'server'));

      const notification = buildNotificationInvite(req, pushRecipients)
      const response = await client.createNotification(notification);

      if (response.statusCode !== 200) return res.status(500).json(buildError(`· No se ha podido enviar la notificación push`, 'server'));
    }

    await sendEmailInvite(req, emailRecepients)

    const invite = new Invite({
      from: req.user._id,
      project: project._id,
      dateFrom: jsDateFromDartString(dateFrom),
      dateTo: jsDateFromDartString(dateTo),
      pushId: (response.body) ? response.body.id : undefined,
      inviteRecipients,
      message,
    });

    await invite.save();
    await invite.populate('from').populate('to').populate('project').populate('inviteRecipients').execPopulate();

    invite.from = invite.from.toJSON();
    invite.project = invite.project.toJSON();

    return res.status(200).json({ invite });
  } catch (e) {
    return res.status(500).json(buildError('· Error del servidor: ' + e, 'server'));
  }
}

const acceptInvite = async (req = request, res = response) => {
  const { userInvite } = req;

  userInvite.status = 'ACCEPTED';
  await userInvite.save();

  res.status(200).json({ userInvite });
}

const declineInvite = async (req = request, res = response) => {
  const { userInvite } = req;

  userInvite.status = 'DECLINED';
  await userInvite.save();

  res.status(200).json({ userInvite });
}

module.exports = {
  getInvite,
  sendInvite,
  acceptInvite,
  declineInvite
}