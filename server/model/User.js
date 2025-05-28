import mongoose from "mongoose";
import { ConflictException } from "../utils/appError";
import { ErrorCode } from "../config/errorCode";

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

userSchema.post("save", async function (doc, next) {
  const isDuplicateEmail = async (email) => {
    const user = await mongoose.models.User.findOne({ email });
    return user !== null;
  };

  const isDuplicate = await isDuplicateEmail(doc.email);
  if (isDuplicate)
    return new ConflictException(
      "Email already exists",
      ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
    );

  next();
});
