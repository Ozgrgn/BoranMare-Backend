const { Reservation } = require("../model/index");
const MailService = require("../../mail/services");
const UserService = require("../../user/services");
const RoomService = require("../../room/services");
const OperatorService = require("../../operator/services");
const mailConfig = require("../../../config.json");
const promiseHandler = require("../../utilities/promiseHandler");
const DealService = require("../../deal/services");
const { Deal } = require("../../deal/model");

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
  const operator = await OperatorService.getOperatorWithById(
    reservationDetails.operator
  );

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

  const reservations = await Reservation.find(query, {}, queryOptions)
    .populate("operator")
    .populate("room")
    .populate("agency")
    .sort(
      !sortOptions.operator && !sortOptions.room && !sortOptions.agency
        ? sortOptions
        : null
    )
    .lean()
    .exec();

  await Promise.all(
    reservations.map(async (reservation, index) => {
      const activeDeal = await DealService.getActiveDeal(
        reservation["agency"]["_id"],
        reservation.room,
        reservation.checkIn
      );

      const diffTime = Math.abs(
        new Date(reservation.checkOut) - new Date(reservation.checkIn)
      );
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if(activeDeal.bonusPrice){
      reservation.resBonus = Math.ceil(diffDays * activeDeal.bonusPrice);
    }
      reservations[index] = {
        ...reservations[index],
        resBonus: reservation.resBonus,
      };
      reservation.totalServiceCost = 0;
      reservation.additionalServices.map((service, i) => {
        reservation.totalServiceCost =
          reservation.totalServiceCost - activeDeal[service];

        if (activeDeal[service]) {
          reservations[index][i] = {
            ...reservations[index][i],
            addService: reservation.additionalServices[i],
            serviceCost: -1 * activeDeal[service],
          };
        }
      });
      reservations[index] = {
        ...reservations[index],
        resTotal: reservation.resBonus + reservation.totalServiceCost,
      };
    })
  );

  if (sortOptions.operator || sortOptions.room || sortOptions.agency) {
    let key;
    if (sortOptions.operator) {
      key = "name";
    }
    if (sortOptions.room) {
      key = "title";
    }
    if (sortOptions.agency) {
      key = "fullName";
    }

    reservations.sort((a, b) => {
      if (sortOptions[Object.keys(sortOptions)[0]] == 1) {
        var nameA = a[Object.keys(sortOptions)[0]][key].toUpperCase(); // ignore upper and lowercase
        var nameB = b[Object.keys(sortOptions)[0]][key].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      } else {
        var nameA = a[Object.keys(sortOptions)[0]][key].toUpperCase(); // ignore upper and lowercase
        var nameB = b[Object.keys(sortOptions)[0]][key].toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
      }
    });
  }

  const count = await Reservation.countDocuments(query);

  return { reservations, count };
};
const getReservationWithById = async (reservationId) => {
  return await Reservation.findById(reservationId).populate("room");
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
  let serviceCost = 0;
  let totalAmount = 0;
  user.receipt.map((receipt) => {
    if (receipt) {
      totalAmount = totalAmount + receipt.amount;
    }
  });
  const reservations = await Reservation.find({
    approvedStatus: true,
    agency: user._id,
    checkIn: { $lt: new Date().toISOString() },
  });

  return Promise.all(
    reservations.map(async (reservation) => {
      const activeDeal = await DealService.getActiveDeal(
        user._id,
        reservation.room,
        reservation.checkIn
      );
      const diffTime = Math.abs(
        new Date(reservation.checkOut) - new Date(reservation.checkIn)
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      balance = balance + diffDays * activeDeal.bonusPrice;

      reservation.additionalServices.map((service) => {
        if (activeDeal[service]) {
          balance = balance - activeDeal[service];
          serviceCost = serviceCost + activeDeal[service];
        }
      });
    })
  ).then(() => {
    return { balance, serviceCost, totalAmount };
  });
};
const updateReservationById = async (reservationId, reservation) => {
  return Reservation.findByIdAndUpdate(reservationId, reservation, {
    new: true,
  });
};

const disableReservationWithById = async (reservationId) => {
  await Reservation.updateOne(
    { _id: reservationId },
    { approvedStatus: false }
  );

  return true;
};
const enableReservationWithById = async (reservationId) => {
  await Reservation.updateOne(
    { _id: reservationId },
    { approvedStatus: true },
    {
      new: true,
    }
  );

  return true;
};

const changeResStatusWithById = async (reservationId, reservationStatus) => {
  await Reservation.updateOne(
    { _id: reservationId },
    { reservationStatus: reservationStatus }
  );

  return true;
};

const getAllReservations = async () => {
  return Reservation.find();
};

module.exports = {
  addReservation,
  getReservations,
  getUserBalanceWithByuserId,
  getReservationWithById,
  getUserReservationsWithByUserId,
  updateReservationById,
  disableReservationWithById,
  enableReservationWithById,
  changeResStatusWithById,
  getAllReservations,
};
