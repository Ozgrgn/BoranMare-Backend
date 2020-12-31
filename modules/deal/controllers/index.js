const DealService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const addDeal = async (req, res) => {
  const [deal_err, deal] = await promiseHandler(DealService.addDeal(req.body));
  if (deal_err) {
    return res.json({ status: false, message: deal_err });
  }

  return res.json({ status: true, deal });
};

const getDeals = async (req, res) => {
  const [deals_err, deals] = await promiseHandler(DealService.getDeals());
  if (deals_err) {
    return res.json({ status: false, message: deals_err });
  }

  return res.json({ status: true, deals });
};

const deleteOneDeal = async (req, res) => {
  const { dealId } = req.params;
  const [deal_err, deal] = await promiseHandler(
    DealService.deleteOneDeal(dealId)
  );
  if (deal_err) {
    return res.json({ status: false, message: deal_err });
  }

  return res.json({ status: true, deal });
};
module.exports = {
  addDeal,
  getDeals,
  deleteOneDeal,
};
