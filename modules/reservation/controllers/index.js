const ReservationService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const { Reservation } = require("../model");
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

const getUserBalanceWithByuserId = async (req, res) => {
  const [balance_err, balance] = await promiseHandler(
    ReservationService.getUserBalanceWithByuserId(req.params.userId)
  );
  if (balance_err) {
    return res.json({ status: false, message: balance_err });
  }

  return res.json({ status: true, balance });
};

const getReservationWithById = async (req,res) => {
  const [reservation_err, reservation] = await promiseHandler(
    ReservationService.getReservationWithById(req.params.reservationId)
  );
  if(reservation_err){
    return res.json({status: false, message:reservation_err});
  }
  return res.json({status: true, reservation});
  };
  
  const getUserReservationsWithByUserId = async (req,res) => {
    const [reservation_err, reservation] = await promiseHandler(
      ReservationService.getUserReservationsWithByUserId(req.params.userId)
    );
    if(reservation_err){
      return res.json({status: false, message:reservation_err});
    }
    return res.json({status: true, reservation});
    };


module.exports = {
  addReservation,
  getReservations,
  getUserBalanceWithByuserId,
  getReservationWithById,
  getUserReservationsWithByUserId
};
