const mongoose = require("mongoose");
const STATUS = {
  STATUS_PENDING: "PENDING",
  STATUS_CONFIRMED: "CONFIRMED",
  STATUS_DECLINED: "DECLINED",
};
const ReservationSchema = new mongoose.Schema(
  {
    voucherId: { type: String, required: true },
    roomType: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    reservationStatus: {
      type: String,

      enum: [
        STATUS.STATUS_CONFIRMED,
        STATUS.STATUS_DECLINED,
        STATUS.STATUS_PENDING,
      ],
      default: STATUS.STATUS_PENDING,
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Reservation = mongoose.model("reservations", ReservationSchema);

module.exports = {
  Reservation,
};
