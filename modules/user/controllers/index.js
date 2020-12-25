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
    UserService.getUserWithById(req.params.userId)
  );
  if (user_err) {
    return res.json({ status: false, message: user_err });
  }

  return res.json({ status: true, user });
};

const updateUserWithById = async (req, res) => {
  const [updated_user_err, updated_user] = await promiseHandler(
    UserService.updateUserWithById(req.params.userId, req.body.user)
  );
  if (updated_user_err) {
    return res.json({ status: false, message: updated_user_err });
  }

  return res.json({ status: true, updated_user });
};

module.exports = {
  getUsers,
  getUserWithById,
  updateUserWithById,
};
