import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import { sendEventCreatedToAdmin, sendEventCreatedNotification } from '../utils/emailService.js';

export const createEvent = async (req, res) => {
  try {
    const { 
      title, description, category, date, time, duration, location, venue, imageUrl, 
      capacity, organizer, tags, isPaid, price, paymentMethods, paymentDeadline 
    } = req.body;

    // Map frontend payment methods to backend format
    const paymentMethodMapping = {
      'card': 'credit_card',
      'upi': 'upi',
      'netbanking': 'net_banking'
    };
    
    const mappedPaymentMethods = paymentMethods?.map((m) => 
      paymentMethodMapping[m] || m
    ) || [];

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      duration,
      location,
      venue,
      imageUrl,
      capacity,
      organizer,
      tags,
      isPaid: isPaid || false,
      price: isPaid ? (price || 0) : 0,
      paymentMethods: isPaid ? mappedPaymentMethods : [],
      paymentDeadline: isPaid && paymentDeadline ? new Date(paymentDeadline) : undefined,
      createdBy: req.user._id
    });

    // Send email to admin who created the event
    const admin = await User.findById(req.user._id);
    if (admin && admin.email) {
      const eventDate = date ? new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'TBA';

      await sendEventCreatedToAdmin(admin.email, {
        title: event.title,
        date: eventDate,
        location: location || 'TBA',
        category: category || 'Event',
        capacity: capacity || 0,
        id: event._id.toString()
      });
    }

    // Send notification to subscribers (if subscription system exists)
    // For now, this is a placeholder - you can implement subscription system later
    await sendEventCreatedNotification({
      title: event.title,
      date: date ? new Date(date).toLocaleDateString('en-IN') : 'TBA',
      location: location || 'TBA',
      description: description || '',
      id: event._id.toString()
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await Event.find(filter)
      .populate('organizer')
      .populate('createdBy')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 })
      .exec();

    const count = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer')
      .populate('registrations');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { 
      title, description, category, date, time, duration, location, venue, imageUrl, 
      capacity, organizer, tags, isPaid, price, paymentMethods, paymentDeadline, ...rest 
    } = req.body;

    // Map frontend payment methods to backend format
    const paymentMethodMapping = {
      'card': 'credit_card',
      'upi': 'upi',
      'netbanking': 'net_banking'
    };
    
    const mappedPaymentMethods = paymentMethods ? paymentMethods.map((m) => 
      paymentMethodMapping[m] || m
    ) : [];

    const updateData = {
      ...rest,
      title,
      description,
      category,
      date,
      time,
      duration,
      location,
      venue,
      imageUrl,
      capacity,
      organizer,
      tags,
      updatedAt: Date.now()
    };

    // Add payment fields if provided
    if (isPaid !== undefined) {
      updateData.isPaid = isPaid;
      updateData.price = isPaid ? (price || 0) : 0;
      updateData.paymentMethods = isPaid ? mappedPaymentMethods : [];
      updateData.paymentDeadline = isPaid && paymentDeadline ? new Date(paymentDeadline) : undefined;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: req.params.id });

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: 'upcoming',
      date: { $gte: new Date() }
    })
      .populate('organizer')
      .sort({ date: 1 })
      .limit(10);

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
