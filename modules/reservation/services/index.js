const { Reservation } = require("../model/index");
const MailService = require("../../mail/services");
const UserService = require("../../user/services");
const mailConfig = require("../../../config.json");
const promiseHandler = require("../../utilities/promiseHandler");
const addReservation = async (reservationDetails) => {
  const reservation = await new Reservation(reservationDetails).save();
  const agency = await UserService.getUserWithById(reservation.agency);

  const [mail_err, mail] = await promiseHandler(
    MailService.sendMail({
      to: mailConfig.auth.reservation,
      from: `${mailConfig.globalName} <${mailConfig.auth.user}>`,
      mailOptions: {
        type: MailService.RESERVATION_MAIL,
        params: {
          voucherId: reservation.voucherId,
          roomType: reservation.roomType,
          checkIn: beautifyDate(reservation.checkIn),
          checkOut: beautifyDate(reservation.checkOut),
          agency,
        },
      },
    })
  );
  if (mail_err) {
    return { status: false, message: mail_err };
  }

  return reservation;
};
const getReservations = async () => {
  return Reservation.find();
};

const beautifyDate = (date) => {
  let settedDate = new Date(date);
  return `${settedDate.getFullYear()}-${settedDate.getMonth()}-${settedDate.getDate()}`;
};
module.exports = {
  addReservation,
  getReservations,
};
