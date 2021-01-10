const OperatorService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");

const addOperator = async (req, res) => {
  const [operator_err, operator] = await promiseHandler(OperatorService.addOperator(req.body));
  if (operator_err) {
    return res.json({ status: false, message: operator_err });
  }

  return res.json({ status: true, operator });
};

const getOperators = async (req, res) => {
  const [operators_err, operators] = await promiseHandler(OperatorService.getOperators());
  if (operators_err) {
    return res.json({ status: false, message: operators_err });
  }

  return res.json({ status: true, operators });
};

module.exports = {
  addOperator,
  getOperators,
};
