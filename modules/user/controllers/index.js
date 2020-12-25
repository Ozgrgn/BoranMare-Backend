const UserService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");

const getUsers = async (req, res) => {
  const [users_err, users] = await promiseHandler(UserService.getUsers());
  if (users_err) {
    return res.json({ status: false, message: users_err });
  }

  return res.json({ status: true, users });
};

const getUserWithById = async (req, res) => {
  const [user_err, user] = await promiseHandler(
    UserService.getUserWithById(req.params.id)
  );
  if (user_err) {
    return res.json({ status: false, message: user_err });
  }

  return res.json({ status: true, user });
};

module.exports = {
  getUsers,
  getUserWithById,
};
