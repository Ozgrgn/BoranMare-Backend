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

const RESERVATION_MAIL = function (params) {
  const { voucherId, roomType, checkIn, checkOut, agency } = params;
  if (!voucherId || !roomType || !checkIn || !checkOut || !agency) {
    throw new Error("Missing parameters");
  }
  return {
    subject: "New Reservation",
    html: `
    <table>
    <thead>
      <tr>
        <td  style="padding-left: 20px;"><strong>Voucher NO</strong></td>
        <td  style="padding-left: 20px;"><strong>Room Type</strong></td>
        <td  style="padding-left: 20px;"><strong>Check In Date</strong></td>
        <td  style="padding-left: 20px;"><strong>Check Out Date</strong></td>
        <td  style="padding-left: 20px;"><strong>Agency</strong></td>
        <td  style="padding-left: 20px;"><strong>Agency Mail</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td  style="padding-left: 20px;">${voucherId}</td>
        <td  style="padding-left: 20px;">${roomType}</td>
        <td  style="padding-left: 20px;">${checkIn}</td>
        <td  style="padding-left: 20px;">${checkOut}</td>
        <td  style="padding-left: 20px;">${agency.fullName}</td>
        <td  style="padding-left: 20px;">${agency.email}</td>
      </tr>
    </tbody>
  </table>
  `,
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
  RESERVATION_MAIL
};
