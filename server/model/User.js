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
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) next();

  if (this.password !== this.passwordConfirm) {
    return next(
      new BadRequestException(
        "Password and password confirmation do not match",
        ErrorCode.AUTH_PASSWORD_MISMATCH
      )
    );
  }

  this.password = bcrypt.hashSync(this.password, 12);
  this.passwordConfirm = undefined;
  console.log("done");
  next();
});

userSchema.pre("save", async function (next) {
  const isDuplicateEmail = async (email) => {
    const user = await mongoose.models.User.findOne({ email });
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
  console.log();
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.isValidToken = function (tokenDate) {
  if (!this.validTokenDate) return false;
  const tokenTimeStamp = Math.floor(this.validTokenDate.getTime() / 1000);

  return tokenDate < tokenTimeStamp;
};

const User = mongoose.model("User", userSchema);
export default User;
