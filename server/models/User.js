import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: String,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;