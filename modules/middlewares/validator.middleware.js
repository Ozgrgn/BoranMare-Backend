const { matchedData, validationResult } = require("express-validator");

module.exports = function (req, res, next) {
	const { errors } = validationResult(req);
	if (errors.length > 0) {
		return res.json({ status: false, message: errors });
	}

	req.query = matchedData(req, { locations: ["query"] });
	req.params = matchedData(req, { locations: ["params"] });
	req.body = matchedData(req, { locations: ["body"] });

	return next();
};
