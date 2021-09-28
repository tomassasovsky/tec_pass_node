const { request } = require('express');

module.exports = (req = request, recipients = [Object]) => {
  const notificationMessage = `${req.user.name} te ha enviado una invitación:\n${req.project.address}`;
  if (req.project.floor) notificationMessage.concat(`, ${req.project.floor}📌`)
  else notificationMessage.concat('📌')

  const recipientFilters = []
  recipients.forEach((recipient, index, array) => {
    recipientFilters.push({
      field: 'tag',
      key: 'phone',
      relation: '=',
      value: recipient.phone
    });
    recipientFilters.push({
      'operator': 'OR'
    });
    recipientFilters.push({
      field: 'email',
      relation: '=',
      value: recipient.email
    });
    if (index < array.length - 1) {
      recipientFilters.push({
        'operator': 'OR'
      })
    }
  });

  return {
    headings: {
      'en': 'Invitación'
    },
    contents: {
      'en': notificationMessage,
    },
    buttons: [
      {
        'id': 'DECLINE',
        'text': 'Rechazar'
      },
      {
        'id': 'ACCEPT',
        'text': 'Aceptar',
      }
    ],
    included_segments: ['Subscribed Users'],
    filters: recipientFilters
  }
};