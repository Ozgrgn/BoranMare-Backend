const { User } = require("../model/index");

const getUsers = async () => {
  return User.find();
};

const getUserWithById = async (userId) => {
  return User.findById(userId);
};
module.exports = {
  getUserWithById,
  getUsers,
};
