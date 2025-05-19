const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vagjelis.8@gmail.com', // Your Gmail
    pass: 'hrws bvww vfxa rozj',   // Gmail App Password
  },
});

const sendConfirmationEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Corfiot Transfers" <vagjelis.8@gmail.com>',
      to,
      subject,
      text,
    });
    console.log('Confirmation email sent to', to);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

module.exports = { sendConfirmationEmail };
