const { Deal } = require("../model/index");
const addDeal = async (dealDetails) => {
  return new Deal(dealDetails).save();
};
const getDeals = async () => {
  return Deal.find();
};

module.exports = {
  addDeal,
  getDeals,
};
