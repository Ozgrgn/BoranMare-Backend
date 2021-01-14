const { Deal } = require("../model/index");
const UserService = require("../../user/services");
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

const updateDealWithById = async (dealId, deal) => {
  return Deal.findByIdAndUpdate(dealId, deal, { new: true });
};

const getActiveDeal = async (agencyId, room, checkIn) => {
  let filter = {};
  console.log(agencyId,room,checkIn)

  const agency = await UserService.getUserWithById(agencyId);

  filter.startDate = {
    $lte: checkIn,
  };

  filter.endDate = {
    $gte: checkIn,
  };

  filter.country = agency.country;
  filter.room = room;
  return Deal.findOne(filter);
};
module.exports = {
  addDeal,
  getDeals,
  deleteOneDeal,
  updateDealWithById,
  getActiveDeal,
};
