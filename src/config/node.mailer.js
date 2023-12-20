const settings = require("../command/command");
const nodemailer = require("nodemailer");
const transportMail = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: settings.emailUser,
    pass: settings.emailPassword,
  },
});

module.exports = { transportMail };
