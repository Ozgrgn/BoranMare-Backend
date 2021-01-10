
const bcrypt = require("bcrypt");
const { User } = require("../model/index");
const { Reservation } = require("../../reservation/model");
const getUsers = async (query = {}, options = {}, user) => {
  const { queryOptions, sortOptions } = options;
  if (query.fullName) {
    query.fullName = { $regex: RegExp(query.fullName + ".*",'i') };
  }

  if (query.name) {
    query.name = { $regex: RegExp(query.name + ".*",'i') };
  }
  console.log(user.userType)
  if (user.userType == "REGION_MANAGER") {
    const getUser = await getUserWithById(user.userId);
    console.log(getUser)

    query.country = getUser.country;
  }
  query.userType = "AGENCY"

  const users = await User.find(query, {}, queryOptions)
    .populate("country")
    .sort(sortOptions)
    .lean()
    .exec();

  await Promise.all(
    users.map(async (user, index) => {
      
      let totalDay = 0;
      let reservationCount = 0;
      let cancelCount = 0;
   
       const userReservations = await Reservation.find({ agency: user._id });
      

      await Promise.all(
        userReservations.map((reservation) => {
          if(reservation.reservationStatus=="PASSIVE") 
          {cancelCount++;}
         if(reservation.reservationStatus!=="PASSIVE") 
        { reservationCount++;

          const diffTime = Math.abs(
            new Date(reservation.created_at) -
              new Date(reservation.reservationDate)
          );
          const diffDays = (diffTime / (1000 * 60 * 60 * 24));
          totalDay = totalDay + diffDays;
        }})
      );
      users[index] = {
        ...users[index],
        averageCreatedBetweenReservationDate: Math.ceil(totalDay / reservationCount),
        reservationCount:reservationCount,
        cancelRate:Math.ceil(cancelCount/(reservationCount+cancelCount)*100)
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
  if(user.password) {
  user.password = await hashPassword(user.password);
  }
  return User.findByIdAndUpdate(userId, user, { new: true });
};
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};
const getUsersOnlyIds = async (query = {}) => {
  console.log( {
    $match: {
      ...query,
    },
  })
  return User.aggregate([
    {
      $match: {
        ...query,
      },
    },

    {
      $project: {
        _id: 0,
        user: "$_id",
      },
    },
  ]);
};
const changeUserStatusWithById = async (userId, userStatus) => {
  await User.updateOne(
    { _id: userId },
    { userStatus: userStatus }
  );

  return true;
};
module.exports = {
  getUsers,
  getUserWithById,
  updateUserWithById,
  getUsersOnlyIds,
  changeUserStatusWithById,
};
