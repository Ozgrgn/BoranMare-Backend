const jwt = require("jsonwebtoken");
const secret = require("../../../config.json").jwtConfig.secret;
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, secret);
    if (decoded) req.user = decoded;
    return next();
  } catch (err) {
    return next();
  }
};
