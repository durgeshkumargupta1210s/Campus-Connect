import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Event" },
    showDateTime: { type: Date, required: true },
    showPrice: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    theater: { type: String },
    occupiedSeats: { type: Object, default: {} },
  },
  { minimize: false }
);

const Show = mongoose.model("Show", showSchema);

export default Show;
