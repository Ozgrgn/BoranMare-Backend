const { User } = require("../model/index");


const getUsers = async (query={}, options ={},user) => {
  const { queryOptions, sortOptions } = options;
  if (query.fullName) {
    query.fullName = { $regex: RegExp(query.fullName + ".*") };
  }
  if (query.country) {
    query.country = { $regex: RegExp(query.country + ".*") };
  }
  if (user.userType == "REGION_MANAGER") {
    const getUser = await UserService.getUserWithById( user.userId);

    query.country = getUser.country;
  }

  const usersQuery = User.find(query, {}, queryOptions).populate("country");

  const users = await usersQuery.sort(sortOptions).exec();
  const count = await User.countDocuments(query);
  console.log(users);
  return { users, count };
  
};


const getUserWithById = async (userId) => {
  return User.findById(userId).populate("country");
};

const updateUserWithById = async (userId, user) => {
  return User.findByIdAndUpdate(userId, user,{new: true})
};
module.exports = {
  getUsers,
  getUserWithById,
  updateUserWithById,
};
