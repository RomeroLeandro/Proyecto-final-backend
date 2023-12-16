const nodemailer = require("nodemailer");
const env = require("../config/env/env");

async function sendPasswordResetMail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "romerodisind@gmail.com",
      pass: "vycr fyzj yhgg nwhi",
    },
  });
  const mailOptions = {
    from: env.email.user,
    to: email,
    subject: "Password Reset",
    text: `Click on the link to reset your password: http://localhost:${env.url.port}/session/reset-password/${resetToken}`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendPasswordResetMail;
