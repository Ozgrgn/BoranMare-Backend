module.exports = (options) => {
  const { allowedTypes } = options;
  return async (req, res, next) => {
    if (!allowedTypes) {
      return next();
    }

    const { user } = req;
    if (!user) {
      return res.json({ status: false, message: "Not logged in!" });
    }

    const isAllowedType = allowedTypes.find((type) => type === user.userType);

    if (!isAllowedType) {
      return res.json({
        status: false,
        message: `User type ${user.type} is not allowed!`,
      });
    }

    return next();
  };
};
