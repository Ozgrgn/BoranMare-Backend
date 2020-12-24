const mongoose = require("mongoose");

const DealSchema = new mongoose.Schema(
  {
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countries",
      required: false,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: false,
    },
    bonusPrice: { type: Number, required: true },
    servicePrice1: { type: Number, required: true },
    servicePrice2: { type: Number, required: true },
    servicePrice3: { type: Number, required: true },
    servicePrice4: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Deal = mongoose.model("deals", DealSchema);

module.exports = {
  Deal,
};
