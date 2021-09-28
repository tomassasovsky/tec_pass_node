const nodemailer = require('nodemailer');

const sendEmailInvite = async (req, recipients = []) => {
  let emailList = '';
  for (email of recipients) emailList += email + ', ';

  const subject = `${req.user.name} te ha enviado una invitación:\n${req.project.address}`;
  if (req.project.floor) subject.concat(`, ${req.project.floor}📌`)
  else subject.concat('📌')

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailList,
    subject,
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = sendEmailInvite;