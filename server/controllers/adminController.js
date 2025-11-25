import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const getDashboardStats = async (_req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, revenue: { $sum: "$amount" } } },
    ]);

    res.json({
      totalEvents,
      totalBookings,
      totalShows,
      totalRevenue: totalRevenue[0]?.revenue || 0,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const bookings = await Booking.find()
      .populate("event")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching recent bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

export const getEventsWithStats = async (_req, res) => {
  try {
    const events = await Event.find();
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({ event: event._id });
        const shows = await Show.find({ eventId: event._id });
        return {
          ...event.toObject(),
          totalBookings: bookings.length,
          totalShows: shows.length,
          totalRevenue: bookings.reduce((sum, b) => sum + (b.amount || 0), 0),
        };
      })
    );

    res.json(eventsWithStats);
  } catch (err) {
    console.error("Error fetching events with stats:", err);
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};
