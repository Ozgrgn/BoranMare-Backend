const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    users: [
      {
        user: { type: String, required: true },
        seen: { type: Boolean, default: false },
        _id: false,
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Message = mongoose.model("messages", MessageSchema);

module.exports = {
  Message,
};
