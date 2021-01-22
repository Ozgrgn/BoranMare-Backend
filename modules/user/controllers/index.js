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
    userStatus,
  } = req.query;
  const usersQuery = _.omitBy(
    {
      email,
      fullName,
      name,
      phone,
      country,
      balance,
      userStatus,
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
const changeUserStatusWithById = async (req, res) => {
  const userId = req.params.userId;
  const userStatus = req.body.userStatus;

  const [err, user] = await promiseHandler(
    UserService.changeUserStatusWithById(userId, userStatus)
  );

  if (err) {
    return res.json({ status: false, message: err });
  }

  const [user_err, updated_user] = await promiseHandler(
    UserService.changeUserStatusWithById(userId, userStatus)
  );

  if (user_err) {
    return res.json({ status: false, message: user_err });
  }
  return res.json({ status: true });
};

const addReceiptWithById = async (req, res) => {
  const userId = req.params.userId;
  const receiptDate = req.body.receiptDate;
  const description = req.body.description;
  const amount = req.body.amount;

  const [err, user] = await promiseHandler(
    UserService.addReceiptWithById(userId, receiptDate, description, amount)
  );

  if (err) {
    return res.json({ status: false, message: err });
  }

  return res.json({ status: true });
};

const deleteOneReceipt = async (req, res) => {
  const userId = req.params.userId;
  const createDate = req.params.createDate;
  
  const [err, user] = await promiseHandler(
    UserService.deleteOneReceipt(userId, createDate)
  );

  if (err) {
    return res.json({ status: false, message: err });
  }

  return res.json({ status: true,user });
};


const getAgencies= async (req, res) => {
  const [users_err, users] = await promiseHandler(
    UserService.getAgencies()
  );
  if (users_err) {
    return res.json({ status: false, message: users_err });
  }

  return res.json({ status: true, users });
};
const getManagers= async (req, res) => {
  const [users_err, users] = await promiseHandler(
    UserService.getManagers()
  );
  if (users_err) {
    return res.json({ status: false, message: users_err });
  }

  return res.json({ status: true, users });
};
module.exports = {
  getUsers,
  getUserWithById,
  updateUserWithById,
  changeUserStatusWithById,
  addReceiptWithById,
  deleteOneReceipt,
  getAgencies,
  getManagers
};
