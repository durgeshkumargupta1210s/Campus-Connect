import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendRegistrationConfirmation } from '../utils/emailService.js';

export const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existing = await Registration.findOne({ event: eventId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Already registered' });
    }

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id
    });

    event.registrations.push(registration._id);
    event.registeredCount = event.registrations.length;
    await event.save();

    // Add to user's registrations
    const user = await User.findById(req.user._id);
    await User.findByIdAndUpdate(req.user._id, {
      $push: { registeredEvents: registration._id }
    });

    // Send confirmation email for workshops or if there's a payment
    const isWorkshop = event.category === 'workshop';
    
    // Check if there's a payment for this registration
    const Payment = (await import('../models/Payment.js')).default;
    const payment = await Payment.findOne({
      user: req.user._id,
      $or: [
        { relatedTo: 'registration', relatedId: registration._id },
        { relatedTo: 'ticket', relatedId: event._id }
      ],
      status: 'completed'
    });

    const isPaidEvent = !!payment;
    
    // Send email for workshops or paid events
    if (isWorkshop || isPaidEvent) {
      const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'TBA';

      await sendRegistrationConfirmation(
        user.email,
        user.name,
        event.title,
        eventDate,
        event.location || 'TBA',
        isPaidEvent,
        payment ? payment.amount : 0
      );
    }

    res.status(201).json({
      message: 'Registered successfully',
      registration
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    
    // Admin can see all registrations, regular users see only their own
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const registrations = await Registration.find(filter)
      .populate('event', 'title date location category isPaid price')
      .populate('user', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ registeredAt: -1 })
      .exec();

    // Fetch payment information for each registration
    const Payment = (await import('../models/Payment.js')).default;
    const registrationsWithPayments = await Promise.all(
      registrations.map(async (registration) => {
        const registrationObj = registration.toObject();
        
        // Find payment for this registration
        const payment = await Payment.findOne({
          user: registration.user._id,
          relatedTo: 'ticket',
          relatedId: registration.event._id,
          status: 'completed'
        }).sort({ createdAt: -1 });

        if (payment) {
          registrationObj.payment = {
            transactionId: payment.transactionId,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            status: payment.status,
            paidAt: payment.paidAt
          };
        }
        
        return registrationObj;
      })
    );

    const count = await Registration.countDocuments(filter);

    res.json({
      registrations: registrationsWithPayments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration cancelled', registration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
