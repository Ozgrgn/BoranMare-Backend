const { Country } = require("../model/index");
const addCountry = async (countryDetails) => {
  return new Country(countryDetails).save();
};
const getCountries = async (countryDetails) => {
  return Country.find();
};

module.exports = {
  addCountry,
  getCountries,
};
