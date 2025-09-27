const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'vagjelis.8@gmail.com', // fallback for local testing
    pass: process.env.EMAIL_PASS || 'hrws bvww vfxa rozj',  // fallback for local testing
  },
});

const sendConfirmationEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Corfiot Transfers" <${process.env.EMAIL_USER || 'vagjelis.8@gmail.com'}>`,
      to,
      subject,
      text,
    });
    console.log('✅ Confirmation email sent to', to);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
};

module.exports = { sendConfirmationEmail };
