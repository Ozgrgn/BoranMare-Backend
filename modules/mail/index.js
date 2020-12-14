const mailer = require("nodemailer");
const { auth } = require("../../config.json");

module.exports.transport = mailer.createTransport({
  direct: true,
  host: "smtp.yandex.com",
  port: 465,
  auth,
  secure: true,
});
