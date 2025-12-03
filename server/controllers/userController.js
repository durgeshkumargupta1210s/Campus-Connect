import User from "../models/User.js";
import Booking from "../models/Booking.js";

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

export const upsertUser = async (req, res) => {
  try {
    const { clerkId, name, email, image } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOneAndUpdate(
      { email },
      { clerkId, name, email, image },
      { upsert: true, new: true }
    );

    res.json(user);
  } catch (err) {
    console.error("Error upserting user:", err);
    res.status(500).json({ message: "Failed to upsert user", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookings = await Booking.find({ userEmail: user.email }).populate("event");

    res.json({
      user,
      bookings,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Failed to fetch user profile", error: err.message });
  }
};
