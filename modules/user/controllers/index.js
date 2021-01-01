const UserService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const _ = require("lodash");

const getUsers = async (req, res) => {
  const user = req.user;
  const {
    email,
    fullName,
    name,
    phone,
    country,
    balance,
    limit,
    sort,
    skip,
  } = req.query;
  const usersQuery = _.omitBy(
    {
      email,
      fullName,
      name,
      phone,
      country,
      balance,
    },
    (a) => a === undefined
  );

  const [users_err, users] = await promiseHandler(
    UserService.getUsers(
      usersQuery,
      {
        queryOptions: { limit, skip },
        sortOptions: sort ? JSON.parse(sort) : { fullName: -1 },
      },
      user
    )
  );

  if (users_err) {
    return res.json({ status: false, message: users_err });
  }

  return res.json({ status: true, ...users });
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
