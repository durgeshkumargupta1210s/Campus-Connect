import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const getAllBookings = async (_req, res) => {
  try {
    const bookings = await Booking.find().populate("event").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ message: "Failed to fetch booking", error: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.userId })
      .populate("event")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { eventId, showId, userName, userEmail, seats, totalPrice } = req.body;

    if (!eventId || !userEmail || !seats || seats.length === 0) {
      return res.status(400).json({ message: "Missing booking details" });
    }

    // Check seat availability
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    for (let seat of seats) {
      if (show.occupiedSeats[seat]) {
        return res.status(409).json({ message: `Seat ${seat} is already booked` });
      }
    }

    // Mark seats as occupied
    for (let seat of seats) {
      show.occupiedSeats[seat] = userEmail;
    }
    show.availableSeats -= seats.length;
    await show.save();

    // Create booking record
    const booking = await Booking.create({
      event: eventId,
      userName,
      userEmail,
      bookedSeats: seats,
      amount: totalPrice,
      isPaid: true,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Release seats
    const show = await Show.findById(booking.showId);
    if (show) {
      for (let seat of booking.bookedSeats) {
        delete show.occupiedSeats[seat];
      }
      show.availableSeats += booking.bookedSeats.length;
      await show.save();
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ message: "Failed to cancel booking", error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Failed to delete booking", error: err.message });
  }
};
