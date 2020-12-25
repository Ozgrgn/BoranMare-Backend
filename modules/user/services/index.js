const { User } = require("../model/index");

const getUsers = async () => {
  return User.find();
};

const getUserWithById = async (userId) => {
  return User.findById(userId).populate("country");
};

const updateUserWithById = async (userId, user) => {
  console.log(user)
  return User.findByIdAndUpdate(userId, user,{new: true})
};
module.exports = {
  getUsers,
  getUserWithById,
  updateUserWithById,
};
