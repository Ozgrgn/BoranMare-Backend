const { Deal } = require("../model/index");
const addDeal = async (dealDetails) => {
  return new Deal(dealDetails).save();
};
const getDeals = async () => {
  return Deal.find({}, {}, { sort: { startDate: 1 } }).populate([
    "room",
    "country",
  ]);
};

const deleteOneDeal = async (dealId) => {
  await Deal.deleteOne({ _id: dealId });

  return true;
};
module.exports = {
  addDeal,
  getDeals,
  deleteOneDeal,
};
