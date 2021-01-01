const { User } = require("../model/index");
const { Reservation } = require("../../reservation/model");
const getUsers = async (query = {}, options = {}, user) => {
  const { queryOptions, sortOptions } = options;
  if (query.fullName) {
    query.fullName = { $regex: RegExp(query.fullName + ".*") };
  }
  if (query.country) {
    query.country = { $regex: RegExp(query.country + ".*") };
  }
  if (user.userType == "REGION_MANAGER") {
    const getUser = await UserService.getUserWithById(user.userId);

    query.country = getUser.country;
  }

  const users = await User.find(query, {}, queryOptions)
    .populate("country")
    .sort(sortOptions)
    .lean()
    .exec();

  await Promise.all(
    users.map(async (user, index) => {
      let totalDay = 0;
      let reservationCount = 0;
      const userReservations = await Reservation.find({ agency: user._id });

      await Promise.all(
        userReservations.map((reservation) => {
          reservationCount++;

          const diffTime = Math.abs(
            new Date(reservation.created_at) -
              new Date(reservation.reservationDate)
          );
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalDay = totalDay + diffDays;
        })
      );
      users[index] = {
        ...users[index],
        averageCreatedBetweenReservationDate: totalDay / reservationCount,
      };
    })
  );

  const count = await User.countDocuments(query);

  return { users, count };
};

const getUserWithById = async (userId) => {
  return User.findById(userId).populate("country");
};

const updateUserWithById = async (userId, user) => {
  return User.findByIdAndUpdate(userId, user, { new: true });
};
module.exports = {
  getUsers,
  getUserWithById,
  updateUserWithById,
};
