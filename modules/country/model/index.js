const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    key: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Country = mongoose.model("countries", CountrySchema);

module.exports = {
  Country,
};
