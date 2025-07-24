import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { BadRequestException, ConflictException } from "../utils/appError.js";
import { ErrorCode } from "../config/errorCode.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  ticketsPurchased: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  validTokenDate: Date,
  passwordChangedAt: Date,
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.passwordConfirm = undefined;
  next();
});
const User = mongoose.model("User", userSchema);
export default User;
