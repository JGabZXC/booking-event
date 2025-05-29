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
  validTokenDate: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  const isDuplicateEmail = async (email) => {
    const user = await mongoose.models.User.findOne({ email });
    if (user && user.email === this.email) return false; // Allow updating own email
    return user !== null;
  };

  const isDuplicate = await isDuplicateEmail(this.email);
  if (isDuplicate)
    return next(
      new ConflictException(
        "Email already exists",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      )
    );

  next();
});

userSchema.methods.comparePassword = async function (
  password,
  candidatePassword
) {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.isPasswordChangedAfter = function (timestamp) {
  if (!this.passwordChangedAt) return false;

  const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return changedTimestamp > timestamp;
};

userSchema.methods.isValidToken = function (tokenDate) {
  if (!this.validTokenDate) return false;
  const tokenTimestamp = Math.floor(this.validTokenDate.getTime() / 1000);

  return tokenTimestamp > tokenDate;
};

const User = mongoose.model("User", userSchema);
export default User;
