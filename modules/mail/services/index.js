const { transport } = require("../index");

const ACCOUNT_VERIFICATION_CODE_MAIL = function (params) {
  const { code } = params;
  if (!code) {
    throw new Error("Missing parameter: code");
  }
  return {
    subject: "Account Verification",
    text: `Your account verification code is: ${code} Please don't share this code with anyone.`,
    html: `Your account verification code is: <b>${code}</b> Please don't share this code with anyone.`,
  };
};

// HANDLERS
async function sendMail(options) {
  const { to, mailOptions, from } = options;
  if (!(to && mailOptions && from)) {
    throw new Error("Missing options parameters!");
  }

  const { type, params } = mailOptions;
  if (!(type && params)) {
    throw new Error("Missing mailOptions parameters!");
  }

  const mailContent = type(params);
  if (!mailContent) {
    throw new Error("Error while generating mail");
  }

  const mail = {
    from,
    to,
    ...mailContent,
  };

  await transport.sendMail(mail);

  return mail;
}

module.exports = {
  sendMail,
  ACCOUNT_VERIFICATION_CODE_MAIL,
};
