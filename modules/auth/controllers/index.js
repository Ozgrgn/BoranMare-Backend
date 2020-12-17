const AuthService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");

const signup = async (req, res) => {
  const user = req.body;
  const [signup_err, signup] = await promiseHandler(AuthService.signup(user));
  if (signup_err) {
    return res.json({ status: false, message: signup_err });
  }
  return res.json({ status: true, signup });
};

const signupVerify = async (req, res) => {
  const info = req.body;

  const [signup_verify_err, signup_verify] = await promiseHandler(
    AuthService.signupVerify(info)
  );
  if (signup_verify_err) {
    return res.json({ status: false, message: signup_verify_err });
  }
  return res.json({ status: true, signup_verify });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const [login_err, login] = await promiseHandler(
    AuthService.login(username, password)
  );
  if (login_err) {
    return res.json({ status: false, message: login_err });
  }
  return res.json({ status: true, ...login });
};
module.exports = {
  signup,
  signupVerify,
  login,
};
