import Ticket from '../models/Ticket.js';
import { v4 as uuidv4 } from 'uuid';

export const createTicket = async (req, res) => {
  try {
    const { eventId, type, price, quantity } = req.body;

    const ticket = await Ticket.create({
      user: req.user._id,
      event: eventId,
      ticketNumber: `TICKET-${uuidv4()}`,
      type,
      price,
      quantity
    });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('event')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ purchasedAt: -1 })
      .exec();

    const count = await Ticket.countDocuments({ user: req.user._id });

    res.json({
      tickets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('event');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkInTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'used', checkedInAt: Date.now() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Checked in successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
