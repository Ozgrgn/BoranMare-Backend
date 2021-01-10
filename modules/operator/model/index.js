const mongoose = require("mongoose");

const OperatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }
  },  
  {
    status: { type: Boolean, required: true, default:true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Operator = mongoose.model("operators", OperatorSchema);

module.exports = {
  Operator,
};
