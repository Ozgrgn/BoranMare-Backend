const { Reservation } = require("../model/index");
const MailService = require("../../mail/services");
const UserService = require("../../user/services");
const RoomService = require("../../room/services");
const mailConfig = require("../../../config.json");
const promiseHandler = require("../../utilities/promiseHandler");
const DealService = require("../../deal/services");
const addReservation = async (reservationDetails) => {
  const lastReservation = await Reservation.findOne(
    {},
    {},
    { sort: { resId: -1 } }
  );

  if (lastReservation) {
    reservationDetails.resId = lastReservation.resId + 1;
  }
  const reservation = await new Reservation(reservationDetails).save();
  const room = await RoomService.getRoomWithById(reservation.room);
  const agency = await UserService.getUserWithById(reservation.agency);

  if (!room || !agency) {
    throw new Error("Logical error reservation controller addReservation");
  }
  const [mail_err, mail] = await promiseHandler(
    MailService.sendMail({
      to: mailConfig.auth.reservation,
      from: `${mailConfig.globalName} <${mailConfig.auth.user}>`,
      mailOptions: {
        type: MailService.RESERVATION_MAIL,
        params: {
          voucherId: reservation.voucherId,
          room: room.title,
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

const getUserBalanceWithByuserId = async (userId) => {
  const user = await UserService.getUserWithById(userId);
  if (!user) {
    throw new Error("user is not found");
  }

  let balance = 0;
  const reservations = await Reservation.find({
    approvedStatus: true,
    agency: user._id,
    checkIn: { $lt: new Date().toISOString() },
  });

  const deals = await DealService.getDeals();
  return Promise.all(
    reservations.map((reservation) => {
      deals.map((deal) => {
        if (
          new Date(reservation.checkIn) > new Date(deal.startDate) &&
          new Date(reservation.checkIn) < new Date(deal.endDate)
        ) {
          balance = balance + deal.bonusPrice;

          reservation.additionalServices.map((service) => {
            if (deals[service]) {
              balance = balance + deals[service];
            }
          });
        }
      });
    })
  ).then(() => {
    return balance;
  });
};
module.exports = {
  addReservation,
  getReservations,
  getUserBalanceWithByuserId,
};
