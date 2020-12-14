const mongoose = require("mongoose");
const AuthModel = require("../../auth/model/index");
const STATUS = {
  STATUS_PENDING: "PENDING",
  STATUS_CONFIRMED: "CONFIRMED",
  STATUS_DECLINED: "DECLINED",
};
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    balance: { type: Number, required: false },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    emailAuthCode: { type: String, required: false },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countries",
      required: false,
    },

    userType: {
      type: String,
      enum: [
        AuthModel.TYPE_ADMIN,
        AuthModel.TYPE_AGENCY,
        AuthModel.TYPE_REGION_MANAGER,
      ],
      required: true,
    },
    userStatus: {
      type: String,
      enum: [
        STATUS.STATUS_CONFIRMED,
        STATUS.STATUS_DECLINED,
        STATUS.STATUS_PENDING,
      ],
      default: STATUS.STATUS_PENDING,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("users", UserSchema);

module.exports = {
  User,
  UserSchema,
  ...STATUS,
};
