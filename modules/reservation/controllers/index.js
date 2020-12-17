const ReservationService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const addReservation = async (req, res) => {
  const [reservation_err, reservation] = await promiseHandler(
    ReservationService.addReservation(req.body)
  );
  if (reservation_err) {
    return res.json({ status: false, message: reservation_err });
  }

  return res.json({ status: true, reservation });
};

const getReservations = async (req, res) => {
  const [reservations_err, reservations] = await promiseHandler(
    ReservationService.getReservations()
  );
  if (reservations_err) {
    return res.json({ status: false, message: reservations_err });
  }

  return res.json({ status: true, reservations });
};

module.exports = {
  addReservation,
  getReservations,
};
