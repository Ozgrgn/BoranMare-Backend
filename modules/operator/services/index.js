const { Operator } = require("../model/index");

const addOperator = async (operatorDetails) => {
  return new Operator(operatorDetails).save();
};
const getOperators = async () => {
  return Operator.find();
};
const getOperatorWithById = async (operatorId) => {
  return Operator.findById(operatorId).exec();
};

module.exports = {
  addOperator,
  getOperators,
  getOperatorWithById,
};
