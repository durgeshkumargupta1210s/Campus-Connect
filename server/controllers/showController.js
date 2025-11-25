import Show from "../models/Show.js";

export const getAllShows = async (_req, res) => {
  try {
    const shows = await Show.find().populate("eventId").sort({ showDateTime: 1 });
    res.json(shows);
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ message: "Failed to fetch shows", error: err.message });
  }
};

export const getShowsByEventId = async (req, res) => {
  try {
    const shows = await Show.find({ eventId: req.params.eventId }).sort({ showDateTime: 1 });
    res.json(shows);
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ message: "Failed to fetch shows", error: err.message });
  }
};

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate("eventId");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    console.error("Error fetching show:", err);
    res.status(500).json({ message: "Failed to fetch show", error: err.message });
  }
};

export const createShow = async (req, res) => {
  try {
    const { eventId, showDateTime, showPrice, totalSeats, theater } = req.body;

    if (!eventId || !showDateTime || !showPrice || !totalSeats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const show = await Show.create({
      eventId,
      showDateTime,
      showPrice,
      totalSeats,
      availableSeats: totalSeats,
      theater,
      occupiedSeats: {},
    });

    res.status(201).json(show);
  } catch (err) {
    console.error("Error creating show:", err);
    res.status(500).json({ message: "Failed to create show", error: err.message });
  }
};

export const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    console.error("Error updating show:", err);
    res.status(500).json({ message: "Failed to update show", error: err.message });
  }
};

export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json({ message: "Show deleted successfully" });
  } catch (err) {
    console.error("Error deleting show:", err);
    res.status(500).json({ message: "Failed to delete show", error: err.message });
  }
};

export const getAvailableSeats = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const availableSeats = [];
    for (let i = 1; i <= show.totalSeats; i++) {
      if (!show.occupiedSeats[i]) {
        availableSeats.push(i);
      }
    }

    res.json({ showId: show._id, availableSeats, totalSeats: show.totalSeats });
  } catch (err) {
    console.error("Error fetching available seats:", err);
    res.status(500).json({ message: "Failed to fetch seats", error: err.message });
  }
};
