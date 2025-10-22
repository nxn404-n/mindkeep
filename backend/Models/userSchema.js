import mongoose, { Mongoose } from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  notes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note"
  }
});

const User = mongoose.model("User", userSchema);
export default User;