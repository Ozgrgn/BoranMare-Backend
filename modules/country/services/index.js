const { Country } = require("../model/index");
const addCountry = async (countryDetails) => {
  return new Country(countryDetails).save();
};
const getCountries = async () => {
  return Country.find();
};

const getCountryWithById = async(countryId) => {
  return Country.findById(countryId)
}

module.exports = {
  addCountry,
  getCountries,
  getCountryWithById
};
