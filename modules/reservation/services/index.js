const { Reservation } = require("../model/index");
const addReservation = async (reservationDetails) => {
  return new Reservation(reservationDetails).save();
};
const getReservations = async () => {
  return Reservation.find();
};

module.exports = {
  addReservation,
  getReservations,
};
