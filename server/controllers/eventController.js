import Event from "../models/Event.js";

export const getAllEvents = async (_req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Failed to fetch event", error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      tagline,
      genres,
      vote_average,
      runtime,
    } = req.body;

    const event = await Event.create({
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      tagline,
      genres,
      vote_average,
      runtime,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Failed to create event", error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
};
