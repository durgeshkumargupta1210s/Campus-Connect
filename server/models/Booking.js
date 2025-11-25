// server/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },

    userName: String,
    userEmail: String,

    bookedSeats: [{ type: String, required: true }], // ["A1","A2"]
    amount: { type: Number, default: 0 },

    date: { type: String, required: true }, // "2025-07-24"
    time: { type: String, required: true }, // ISO string: "2025-07-24T01:00:00.000Z"

    isPaid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
