const CountryService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const addCountry = async (req, res) => {
  const [country_err, country] = await promiseHandler(
    CountryService.addCountry(req.body)
  );
  if (country_err) {
    return res.json({ status: false, message: country_err });
  }

  return res.json({ status: true, country });
};

const getCountries = async (req, res) => {
  const [countries_err, countries] = await promiseHandler(
    CountryService.getCountries()
  );
  if (countries_err) {
    return res.json({ status: false, message: countries_err });
  }

  return res.json({ status: true, countries });
};

module.exports = {
  addCountry,
  getCountries,
};
