const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.corfutransfersapp.com", // SiteGround server
  port: 465,                          // try 465 first
  secure: true,                       // true for 465, false for 587
  auth: {
    user: "evanlabos@corfutransfersapp.com",   // your SiteGround email
    pass: "Kieyox3x3!",          // the password you created/reset
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to take messages!");
  }
});
