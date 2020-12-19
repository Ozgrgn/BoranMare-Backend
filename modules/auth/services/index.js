const bcrypt = require("bcrypt");
const {
  User,
  STATUS_PENDING,
  STATUS_CONFIRMED,
} = require("../../user/model/index");
const MailService = require("../../mail/services");
const mailConfig = require("../../../config.json");
const jsonwebtoken = require("jsonwebtoken");
const jwtSecretKey = require("../../../config.json").jwtConfig.secret;
const promiseHandler = require("../../utilities/promiseHandler");
const cryptoRandomString = require("crypto-random-string");
const signup = async (user) => {
  const findUser = User.findOne({ email: findUuser.email });

  if (findUser) {
    throw new Error("There is such a user");
  }

  const password = await hashPassword(user.password);
  const code = cryptoRandomString({ length: 6, type: "numeric" });
  const savedUser = await new User({
    ...user,
    password,
    emailAuthCode: code,
    userStatus: STATUS_PENDING,
  }).save();

  const [mail_err, mail] = await promiseHandler(
    MailService.sendMail({
      to: savedUser.email,
      from: `${mailConfig.globalName} <${mailConfig.auth.user}>`,
      mailOptions: {
        type: MailService.ACCOUNT_VERIFICATION_CODE_MAIL,
        params: {
          code: code,
        },
      },
    })
  );
  if (mail_err) {
    return { status: false, message: mail_err };
  }

  return { _id: savedUser._id };
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

const checkPassword = async (password, password2) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const check = await bcrypt.compare(password2, hash);

  return check;
};

const signupVerify = async (info) => {
  const user = await User.findById(info.userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailAuthCode === info.code) {
    user.userStatus = STATUS_CONFIRMED;
    user.emailAuthCode = undefined;
    await user.save();

    return { message: "Registiration is success." };
  } else {
    throw new Error("Code is wrong");
  }
};

const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    throw new Error("Wrong password");
  }

  const token = await jsonwebtoken.sign(
    { username, userId: user._id },
    jwtSecretKey
  );

  return { token, username, userId: user._id, fullName: user.fullName };
};
module.exports = {
  signup,
  checkPassword,
  hashPassword,
  signupVerify,
  login,
};
