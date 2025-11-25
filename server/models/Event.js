// server/models/Event.js
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: Number },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overview: String,
    poster_path: { type: String, required: true },
    backdrop_path: String,
    release_date: String,          // "2025-03-21" etc.
    tagline: String,
    genres: [genreSchema],         // [{name: "Tech"}, {name:"Cultural"}]
    vote_average: { type: Number, default: 0 },
    runtime: { type: Number, default: 0 }, // in minutes
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
