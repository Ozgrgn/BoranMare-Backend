const { User } = require("../model/index");

const getUsers = async () => {
  return User.find();
};

const getUserWithById = async (userId) => {
  return User.findById(userId).populate("country").exec();
};
module.exports = {
  getUserWithById,
  getUsers,
};
