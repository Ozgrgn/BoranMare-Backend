const mongoose = require("mongoose");
const STATUS = {
  STATUS_PENDING: "PENDING",
  STATUS_CONFIRMED: "CONFIRMED",
  STATUS_DECLINED: "DECLINED",
  STATUS_NOTINFORMED: "NOTINFORMED",
  STATUS_INSIDE: "INSIDE",
  STATUS_STATUS_GONE: "GONE",
};
const ReservationSchema = new mongoose.Schema(
  {
    voucherId: { type: String, required: true },
    operator: { type: String, required: true },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: true,
    },
    reservationDate: { type: String },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    adultPax: { type: Number, required: true },
    child1Pax: { type: Number },
    child2Pax: { type: Number },
    names: String,
    notes: String,
    reservationStatus: {
      type: String,

      enum: [
        STATUS.STATUS_CONFIRMED,
        STATUS.STATUS_DECLINED,
        STATUS.STATUS_PENDING,
        STATUS.STATUS_NOTINFORMED,
        STATUS.STATUS_INSIDE,
        STATUS.STATUS_GONE,
      ],
      default: STATUS.STATUS_PENDING,
    },
    approvedStatus: { type: Boolean, default: false },

    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    resId: { type: Number, default: 3000 },
    additionalServices: { type: Array, default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Reservation = mongoose.model("reservations", ReservationSchema);

module.exports = {
  Reservation,
};
