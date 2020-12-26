const { Reservation } = require("../model/index");
const MailService = require("../../mail/services");
const UserService = require("../../user/services");
const RoomService = require("../../room/services");
const mailConfig = require("../../../config.json");
const promiseHandler = require("../../utilities/promiseHandler");
const DealService = require("../../deal/services");
const CountryService = require("../../country/services");
const addReservation = async (reservationDetails) => {
  const lastReservation = await Reservation.findOne(
    {},
    {},
    { sort: { resId: -1 } }
  );

  if (lastReservation) {
    reservationDetails.resId = (Number(lastReservation.resId) + 1).toString();
  }

  const agency = await UserService.getUserWithById(reservationDetails.agency);
  const reservation = await new Reservation({
    ...reservationDetails,
    country: agency.country,
  }).save();
  const room = await RoomService.getRoomWithById(reservation.room);

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
const getReservations = async (query = {}, options = {}, user) => {
  const { queryOptions, sortOptions } = options;

  if (query.resId) {
    query.resId = { $regex: RegExp(query.resId + ".*") };
  }

  if (query.operator) {
    query.operator = { $regex: RegExp(query.operator + ".*") };
  }
  if (query.voucherId) {
    query.voucherId = { $regex: RegExp(query.voucherId + ".*") };
  }

  if (user.userType == "AGENCY") {
    query.agency = user.userId;
  }
  if (user.userType == "REGION_MANAGER") {
    const getUser = await UserService.getUserWithById(user.userId);

    query.country = getUser.country;
  }

  console.log(query);
  const reservationsQuery = Reservation.find(query, {}, queryOptions).populate(
    "room"
  );

  const reservations = await reservationsQuery.sort(sortOptions).exec();
  const count = await Reservation.countDocuments(query);
  return { reservations, count };
};
const getReservationWithById = async (reservationId) => {
  return Reservation.findById(reservationId);
};
const beautifyDate = (date) => {
  let settedDate = new Date(date);
  return `${settedDate.getFullYear()}-${settedDate.getMonth()}-${settedDate.getDate()}`;
};
const getUserReservationsWithByUserId = async (userId) => {
  const user = await UserService.getUserWithById(userId);
  if (!user) {
    throw new Error("user is not found");
  }
  return Reservation.find({
    agency: user._id,
  });
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
            if (deal[service]) {
              balance = balance + deal[service];
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
  getReservationWithById,
  getUserReservationsWithByUserId,
};
